from fastapi import APIRouter, HTTPException, Depends, status, Body
from typing import List, Optional
from datetime import datetime
import os
import json
from bson import ObjectId
import requests

from ...db.database import MongoDB
from ...api.deps import get_current_user
from ...config import settings

router = APIRouter()

# Together AI API endpoint
TOGETHER_AI_API_URL = "https://api.together.xyz/v1/completions"

# Llama 3.3 70B model ID
MODEL_ID = "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free"

# Use Together AI API key directly
TOGETHER_AI_API_KEY = "19c65325e4ed91091d956bdab0a8d9bdf9cd7ef43ac4d3afa3a9084c00884023"


@router.post("/chat")
async def chat_with_documents(
    message: str = Body(..., embed=True),
    current_user: dict = Depends(get_current_user)
):
    """
    Chat with the RAG chatbot using documents as knowledge base.
    """
    try:
        if not TOGETHER_AI_API_KEY:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Together AI API key not configured"
            )

        # Get all documents from the database
        documents = list(MongoDB.db.rag_documents.find())
        
        if not documents:
            # If no documents, just use the model without RAG
            return await generate_response(message)
        
        # Perform RAG - find relevant documents for the query
        relevant_docs = retrieve_relevant_documents(message, documents)
        
        # Generate response using the model with context from relevant documents
        response = await generate_response(message, relevant_docs)
        
        # Log the chat for history
        chat_log = {
            "user_id": str(current_user["_id"]),
            "message": message,
            "response": response,
            "timestamp": datetime.utcnow()
        }
        MongoDB.db.chat_logs.insert_one(chat_log)
        
        return {"response": response}

    except Exception as e:
        print(f"Chat error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during chat: {str(e)}"
        )


def retrieve_relevant_documents(query, documents, max_docs=3):
    """
    Simple retrieval function to find relevant documents for the query.
    In a production environment, you would use a vector database or embedding-based search.
    """
    # Simple keyword matching for now
    # In a real implementation, you would use embeddings and vector similarity
    relevant_docs = []
    
    for doc in documents:
        text_content = doc.get("text_content", "")
        # Simple relevance score based on word overlap
        query_words = set(query.lower().split())
        content_words = set(text_content.lower().split())
        overlap = len(query_words.intersection(content_words))
        
        if overlap > 0:
            relevant_docs.append({
                "content": text_content,
                "score": overlap,
                "name": doc.get("name", "Unknown"),
                "id": str(doc["_id"])
            })
    
    # Sort by relevance score and take top N
    relevant_docs.sort(key=lambda x: x["score"], reverse=True)
    return relevant_docs[:max_docs]


def clean_response_text(text):
    """
    Clean the response text by removing HTML tags and other unwanted elements.
    """
    import re
    # Remove HTML tags like <t> and </t>
    text = re.sub(r'</?t>', '', text)
    # Remove any other HTML-like tags that might appear
    text = re.sub(r'</?[a-z][^>]*>', '', text)
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    return text

async def generate_response(message, relevant_docs=None):
    """
    Generate a response using Together AI's Llama 3.3 70B model.
    If relevant_docs is provided, use them as context for RAG.
    """
    # Prepare the prompt with context if available
    if relevant_docs and len(relevant_docs) > 0:
        context = "\n\n".join([f"Document: {doc['name']}\n{doc['content']}" for doc in relevant_docs])
        prompt = f"<s>[INST] You are a friendly AI assistant for a website that provides AI models. Respond in a conversational, human-like tone. Be concise and focus only on the most important information. Keep your response under 3 sentences when possible. Do not use HTML tags in your response.\n\nDocuments:\n{context}\n\nUser Question: {message} [/INST]</s>"
    else:
        prompt = f"<s>[INST] You are a friendly AI assistant for a website that provides AI models. Respond in a conversational, human-like tone. Be concise and focus only on the most important information. Keep your response under 3 sentences when possible. Do not use HTML tags in your response. Answer the following question: {message} [/INST]</s>"

    # Call Together AI API
    headers = {
        "Authorization": f"Bearer {TOGETHER_AI_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": MODEL_ID,
        "prompt": prompt,
        "max_tokens": 1024,
        "temperature": 0.7,
        "top_p": 0.9,
        "top_k": 50,
        "repetition_penalty": 1.0,
        "stop": ["</s>", "[INST]", "[/INST]"]
    }
    
    response = requests.post(TOGETHER_AI_API_URL, headers=headers, json=payload)
    
    if response.status_code != 200:
        print(f"API Error: {response.text}")
        raise Exception(f"Together AI API error: {response.status_code}")
    
    result = response.json()
    raw_text = result.get("choices", [{}])[0].get("text", "I couldn't generate a response.")
    
    # Clean the response text to remove HTML tags
    cleaned_text = clean_response_text(raw_text)
    return cleaned_text


@router.get("/chat-history")
async def get_chat_history(
    limit: int = 10,
    current_user: dict = Depends(get_current_user)
):
    """
    Get chat history for the current user.
    """
    try:
        user_id = str(current_user["_id"])
        
        # Get chat history for the user
        chat_logs = list(MongoDB.db.chat_logs.find(
            {"user_id": user_id}
        ).sort("timestamp", -1).limit(limit))
        
        # Format the response
        formatted_logs = []
        for log in chat_logs:
            formatted_logs.append({
                "id": str(log["_id"]),
                "message": log["message"],
                "response": log["response"],
                "timestamp": log["timestamp"].isoformat()
            })
        
        return {"history": formatted_logs}

    except Exception as e:
        print(f"Get chat history error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while retrieving chat history: {str(e)}"
        )