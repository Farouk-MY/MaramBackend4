from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta
from bson import ObjectId

from ...config import settings
from ...db.database import MongoDB
from ...schemas.user import UserCreate, UserLogin, ForgotPassword, ResetPassword, Token, UserResponse, UserUpdate
from ...core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    generate_verification_code,
    generate_reset_token
)
from ...core.email import send_verification_email, send_reset_password_email
from ...models.user import User
from ...api.deps import get_current_user

router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def get_my_profile(current_user: dict = Depends(get_current_user)):
    """
    Get the profile of the currently authenticated user.

    Returns:
        UserResponse: The user's profile information
    """
    try:
        # The current_user is already fetched by get_current_user dependency
        # We just need to format it properly for the response

        # Convert ObjectId to string if it's not already
        current_user["_id"] = str(current_user["_id"])

        # Convert datetime objects to strings
        current_user["created_at"] = current_user["created_at"].isoformat()
        current_user["updated_at"] = current_user["updated_at"].isoformat()

        # Set is_admin as false if not present (for backward compatibility)
        if "is_admin" not in current_user:
            current_user["is_admin"] = False

        # Remove sensitive fields that shouldn't be returned
        current_user.pop("hashed_password", None)
        current_user.pop("verification_code", None)
        current_user.pop("verification_code_expires", None)
        current_user.pop("reset_password_token", None)
        current_user.pop("reset_password_expires", None)

        return current_user
    except Exception as e:
        print(f"Error fetching user profile: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not fetch user profile"
        )

@router.post("/signup", response_model=UserResponse)
async def signup(background_tasks: BackgroundTasks, user_in: UserCreate):
    try:
        # Check if user already exists
        if MongoDB.db.users.find_one({"email": user_in.email}):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        # Create verification code
        verification_code = generate_verification_code()
        verification_expires = datetime.utcnow() + timedelta(hours=24)

        # Create new user
        user = {
            "email": user_in.email,
            "full_name": user_in.full_name,
            "hashed_password": get_password_hash(user_in.password),
            "is_active": True,
            "is_verified": False,
            "is_admin": False,
            "verification_code": verification_code,
            "verification_code_expires": verification_expires,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }

        # Insert user into database
        result = MongoDB.db.users.insert_one(user)
        # Convert ObjectId to string before returning - THIS IS THE KEY FIX
        user["_id"] = str(result.inserted_id)

        # Send verification email with try/except to prevent breaking the API response
        try:
            await send_verification_email(background_tasks, user_in.email, verification_code)
        except Exception as e:
            print(f"Failed to send verification email: {e}")
            # Continue with the signup process even if email fails

        # Convert datetime objects to strings for response
        user["created_at"] = user["created_at"].isoformat()
        user["updated_at"] = user["updated_at"].isoformat()

        return user
    except Exception as e:
        print(f"Signup error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during signup: {str(e)}"
        )


# Support both JSON and form data for login
@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), user_login: UserLogin = None):
    # Determine whether to use form data or JSON
    if user_login:
        # Use JSON input
        email = user_login.email
        password = user_login.password
    else:
        # Use form data
        email = form_data.username
        password = form_data.password

    user = MongoDB.db.users.find_one({"email": email})

    if not user or not verify_password(password, user.get("hashed_password")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.get("is_active", False):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
        
    # Check if user is blocked
    if user.get("is_blocked", False):
        blocked_reason = user.get("blocked_reason", "Contact administrator for details")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Your account has been blocked. Reason: {blocked_reason}",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=str(user["_id"]), expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/logout")
async def logout():
    return {"message": "Logged out successfully. Please delete the token on the client side."}

        


@router.post("/verify/{verification_code}")
async def verify_account(verification_code: str):
    # Find user with this verification code
    user = MongoDB.db.users.find_one({"verification_code": verification_code})

    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification code"
        )

    # Check if code is expired
    if user.get("verification_code_expires") < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Verification code expired"
        )

    # Update user as verified
    MongoDB.db.users.update_one(
        {"_id": user["_id"]},
        {
            "$set": {
                "is_verified": True,
                "verification_code": None,
                "verification_code_expires": None,
                "updated_at": datetime.utcnow()
            }
        }
    )

    return {"message": "Account verified successfully"}


