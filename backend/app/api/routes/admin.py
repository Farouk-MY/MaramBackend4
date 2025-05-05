from fastapi import APIRouter, HTTPException, Depends, status
from bson import ObjectId
from datetime import datetime, timedelta
from typing import Optional, List

from ...db.database import MongoDB
from ...schemas.user import AdminCreate, UserResponse, UserListResponse, BlockUserRequest
from ...core.security import get_password_hash
from ...api.deps import get_current_admin

router = APIRouter()


@router.post("/users", response_model=UserResponse)
async def create_user(user_in: AdminCreate, current_admin: dict = Depends(get_current_admin)):
    """
    Create a new user (admin only).

    Args:
        user_in: User data
        current_admin: Current admin user

    Returns:
        UserResponse: The created user
    """
    try:
        # Check if user already exists
        if MongoDB.db.users.find_one({"email": user_in.email}):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        # Create new user document
        user = {
            "email": user_in.email,
            "full_name": user_in.full_name,
            "hashed_password": get_password_hash(user_in.password),
            "is_active": user_in.is_active,
            "is_verified": user_in.is_verified,
            "is_admin": user_in.is_admin,
            "is_blocked": user_in.is_blocked,  # Add blocked status
            "blocked_reason": None,
            "blocked_at": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }

        # Insert user into database
        result = MongoDB.db.users.insert_one(user)

        # Get the created user
        created_user = MongoDB.db.users.find_one({"_id": result.inserted_id})

        # Convert ObjectId to string
        created_user["_id"] = str(created_user["_id"])

        # Convert datetime objects to strings
        created_user["created_at"] = created_user["created_at"].isoformat()
        created_user["updated_at"] = created_user["updated_at"].isoformat()
        if created_user.get("blocked_at"):
            created_user["blocked_at"] = created_user["blocked_at"].isoformat()

        # Remove sensitive fields
        created_user.pop("hashed_password", None)
        created_user.pop("verification_code", None)
        created_user.pop("verification_code_expires", None)
        created_user.pop("reset_password_token", None)
        created_user.pop("reset_password_expires", None)

        return created_user
    except Exception as e:
        print(f"Create user error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while creating user: {str(e)}"
        )


@router.get("/users", response_model=UserListResponse)
async def get_users(
        skip: int = 0,
        limit: int = 100,
        search: Optional[str] = None,
        current_admin: dict = Depends(get_current_admin)
):
    """
    Get all users with pagination and optional search (admin only).

    Args:
        skip: Number of users to skip (for pagination)
        limit: Maximum number of users to return
        search: Optional search term for email or full name
        current_admin: Current admin user

    Returns:
        UserListResponse: List of users and total count
    """
    try:
        # Build filter query
        query = {}
        if search:
            # Search in email and full_name fields
            query = {
                "$or": [
                    {"email": {"$regex": search, "$options": "i"}},
                    {"full_name": {"$regex": search, "$options": "i"}}
                ]
            }

        # Get total count
        total = MongoDB.db.users.count_documents(query)

        # Get users with pagination
        cursor = MongoDB.db.users.find(query).skip(skip).limit(limit)

        # Process users
        users = []
        for user in cursor:
            # Convert ObjectId to string
            user["_id"] = str(user["_id"])

            # Convert datetime objects to strings
            user["created_at"] = user["created_at"].isoformat()
            user["updated_at"] = user["updated_at"].isoformat()
            if user.get("blocked_at"):
                user["blocked_at"] = user["blocked_at"].isoformat()

            # Remove sensitive fields
            user.pop("hashed_password", None)
            user.pop("verification_code", None)
            user.pop("verification_code_expires", None)
            user.pop("reset_password_token", None)
            user.pop("reset_password_expires", None)

            users.append(user)

        return {"total": total, "users": users}
    except Exception as e:
        print(f"Get users error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while retrieving users: {str(e)}"
        )


