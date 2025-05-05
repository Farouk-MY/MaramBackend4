from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from ..config import settings
from pathlib import Path
from fastapi import BackgroundTasks
from pydantic import EmailStr
import logging
import sys

# Configure logging to output to console with debug level
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger("email_service")

# Log the email configuration (without passwords)
logger.debug(f"Email configuration: MAIL_SERVER={settings.MAIL_SERVER}, PORT={settings.MAIL_PORT}, "
             f"FROM={settings.MAIL_FROM}, STARTTLS={settings.MAIL_STARTTLS}, SSL_TLS={settings.MAIL_SSL_TLS}")
logger.debug(f"Template folder path: {Path(settings.TEMPLATE_FOLDER).absolute()}")

# Check if template folder exists
template_path = Path(settings.TEMPLATE_FOLDER)
if not template_path.exists():
    logger.warning(f"Template folder does not exist: {template_path.absolute()}")
else:
    logger.info(f"Template folder exists: {template_path.absolute()}")
    # List template files
    template_files = list(template_path.glob("*.html"))
    logger.info(f"Template files found: {[f.name for f in template_files]}")

# Create the email configuration
try:
    conf = ConnectionConfig(
        MAIL_USERNAME=settings.MAIL_USERNAME,
        MAIL_PASSWORD=settings.MAIL_PASSWORD,
        MAIL_FROM=settings.MAIL_FROM,
        MAIL_PORT=settings.MAIL_PORT,
        MAIL_SERVER=settings.MAIL_SERVER,
        MAIL_FROM_NAME=settings.MAIL_FROM_NAME,
        MAIL_STARTTLS=settings.MAIL_STARTTLS,
        MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
        TEMPLATE_FOLDER=Path(settings.TEMPLATE_FOLDER)
    )
    logger.info("Email configuration created successfully")
except Exception as e:
    logger.error(f"Failed to create email configuration: {e}")

async def send_verification_email(background_tasks: BackgroundTasks, email: EmailStr, verification_code: str):
    """Send verification email to user."""
    try:
        logger.info(f"Sending verification email to {email}")

        # Debug output for template folder
        template_file = Path(settings.TEMPLATE_FOLDER) / "verification.html"
        logger.debug(f"Template file path: {template_file}")
        logger.debug(f"Template file exists: {template_file.exists()}")

        message = MessageSchema(
            subject=f"Account Verification for {settings.PROJECT_NAME}",
            recipients=[email],
            template_body={
                "verification_code": verification_code,
                "project_name": settings.PROJECT_NAME
            },
            subtype="html"
        )

        logger.debug("Creating FastMail instance")
        fm = FastMail(conf)

        logger.debug("Sending email...")
        await fm.send_message(message, template_name="verification.html")
        logger.info(f"Verification email sent successfully to {email}")
        return True
    except Exception as e:
        logger.exception(f"Failed to send verification email: {str(e)}")
        return False

async def send_reset_password_email(background_tasks: BackgroundTasks, email: EmailStr, token: str):
    """Send reset password email to user."""
    try:
        logger.info(f"Sending reset password email to {email}")

        # Debug output for template folder
        template_file = Path(settings.TEMPLATE_FOLDER) / "reset_password.html"
        logger.debug(f"Template file path: {template_file}")
        logger.debug(f"Template file exists: {template_file.exists()}")

        message = MessageSchema(
            subject=f"Password Reset for {settings.PROJECT_NAME}",
            recipients=[email],
            template_body={
                "reset_token": token,
                "project_name": settings.PROJECT_NAME
            },
            subtype="html"
        )

        logger.debug("Creating FastMail instance")
        fm = FastMail(conf)

        logger.debug("Sending email...")
        await fm.send_message(message, template_name="reset_password.html")
        logger.info(f"Reset password email sent successfully to {email}")
        return True
    except Exception as e:
       	logger.exception(f"Failed to send reset password email: {str(e)}")
        return False

async def send_contact_response_email(
    background_tasks: BackgroundTasks,
    email: EmailStr,
    first_name: str,
    last_name: str,
    message: str,
    response: str
):
    """Send response to contact form submission."""
    try:
        logger.info(f"Sending contact response email to {email}")

        template_file = Path(settings.TEMPLATE_FOLDER) / "contact_response.html"
        logger.debug(f"Template file path: {template_file}")
        logger.debug(f"Template file exists: {template_file.exists()}")

        email_message = MessageSchema(
            subject=f"Response to Your Inquiry - {settings.PROJECT_NAME}",
            recipients=[email],
            template_body={
                "first_name": first_name,
                "last_name": last_name,
                "message": message,
                "response": response,
                "project_name": settings.PROJECT_NAME
            },
            subtype="html"
        )

        logger.debug("Creating FastMail instance")
        fm = FastMail(conf)

        logger.debug("Sending email...")
        await fm.send_message(email_message, template_name="contact_response.html")
        logger.info(f"Contact response email sent successfully to {email}")
        return True
    except Exception as e:
        logger.exception(f"Failed to send contact response email: {str(e)}")
        return False