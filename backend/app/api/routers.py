from fastapi import APIRouter, UploadFile, File
from typing import List

# Import controller functions that handle the endpoint logic
from . import controllers

# Import DTOs to define the shape of requests and responses
from ..schemas.dto import (
    UploadSuccessResponse, SuggestionRequest, SuggestionDTO,
    ChartParams, ChartDataResponse, ErrorResponse
)

# Create an APIRouter instance
router = APIRouter(
    prefix="/api",
)

# --- Datasets Endpoints ---

@router.post(
    "/datasets/upload",
    response_model=UploadSuccessResponse,
    summary="Upload a dataset file",
    tags=["Datasets"],
    status_code=201
)
def upload_dataset_route(file: UploadFile = File(...)):
    return controllers.upload_dataset_controller(file)


# --- Analysis Endpoints ---

@router.post(
    "/analysis/suggestions",
    response_model=List[SuggestionDTO],
    summary="Generate AI-powered analysis suggestions",
    tags=["Analysis"],
    responses={
        404: {"model": ErrorResponse, "description": "Dataset not found"},
        502: {"model": ErrorResponse, "description": "Bad Gateway: AI service is unavailable or returned an invalid response."}
    }
)
def get_analysis_suggestions_route(request: SuggestionRequest):
    return controllers.get_analysis_suggestions_controller(request)


# --- Charts Endpoints ---

@router.post(
    "/charts/data",
    response_model=ChartDataResponse,
    summary="Get aggregated data for a specific chart",
    description="Takes a dataset ID and chart parameters, and returns the processed data ready for visualization.",
    tags=["Charts"],
    responses={
        404: {"model": ErrorResponse, "description": "Dataset not found"},
        400: {"model": ErrorResponse, "description": "Bad Request: Invalid parameters, such as a non-existent column or unsupported aggregation."}
    }
)
def get_chart_data_route(request: ChartParams):
    return controllers.get_chart_data_controller(request)
