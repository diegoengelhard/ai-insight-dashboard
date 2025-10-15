from fastapi import APIRouter
from . import controllers

# This router will handle all API endpoints under the /api prefix
router = APIRouter(
    prefix="/api",  # All endpoints will start with /api
    tags=["status"],   # Tag for swagger UI grouping
)
    
@router.get("/status")
def get_status():
    return controllers.get_hello_message()