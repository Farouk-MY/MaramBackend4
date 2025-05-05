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

from ...db.database import MongoDB
from ...schemas.model import ModelCreate, ModelResponse, ModelListResponse, ModelType
from ...api.deps import get_current_user, get_current_admin

router = APIRouter()

# Constants
MAX_MODELS_PER_USER = 3
MODEL_UPLOAD_PATH = "uploads/models"


@router.post("/", response_model=ModelResponse)
async def add_model(
        name: str = Form(...),
        description: str = Form(...),
        model_type: ModelType = Form(...),
        category: str = Form(...),
        file: UploadFile = File(...),
        current_user: dict = Depends(get_current_user)
):
    """
    Add a new AI model.
    Regular users can only have up to 3 models.
    Admins don't have this limitation.
    """
    try:
        # Check if the file extension matches the model_type
        file_extension = os.path.splitext(file.filename)[1].lower()
        valid_extensions = {
            ModelType.JSON: [".json"],
            ModelType.CSV: [".csv"],
            ModelType.TEXT: [".txt", ".text"]
        }

        if file_extension not in valid_extensions[model_type]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File extension does not match model type. Expected {valid_extensions[model_type]} for {model_type}"
            )

        # Validate file content based on type
        try:
            contents = await file.read()
            if model_type == ModelType.JSON:
                # Try parsing as JSON
                json.loads(contents.decode())
            elif model_type == ModelType.CSV:
                # Try parsing as CSV
                csv.reader(io.StringIO(contents.decode()))
            # For TEXT type, no validation needed

            # Reset file position for saving
            await file.seek(0)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid file content for {model_type} type: {str(e)}"
            )

        # Check if user has reached their model limit (if not admin)
        user_id = str(current_user["_id"])
        is_admin = current_user.get("is_admin", False)

        if not is_admin:
            user_models_count = MongoDB.db.ai_models.count_documents({"user_id": user_id})
            if user_models_count >= MAX_MODELS_PER_USER:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"You have reached the maximum limit of {MAX_MODELS_PER_USER} models. Delete an existing model before adding a new one."
                )

        # Create directory if it doesn't exist
        user_model_dir = os.path.join(MODEL_UPLOAD_PATH, user_id)
        os.makedirs(user_model_dir, exist_ok=True)

        # Generate a unique filename
        timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
        safe_name = "".join([c if c.isalnum() else "_" for c in name])
        unique_filename = f"{safe_name}_{timestamp}{file_extension}"
        file_path = os.path.join(user_model_dir, unique_filename)

        # Save the file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Create model document
        model_data = {
            "name": name,
            "description": description,
            "model_type": model_type,
            "category": category,  # Add category to the document
            "file_path": file_path,
            "user_id": user_id,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }

        # Insert into database
        result = MongoDB.db.ai_models.insert_one(model_data)

        # Get the created model
        created_model = MongoDB.db.ai_models.find_one({"_id": result.inserted_id})

        # Format the response
        created_model["_id"] = str(created_model["_id"])
        created_model["created_at"] = created_model["created_at"].isoformat()
        created_model["updated_at"] = created_model["updated_at"].isoformat()

        return created_model

    except HTTPException:
        raise
    except Exception as e:
        print(f"Add model error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while adding the model: {str(e)}"
        )


@router.get("/", response_model=ModelListResponse)
async def get_models(
        skip: int = 0,
        limit: int = 100,
        current_user: dict = Depends(get_current_user)
):
    """
    Get all models belonging to the current user.
    Admins can see all models if admin_view=True.
    """
    try:
        # Get user ID
        user_id = str(current_user["_id"])
        is_admin = current_user.get("is_admin", False)

        # Build query
        query = {}
        if not is_admin:
            # Regular users can only see their own models
            query["user_id"] = user_id

        # Get total count
        total = MongoDB.db.ai_models.count_documents(query)

        # Get models with pagination
        cursor = MongoDB.db.ai_models.find(query).skip(skip).limit(limit)

        # Process models
        models = []
        for model in cursor:
            # Convert ObjectId to string
            model["_id"] = str(model["_id"])

            # Convert datetime objects to strings
            model["created_at"] = model["created_at"].isoformat()
            model["updated_at"] = model["updated_at"].isoformat()

            models.append(model)

        return {"total": total, "models": models}

    except Exception as e:
        print(f"Get models error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while retrieving models: {str(e)}"
        )