@router.get("/users/{user_id}", response_model=UserResponse)
async def get_user_by_id(
        user_id: str,
        current_admin: dict = Depends(get_current_admin)
):
    """
    Get a user by ID (admin only).

    Args:
        user_id: User ID
        current_admin: Current admin user

    Returns:
        UserResponse: User information
    """
    try:
        # Validate ObjectId
        if not ObjectId.is_valid(user_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid user ID format"
            )

        # Find user
        user = MongoDB.db.users.find_one({"_id": ObjectId(user_id)})

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        # Convert ObjectId to string
        user["_id"] = str(user["_id"])

        # Convert datetime objects to strings
        user["created_at"] = user["created_at"].isoformat()
        user["updated_at"] = user["updated_at"].isoformat()
        if user.get("blocked_at"):
            user["blocked_at"] = user["blocked_at"].isoformat()

        # Remove sensitive fields
        user.pop("hashed_password", None)
        user.pop("verification_code", None)
        user.pop("verification_code_expires", None)
        user.pop("reset_password_token", None)
        user.pop("reset_password_expires", None)

        return user
    except HTTPException:
        raise
    except Exception as e:
        print(f"Get user by ID error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while retrieving user: {str(e)}"
        )


@router.put("/users/{user_id}", response_model=UserResponse)
async def update_user(
        user_id: str,
        user_update: AdminCreate,
        current_admin: dict = Depends(get_current_admin)
):
    """
    Update a user (admin only).

    Args:
        user_id: User ID
        user_update: Updated user data
        current_admin: Current admin user

    Returns:
        UserResponse: Updated user information
    """
    try:
        # Validate ObjectId
        if not ObjectId.is_valid(user_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid user ID format"
            )

        # Check if user exists
        existing_user = MongoDB.db.users.find_one({"_id": ObjectId(user_id)})
        if not existing_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        # Check if email is already taken by another user
        if user_update.email != existing_user["email"]:
            if MongoDB.db.users.find_one({"email": user_update.email, "_id": {"$ne": ObjectId(user_id)}}):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already registered to another user"
                )

        # Prepare update data
        update_data = {
            "email": user_update.email,
            "full_name": user_update.full_name,
            "is_active": user_update.is_active,
            "is_verified": user_update.is_verified,
            "is_admin": user_update.is_admin,
            "updated_at": datetime.utcnow()
        }

        # Update password if provided
        if user_update.password:
            update_data["hashed_password"] = get_password_hash(user_update.password)

        # Update user
        MongoDB.db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )

        # Get updated user
        updated_user = MongoDB.db.users.find_one({"_id": ObjectId(user_id)})

        # Convert ObjectId to string
        updated_user["_id"] = str(updated_user["_id"])

        # Convert datetime objects to strings
        updated_user["created_at"] = updated_user["created_at"].isoformat()
        updated_user["updated_at"] = updated_user["updated_at"].isoformat()
        if updated_user.get("blocked_at"):
            updated_user["blocked_at"] = updated_user["blocked_at"].isoformat()

        # Remove sensitive fields
        updated_user.pop("hashed_password", None)
        updated_user.pop("verification_code", None)
        updated_user.pop("verification_code_expires", None)
        updated_user.pop("reset_password_token", None)
        updated_user.pop("reset_password_expires", None)

        return updated_user
    except HTTPException:
        raise
    except Exception as e:
        print(f"Update user error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while updating user: {str(e)}"
        )


@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
        user_id: str,
        current_admin: dict = Depends(get_current_admin)
):
    """
    Delete a user (admin only).

    Args:
        user_id: User ID
        current_admin: Current admin user
    """
    try:
        # Validate ObjectId
        if not ObjectId.is_valid(user_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid user ID format"
            )

        # Check if user exists
        existing_user = MongoDB.db.users.find_one({"_id": ObjectId(user_id)})
        if not existing_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        # Delete user
        result = MongoDB.db.users.delete_one({"_id": ObjectId(user_id)})

        if result.deleted_count != 1:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to delete user"
            )

        # No content response (204)
        return None
    except HTTPException:
        raise
    except Exception as e:
        print(f"Delete user error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while deleting user: {str(e)}"
        )


