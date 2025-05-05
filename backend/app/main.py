from fastapi import FastAPI, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import asyncio
from typing import Callable

from .config import settings
from .db.database import MongoDB
from .api.routes import auth, admin, model, contact
import os

# Create the templates directory if it doesn't exist
os.makedirs("app/templates", exist_ok=True)

# Create directories for model uploads
os.makedirs("uploads/models", exist_ok=True)
os.makedirs("uploads/temp", exist_ok=True)

# Create email templates
with open("app/templates/verification.html", "w") as f:
    f.write("""
<!DOCTYPE html>
<html>
<head>
    <title>Account Verification</title>
</head>
<body>
    <h1>Welcome to {{project_name}}!</h1>
    <p>Your verification code is: <strong>{{verification_code}}</strong></p>
    <p>This code will expire in 24 hours.</p>
</body>
</html>
    """)

with open("app/templates/reset_password.html", "w") as f:
    f.write("""
<!DOCTYPE html>
<html>
<head>
    <title>Password Reset</title>
</head>
<body>
    <h1>Password Reset for {{project_name}}</h1>
    <p>Your password reset token is: <strong>{{reset_token}}</strong></p>
    <p>This token will expire in 24 hours.</p>
</body>
</html>
    """)

with open("app/templates/contact_response.html", "w") as f:
    f.write("""
<!DOCTYPE html>
<html>
<head>
    <title>Contact Form Response</title>
</head>
<body>
    <h1>Response from {{project_name}}</h1>
    <p>Dear {{first_name}} {{last_name}},</p>
    <p>Thank you for reaching out to us. Below is our response to your inquiry:</p>
    <p><strong>Your Message:</strong> {{message}}</p>
    <p><strong>Our Response:</strong> {{response}}</p>
    <p>If you have any further questions, please don't hesitate to contact us.</p>
    <p>Best regards,<br>{{project_name}} Team</p>
</body>
</html>
    """)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(admin.router, prefix=f"{settings.API_V1_STR}/admin", tags=["admin"])
app.include_router(model.router, prefix=f"{settings.API_V1_STR}/models", tags=["models"])
app.include_router(contact.router, prefix=f"{settings.API_V1_STR}/contact", tags=["contact"])

# Background task for cleaning up expired blacklisted tokens
async def cleanup_expired_tokens():
    while True:
        try:
            result = MongoDB.db.blacklisted_tokens.delete_many(
                {"expires_at": {"$lt": datetime.utcnow()}}
            )
            print(f"Cleaned up {result.deleted_count} expired tokens")
        except Exception as e:
            print(f"Error cleaning up expired tokens: {e}")
        await asyncio.sleep(3600)  # 1 hour

# Background task for cleaning up temporary files
async def cleanup_temp_files():
    while True:
        try:
            temp_dir = os.path.join("uploads", "temp")
            now = datetime.utcnow()
            for filename in os.listdir(temp_dir):
                file_path = os.path.join(temp_dir, filename)
                if os.path.isfile(file_path):
                    file_mtime = datetime.fromtimestamp(os.path.getmtime(file_path))
                    if (now - file_mtime).total_seconds() > 86400:
                        try:
                            os.remove(file_path)
                            print(f"Deleted temp file: {filename}")
                        except Exception as e:
                            print(f"Error deleting temp file {filename}: {e}")
            print("Temporary files cleanup completed")
        except Exception as e:
            print(f"Error cleaning up temp files: {e}")
        await asyncio.sleep(21600)  # 6 hours

@app.on_event("startup")
async def startup_db_client():
    MongoDB.connect_to_mongodb()

    # Create indexes
    MongoDB.db.blacklisted_tokens.create_index("user_id")
    MongoDB.db.blacklisted_tokens.create_index("expires_at")
    MongoDB.db.ai_models.create_index("user_id")
    MongoDB.db.ai_models.create_index("name")
    MongoDB.db.contact_forms.create_index("email")
    MongoDB.db.contact_forms.create_index("created_at")

    # Start background tasks
    asyncio.create_task(cleanup_expired_tokens())
    asyncio.create_task(cleanup_temp_files())

@app.on_event("shutdown")
async def shutdown_db_client():
    MongoDB.close_mongodb_connection()

@app.get("/")
async def root():
    return {"message": f"Welcome to {settings.PROJECT_NAME} API"}