@router.get("/{model_id}", response_model=ModelResponse)
async def get_model(
        model_id: str,
        current_user: dict = Depends(get_current_user)
):
    """
    Get a specific model by ID.
    Users can only access their own models unless they are admins.
    """
    try:
        # Validate ObjectId
        if not ObjectId.is_valid(model_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid model ID format"
            )

        # Find model
        model = MongoDB.db.ai_models.find_one({"_id": ObjectId(model_id)})

        if not model:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Model not found"
            )

        # Check if user has access to this model
        user_id = str(current_user["_id"])
        is_admin = current_user.get("is_admin", False)

        if model["user_id"] != user_id and not is_admin:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to access this model"
            )

        # Format response
        model["_id"] = str(model["_id"])
        model["created_at"] = model["created_at"].isoformat()
        model["updated_at"] = model["updated_at"].isoformat()

        return model

    except HTTPException:
        raise
    except Exception as e:
        print(f"Get model error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while retrieving the model: {str(e)}"
        )


@router.get("/{model_id}/download")
async def download_model(
        model_id: str,
        current_user: dict = Depends(get_current_user)
):
    """
    Download a model file.
    Users can only download their own models unless they are admins.
    """
    try:
        # Validate ObjectId
        if not ObjectId.is_valid(model_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid model ID format"
            )

        # Find model
        model = MongoDB.db.ai_models.find_one({"_id": ObjectId(model_id)})

        if not model:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Model not found"
            )

        # Check if user has access to this model
        user_id = str(current_user["_id"])
        is_admin = current_user.get("is_admin", False)

        if model["user_id"] != user_id and not is_admin:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to access this model"
            )

        file_path = model["file_path"]

        if not os.path.exists(file_path):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Model file not found on server"
            )

        return FileResponse(
            path=file_path,
            filename=os.path.basename(file_path),
            media_type="application/octet-stream"
        )

    except HTTPException:
        raise
    except Exception as e:
        print(f"Download model error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while downloading the model: {str(e)}"
        )


@router.get("/category/{category}", response_model=ModelListResponse)
async def get_models_by_category(
        category: str,
        skip: int = 0,
        limit: int = 100,
        current_user: dict = Depends(get_current_user)
):
    try:
        # Get user ID
        user_id = str(current_user["_id"])
        is_admin = current_user.get("is_admin", False)

        # Build query
        query = {"category": category}
        if not is_admin:
            query["user_id"] = user_id

        # Get total count
        total = MongoDB.db.ai_models.count_documents(query)

        # Get models with pagination
        cursor = MongoDB.db.ai_models.find(query).skip(skip).limit(limit)

        # Process models
        models = []
        for model in cursor:
            model["_id"] = str(model["_id"])
            model["created_at"] = model["created_at"].isoformat()
            model["updated_at"] = model["updated_at"].isoformat()
            models.append(model)

        return {"total": total, "models": models}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while retrieving models: {str(e)}"
        )


@router.delete("/{model_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_model(
        model_id: str,
        current_user: dict = Depends(get_current_user)
):
    """
    Delete a model.
    Users can only delete their own models unless they are admins.
    """
    try:
        # Validate ObjectId
        if not ObjectId.is_valid(model_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid model ID format"
            )

        # Find model
        model = MongoDB.db.ai_models.find_one({"_id": ObjectId(model_id)})

        if not model:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Model not found"
            )

        # Check if user has access to delete this model
        user_id = str(current_user["_id"])
        is_admin = current_user.get("is_admin", False)

        if model["user_id"] != user_id and not is_admin:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to delete this model"
            )

        # Delete the file if it exists
        file_path = model["file_path"]
        if os.path.exists(file_path):
            os.remove(file_path)

        # Delete from database
        result = MongoDB.db.ai_models.delete_one({"_id": ObjectId(model_id)})

        if result.deleted_count != 1:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to delete model"
            )

        # No content response (204)
        return None

    except HTTPException:
        raise
    except Exception as e:
        print(f"Delete model error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while deleting the model: {str(e)}"
        )


# Admin endpoints

