from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks, status, Body
from bson import ObjectId
from datetime import datetime
from typing import List
from ...db.database import MongoDB
from ...schemas.contact import ContactFormCreate, ContactFormResponse
from ...core.email import send_contact_response_email
from ...api.deps import get_current_admin
from ...config import settings

router = APIRouter()


@router.post("/", response_model=ContactFormResponse)
async def submit_contact_form(
        contact_form: ContactFormCreate,
        background_tasks: BackgroundTasks
):
    try:
        contact_data = contact_form.model_dump()
        contact_data["created_at"] = datetime.utcnow()
        contact_data["status"] = "pending"

        result = MongoDB.db.contact_forms.insert_one(contact_data)

        return {
            "id": str(result.inserted_id),
            **contact_data,
            "created_at": contact_data["created_at"].isoformat()
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to submit contact form: {str(e)}"
        )


@router.get("/admin/reports", response_model=List[ContactFormResponse])
async def get_all_reports(current_user: dict = Depends(get_current_admin)):
    try:
        reports = list(MongoDB.db.contact_forms.find().sort("created_at", -1))

        formatted_reports = []
        for report in reports:
            formatted = {
                "id": str(report["_id"]),
                "first_name": report["first_name"],
                "last_name": report["last_name"],
                "email": report["email"],
                "phone": report.get("phone"),
                "message": report["message"],
                "status": report["status"],
                "created_at": report["created_at"].isoformat(),
                "response": report.get("response"),
                "responded_at": report.get("responded_at", ""),
                "responded_by": report.get("responded_by")
            }
            if report.get("responded_at"):
                formatted["responded_at"] = report["responded_at"].isoformat()
            formatted_reports.append(formatted)

        return formatted_reports
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch reports: {str(e)}"
        )


@router.post("/admin/reports/{report_id}/respond")
async def respond_to_report(
        report_id: str,
        response: dict = Body(...),
        background_tasks: BackgroundTasks = None,
        current_user: dict = Depends(get_current_admin)
):
    try:
        report_obj_id = ObjectId(report_id)
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid report ID format"
        )

    report = MongoDB.db.contact_forms.find_one({"_id": report_obj_id})
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )

    if not response.get("response"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Response text is required"
        )

    update_data = {
        "status": "responded",
        "response": response["response"],
        "responded_at": datetime.utcnow(),
        "responded_by": str(current_user["_id"])
    }

    MongoDB.db.contact_forms.update_one(
        {"_id": report_obj_id},
        {"$set": update_data}
    )

    updated_report = MongoDB.db.contact_forms.find_one({"_id": report_obj_id})

    if background_tasks:
        background_tasks.add_task(
            send_contact_response_email,
            background_tasks,
            updated_report["email"],
            updated_report["first_name"],
            updated_report["last_name"],
            updated_report["message"],
            response["response"]
        )

    return {
        "id": str(updated_report["_id"]),
        "status": "responded",
        "response": response["response"],
        "responded_at": update_data["responded_at"].isoformat()
    }


@router.put("/admin/reports/{report_id}/status")
async def update_report_status(
        report_id: str,
        status_data: dict = Body(...),
        current_user: dict = Depends(get_current_admin)
):
    try:
        report_obj_id = ObjectId(report_id)
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid report ID format"
        )

    valid_statuses = ["pending", "responded", "in_progress", "done"]
    if status_data.get("status") not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Status must be one of: {', '.join(valid_statuses)}"
        )

    update_data = {
        "status": status_data["status"],
        "updated_at": datetime.utcnow(),
        "updated_by": str(current_user["_id"])
    }

    MongoDB.db.contact_forms.update_one(
        {"_id": report_obj_id},
        {"$set": update_data}
    )

    updated_report = MongoDB.db.contact_forms.find_one({"_id": report_obj_id})

    return {
        "id": str(updated_report["_id"]),
        "status": status_data["status"],
        "updated_at": update_data["updated_at"].isoformat()
    }