@router.post("/forgot-password")
async def forgot_password(background_tasks: BackgroundTasks, forgot_password: ForgotPassword):
    try:
        user = MongoDB.db.users.find_one({"email": forgot_password.email})

        if not user:
            # For security reasons, don't reveal if email exists
            return {"message": "If your email is registered, you will receive a password reset link"}

        # Generate reset token
        reset_token = generate_reset_token()
        reset_expires = datetime.utcnow() + timedelta(hours=24)

        # Update user with reset token
        MongoDB.db.users.update_one(
            {"_id": user["_id"]},
            {
                "$set": {
                    "reset_password_token": reset_token,
                    "reset_password_expires": reset_expires,
                    "updated_at": datetime.utcnow()
                }
            }
        )

        # Send reset password email
        try:
            await send_reset_password_email(background_tasks, forgot_password.email, reset_token)
        except Exception as e:
            print(f"Failed to send reset password email: {e}")
            # Continue with the process even if email fails

        return {"message": "If your email is registered, you will receive a password reset link"}
    except Exception as e:
        print(f"Forgot password error: {e}")
        # Still return the same message for security
        return {"message": "If your email is registered, you will receive a password reset link"}


@router.post("/reset-password")
async def reset_password(reset_password: ResetPassword):
    # Find user with this reset token
    user = MongoDB.db.users.find_one({"reset_password_token": reset_password.token})

    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid reset token"
        )

    # Check if token is expired
    if user.get("reset_password_expires") < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reset token expired"
        )

    # Update password
    MongoDB.db.users.update_one(
        {"_id": user["_id"]},
        {
            "$set": {
                "hashed_password": get_password_hash(reset_password.new_password),
                "reset_password_token": None,
                "reset_password_expires": None,
                "updated_at": datetime.utcnow()
            }
        }
    )

    return {"message": "Password reset successfully"}


@router.put("/update-profile", response_model=UserResponse)
async def update_profile(
        user_update: UserUpdate,
        current_user: dict = Depends(get_current_user)
):
    """
    Update the current user's profile information.

    Args:
        user_update: User data to update
        current_user: Current authenticated user

    Returns:
        UserResponse: Updated user profile
    """
    try:
        # Initialize update data dictionary
        update_data = {"updated_at": datetime.utcnow()}

        # Check if email is being updated
        if user_update.email and user_update.email != current_user["email"]:
            # Check if the new email is already taken
            if MongoDB.db.users.find_one({"email": user_update.email, "_id": {"$ne": current_user["_id"]}}):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already registered to another user"
                )
            update_data["email"] = user_update.email

        # Update full name if provided
        if user_update.full_name is not None:
            update_data["full_name"] = user_update.full_name

        # Check if password is being updated
        if user_update.new_password:
            # Verify current password
            if not user_update.current_password:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Current password is required to set a new password"
                )

            if not verify_password(user_update.current_password, current_user["hashed_password"]):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Current password is incorrect"
                )

            # Set new password hash
            update_data["hashed_password"] = get_password_hash(user_update.new_password)

        # Only update if there are changes
        if len(update_data) > 1:  # More than just the timestamp
            MongoDB.db.users.update_one(
                {"_id": ObjectId(current_user["_id"])},
                {"$set": update_data}
            )

            # Get updated user
            updated_user = MongoDB.db.users.find_one({"_id": ObjectId(current_user["_id"])})

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
        else:
            # No changes were made, return current user
            current_user["_id"] = str(current_user["_id"])
            current_user["created_at"] = current_user["created_at"].isoformat()
            current_user["updated_at"] = current_user["updated_at"].isoformat()

            # Remove sensitive fields
            current_user.pop("hashed_password", None)
            current_user.pop("verification_code", None)
            current_user.pop("verification_code_expires", None)
            current_user.pop("reset_password_token", None)
            current_user.pop("reset_password_expires", None)

            return current_user

    except HTTPException:
        raise
    except Exception as e:
        print(f"Update profile error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while updating profile: {str(e)}"
        )


@router.delete("/delete-account", status_code=status.HTTP_204_NO_CONTENT)
async def delete_account(
        password: str,
        current_user: dict = Depends(get_current_user)
):
    """
    Delete the current user's account.

    Args:
        password: Current password to confirm deletion
        current_user: Current authenticated user
    """
    try:
        # Verify password
        if not verify_password(password, current_user["hashed_password"]):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password is incorrect"
            )

        # Delete user
        result = MongoDB.db.users.delete_one({"_id": ObjectId(current_user["_id"])})

        if result.deleted_count != 1:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to delete account"
            )

        # Blacklist all tokens for this user
        MongoDB.db.blacklisted_tokens.insert_one({
            "user_id": str(current_user["_id"]),
            "expires_at": datetime.utcnow() + timedelta(days=7)  # Keep blacklisted for 7 days
        })

        # No content response (204)
        return None
    except HTTPException:
        raise
    except Exception as e:
        print(f"Delete account error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while deleting account: {str(e)}"
        )