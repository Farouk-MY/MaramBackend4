from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form, status
from fastapi.responses import FileResponse
from typing import Optional, List
from datetime import datetime
import os
import shutil
from bson import ObjectId
import json
import csv
import io
import fitz  # PyMuPDF for PDF processing

from ...db.database import MongoDB
from ...schemas.document import DocumentCreate, DocumentResponse, DocumentListResponse, DocumentType
from ...api.deps import get_current_user, get_current_admin

router = APIRouter()

# Constants
DOCUMENT_UPLOAD_PATH = "uploads/documents"


@router.post("/", response_model=DocumentResponse)
async def add_document(
        name: str = Form(...),
        description: str = Form(...),
        document_type: DocumentType = Form(...),
        file: UploadFile = File(...),
        current_user: dict = Depends(get_current_admin)  # Only admins can add documents
):
    """
    Add a new document for the RAG chatbot.
    Only admins can add documents.
    """
    try:
        # Check if the file extension matches the document_type
        file_extension = os.path.splitext(file.filename)[1].lower()
        valid_extensions = {
            DocumentType.JSON: [".json"],
            DocumentType.CSV: [".csv"],
            DocumentType.TEXT: [".txt", ".text"],
            DocumentType.PDF: [".pdf"]
        }

        if file_extension not in valid_extensions[document_type]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File extension does not match document type. Expected {valid_extensions[document_type]} for {document_type}"
            )

        # Validate file content based on type
        try:
            contents = await file.read()
            if document_type == DocumentType.JSON:
                # Try parsing as JSON
                json.loads(contents.decode())
            elif document_type == DocumentType.CSV:
                # Try parsing as CSV
                csv.reader(io.StringIO(contents.decode()))
            elif document_type == DocumentType.PDF:
                # Try parsing as PDF
                try:
                    pdf_document = fitz.open(stream=contents, filetype="pdf")
                    pdf_document.close()
                except Exception as e:
                    raise ValueError(f"Invalid PDF file: {str(e)}")
            # For TEXT type, no validation needed

            # Reset file position for saving
            await file.seek(0)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid file content for {document_type} type: {str(e)}"
            )

        # Create directory if it doesn't exist
        os.makedirs(DOCUMENT_UPLOAD_PATH, exist_ok=True)

        # Generate a unique filename
        timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
        safe_name = "".join([c if c.isalnum() else "_" for c in name])
        unique_filename = f"{safe_name}_{timestamp}{file_extension}"
        file_path = os.path.join(DOCUMENT_UPLOAD_PATH, unique_filename)

        # Save the file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Extract text content for indexing (for RAG)
        text_content = ""
        if document_type == DocumentType.PDF:
            pdf_document = fitz.open(file_path)
            for page_num in range(len(pdf_document)):
                page = pdf_document[page_num]
                text_content += page.get_text()
            pdf_document.close()
        elif document_type == DocumentType.TEXT:
            with open(file_path, "r", encoding="utf-8") as f:
                text_content = f.read()
        elif document_type == DocumentType.CSV:
            with open(file_path, "r", encoding="utf-8") as f:
                reader = csv.reader(f)
                for row in reader:
                    text_content += " ".join(row) + "\n"
        elif document_type == DocumentType.JSON:
            with open(file_path, "r", encoding="utf-8") as f:
                json_data = json.load(f)
                text_content = json.dumps(json_data, ensure_ascii=False)

        # Create document document
        document_data = {
            "name": name,
            "description": description,
            "document_type": document_type,
            "file_path": file_path,
            "text_content": text_content,  # Store extracted text for RAG
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }

        # Insert into database
        result = MongoDB.db.rag_documents.insert_one(document_data)

        # Get the created document
        created_document = MongoDB.db.rag_documents.find_one({"_id": result.inserted_id})

        # Format the response
        created_document["_id"] = str(created_document["_id"])
        created_document["created_at"] = created_document["created_at"].isoformat()
        created_document["updated_at"] = created_document["updated_at"].isoformat()

        return created_document

    except HTTPException:
        raise
    except Exception as e:
        print(f"Add document error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while adding the document: {str(e)}"
        )


@router.get("/", response_model=DocumentListResponse)
async def get_documents(
        skip: int = 0,
        limit: int = 100,
        current_user: dict = Depends(get_current_user)
):
    """
    Get all documents for the RAG chatbot.
    All users can view documents.
    """
    try:
        # Get total count
        total = MongoDB.db.rag_documents.count_documents({})

        # Get documents with pagination
        cursor = MongoDB.db.rag_documents.find().skip(skip).limit(limit)

        # Process documents
        documents = []
        for document in cursor:
            # Convert ObjectId to string
            document["_id"] = str(document["_id"])

            # Convert datetime objects to strings
            document["created_at"] = document["created_at"].isoformat()
            document["updated_at"] = document["updated_at"].isoformat()

            # Remove text_content from response to reduce payload size
            document.pop("text_content", None)

            documents.append(document)

        return {"total": total, "documents": documents}

    except Exception as e:
        print(f"Get documents error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while retrieving documents: {str(e)}"
        )


@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(
        document_id: str,
        current_user: dict = Depends(get_current_user)
):
    """
    Get a specific document by ID.
    All users can access documents.
    """
    try:
        # Validate ObjectId
        if not ObjectId.is_valid(document_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid document ID format"
            )

        # Find document
        document = MongoDB.db.rag_documents.find_one({"_id": ObjectId(document_id)})

        if not document:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Document not found"
            )

        # Format response
        document["_id"] = str(document["_id"])
        document["created_at"] = document["created_at"].isoformat()
        document["updated_at"] = document["updated_at"].isoformat()

        # Remove text_content from response
        document.pop("text_content", None)

        return document

    except HTTPException:
        raise
    except Exception as e:
        print(f"Get document error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while retrieving the document: {str(e)}"
        )


@router.delete("/{document_id}")
async def delete_document(
        document_id: str,
        current_user: dict = Depends(get_current_admin)  # Only admins can delete documents
):
    """
    Delete a document.
    Only admins can delete documents.
    """
    try:
        # Validate ObjectId
        if not ObjectId.is_valid(document_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid document ID format"
            )

        # Find document
        document = MongoDB.db.rag_documents.find_one({"_id": ObjectId(document_id)})

        if not document:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Document not found"
            )

        # Delete file if it exists
        file_path = document.get("file_path")
        if file_path and os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception as e:
                print(f"Error deleting file {file_path}: {e}")

        # Delete document from database
        MongoDB.db.rag_documents.delete_one({"_id": ObjectId(document_id)})

        return {"message": "Document deleted successfully"}

    except HTTPException:
        raise
    except Exception as e:
        print(f"Delete document error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while deleting the document: {str(e)}"
        )