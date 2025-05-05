import sys
import os
import re
from datetime import datetime
from pymongo import MongoClient
from getpass import getpass
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables from .env file
env_path = Path(__file__).resolve().parent.parent / '../.env'  # Goes up two levels from scripts/
load_dotenv(env_path)

# Add parent directory to sys.path to allow imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.security import get_password_hash
from app.config import settings


def validate_email(email):
    """Validate email format."""
    email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(email_regex, email) is not None


def validate_password(password):
    """Validate password strength."""
    if len(password) < 8:
        return False, "Password must be at least 8 characters"
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter"
    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter"
    if not re.search(r'[0-9]', password):
        return False, "Password must contain at least one number"
    return True, "Password is valid"


def create_admin():
    """Create an admin user in the database."""
    print("=== Create Admin User ===")

    # Get admin details
    email = input("Enter admin email: ")
    while not validate_email(email):
        print("Invalid email format. Please try again.")
        email = input("Enter admin email: ")

    full_name = input("Enter admin full name: ")
    while not full_name or not full_name.strip():
        print("Full name cannot be empty. Please try again.")
        full_name = input("Enter admin full name: ")

    password = input("Enter admin password: ")
    is_valid, message = validate_password(password)
    while not is_valid:
        print(message)
        password = input("Enter admin password: ")
        is_valid, message = validate_password(password)

    confirm_password = input("Confirm admin password: ")
    while password != confirm_password:
        print("Passwords do not match. Please try again.")
        confirm_password = input("Confirm admin password: ")

    try:
        # Connect to MongoDB
        client = MongoClient(settings.MONGODB_URL)
        db = client[settings.MONGODB_DB_NAME]

        # Check if admin already exists
        existing_admin = db.users.find_one({"email": email})
        if existing_admin:
            if existing_admin.get("is_admin", False):
                print(f"Admin with email {email} already exists.")
                return
            else:
                # Update existing user to admin
                update_to_admin = input(f"User {email} exists but is not an admin. Update to admin? (y/n): ")
                if update_to_admin.lower() != 'y':
                    print("Admin creation cancelled.")
                    return

                db.users.update_one(
                    {"_id": existing_admin["_id"]},
                    {
                        "$set": {
                            "is_admin": True,
                            "hashed_password": get_password_hash(password),
                            "updated_at": datetime.utcnow()
                        }
                    }
                )
                print(f"User {email} updated to admin successfully.")
                return

        # Create admin user
        admin_user = {
            "email": email,
            "full_name": full_name,
            "hashed_password": get_password_hash(password),
            "is_active": True,
            "is_verified": True,
            "is_admin": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }

        db.users.insert_one(admin_user)
        print(f"Admin user {email} created successfully.")

    except Exception as e:
        print(f"Error creating admin user: {e}")
    finally:
        client.close()


if __name__ == "__main__":
    create_admin()