@router.get("/admin/all", response_model=ModelListResponse)
async def get_all_models(
        skip: int = 0,
        limit: int = 100,
        search: Optional[str] = None,
        current_admin: dict = Depends(get_current_admin)
):
    """
    Get all models with pagination and optional search (admin only).
    """
    try:
        # Build filter query
        query = {}
        if search:
            # Search in name and description fields
            query = {
                "$or": [
                    {"name": {"$regex": search, "$options": "i"}},
                    {"description": {"$regex": search, "$options": "i"}}
                ]
            }

        # Get total count
        total = MongoDB.db.ai_models.count_documents(query)

        # Get models with pagination
        cursor = MongoDB.db.ai_models.find(query).skip(skip).limit(limit)

        # Process models
        models = []
        for model in cursor:
            # Convert ObjectId to string
            model["_id"] = str(model["_id"])

            # Convert datetime objects to strings
            model["created_at"] = model["created_at"].isoformat()
            model["updated_at"] = model["updated_at"].isoformat()

            models.append(model)

        return {"total": total, "models": models}

    except Exception as e:
        print(f"Get all models error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while retrieving models: {str(e)}"
        )

# Add this to your existing model.py router

@router.get("/admin/models", response_model=ModelListResponse)
async def admin_get_models(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    current_admin: dict = Depends(get_current_admin)
):
    """
    Get all models (admin only).
    """
    try:
        # Build filter query
        query = {}
        if search:
            # Search in name and description fields
            query = {
                "$or": [
                    {"name": {"$regex": search, "$options": "i"}},
                    {"description": {"$regex": search, "$options": "i"}},
                    {"category": {"$regex": search, "$options": "i"}}
                ]
            }

        # Get total count
        total = MongoDB.db.ai_models.count_documents(query)

        # Get models with pagination
        cursor = MongoDB.db.ai_models.find(query).skip(skip).limit(limit)

        # Process models
        models = []
        for model in cursor:
            # Convert ObjectId to string
            model["_id"] = str(model["_id"])

            # Convert datetime objects to strings
            model["created_at"] = model["created_at"].isoformat()
            model["updated_at"] = model["updated_at"].isoformat()

            models.append(model)

        return {"total": total, "models": models}

    except Exception as e:
        print(f"Admin get models error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while retrieving models: {str(e)}"
        )


# Add these to your model.py router

@router.put("/admin/models/{model_id}", response_model=ModelResponse)
async def admin_update_model(
    model_id: str,
    name: str = Form(...),
    description: str = Form(...),
    category: str = Form(...),
    current_admin: dict = Depends(get_current_admin)
):
    """
    Update a model (admin only).
    """
    try:
        # Validate ObjectId
        if not ObjectId.is_valid(model_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid model ID format"
            )

        # Find model
        model = MongoDB.db.ai_models.find_one({"_id": ObjectId(model_id)})
        if not model:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Model not found"
            )

        # Update model
        update_data = {
            "name": name,
            "description": description,
            "category": category,
            "updated_at": datetime.utcnow()
        }

        MongoDB.db.ai_models.update_one(
            {"_id": ObjectId(model_id)},
            {"$set": update_data}
        )

        # Get updated model
        updated_model = MongoDB.db.ai_models.find_one({"_id": ObjectId(model_id)})
        updated_model["_id"] = str(updated_model["_id"])
        updated_model["created_at"] = updated_model["created_at"].isoformat()
        updated_model["updated_at"] = updated_model["updated_at"].isoformat()

        return updated_model

    except HTTPException:
        raise
    except Exception as e:
        print(f"Admin update model error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while updating model: {str(e)}"
        )

@router.delete("/admin/models/{model_id}", status_code=status.HTTP_204_NO_CONTENT)
async def admin_delete_model(
    model_id: str,
    current_admin: dict = Depends(get_current_admin)
):
    """
    Delete a model (admin only).
    """
    try:
        # Validate ObjectId
        if not ObjectId.is_valid(model_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid model ID format"
            )

        # Find model
        model = MongoDB.db.ai_models.find_one({"_id": ObjectId(model_id)})
        if not model:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Model not found"
            )

        # Delete the file if it exists
        file_path = model.get("file_path")
        if file_path and os.path.exists(file_path):
            os.remove(file_path)

        # Delete from database
        result = MongoDB.db.ai_models.delete_one({"_id": ObjectId(model_id)})

        if result.deleted_count != 1:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to delete model"
            )

        return None

    except HTTPException:
        raise
    except Exception as e:
        print(f"Admin delete model error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while deleting model: {str(e)}"
        )