@router.post("/users/{user_id}/block", response_model=UserResponse)
async def block_user(
        user_id: str,
        block_request: BlockUserRequest,
        current_admin: dict = Depends(get_current_admin)
):
    """
    Block a user (admin only).

    Args:
        user_id: User ID
        block_request: Block request with optional reason
        current_admin: Current admin user

    Returns:
        UserResponse: Updated user information
    """
    try:
        # Validate ObjectId
        if not ObjectId.is_valid(user_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid user ID format"
            )

        # Check if user exists
        existing_user = MongoDB.db.users.find_one({"_id": ObjectId(user_id)})
        if not existing_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        # Check if user is already blocked
        if existing_user.get("is_blocked", False):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User is already blocked"
            )

        # Protect against blocking admins
        if existing_user.get("is_admin", False):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot block an admin user"
            )

        # Update user as blocked
        block_time = datetime.utcnow()
        MongoDB.db.users.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$set": {
                    "is_blocked": True,
                    "blocked_reason": block_request.reason,
                    "blocked_at": block_time,
                    "updated_at": block_time
                }
            }
        )

        # Blacklist all tokens for this user
        MongoDB.db.blacklisted_tokens.insert_one({
            "user_id": user_id,
            "expires_at": datetime.utcnow() + timedelta(days=365)  # Keep blacklisted for a year
        })

        # Get updated user
        updated_user = MongoDB.db.users.find_one({"_id": ObjectId(user_id)})

        # Convert ObjectId to string
        updated_user["_id"] = str(updated_user["_id"])

        # Convert datetime objects to strings
        updated_user["created_at"] = updated_user["created_at"].isoformat()
        updated_user["updated_at"] = updated_user["updated_at"].isoformat()
        if updated_user.get("blocked_at"):
            updated_user["blocked_at"] = updated_user["blocked_at"].isoformat()

        # Remove sensitive fields
        updated_user.pop("hashed_password", None)
        updated_user.pop("verification_code", None)
        updated_user.pop("verification_code_expires", None)
        updated_user.pop("reset_password_token", None)
        updated_user.pop("reset_password_expires", None)

        return updated_user
    except HTTPException:
        raise
    except Exception as e:
        print(f"Block user error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while blocking user: {str(e)}"
        )


@router.post("/users/{user_id}/unblock", response_model=UserResponse)
async def unblock_user(
        user_id: str,
        current_admin: dict = Depends(get_current_admin)
):
    """
    Unblock a user (admin only).

    Args:
        user_id: User ID
        current_admin: Current admin user

    Returns:
        UserResponse: Updated user information
    """
    try:
        # Validate ObjectId
        if not ObjectId.is_valid(user_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid user ID format"
            )

        # Check if user exists
        existing_user = MongoDB.db.users.find_one({"_id": ObjectId(user_id)})
        if not existing_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        # Check if user is actually blocked
        if not existing_user.get("is_blocked", False):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User is not blocked"
            )

        # Update user as unblocked
        MongoDB.db.users.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$set": {
                    "is_blocked": False,
                    "blocked_reason": None,
                    "blocked_at": None,
                    "updated_at": datetime.utcnow()
                }
            }
        )

        # Remove user from blacklisted tokens
        MongoDB.db.blacklisted_tokens.delete_many({"user_id": user_id})

        # Get updated user
        updated_user = MongoDB.db.users.find_one({"_id": ObjectId(user_id)})

        # Convert ObjectId to string
        updated_user["_id"] = str(updated_user["_id"])

        # Convert datetime objects to strings
        updated_user["created_at"] = updated_user["created_at"].isoformat()
        updated_user["updated_at"] = updated_user["updated_at"].isoformat()

        # Remove sensitive fields
        updated_user.pop("hashed_password", None)
        updated_user.pop("verification_code", None)
        updated_user.pop("verification_code_expires", None)
        updated_user.pop("reset_password_token", None)
        updated_user.pop("reset_password_expires", None)

        return updated_user
    except HTTPException:
        raise
    except Exception as e:
        print(f"Unblock user error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while unblocking user: {str(e)}"
        )