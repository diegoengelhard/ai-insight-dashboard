from fastapi import UploadFile
from typing import List

# Import services that contain the core business logic
from ..services import dataset_service, suggestions_service, charts_service

# Import DTOs (Data Transfer Objects) for request/response validation
from ..schemas.dto import UploadSuccessResponse, SuggestionRequest, SuggestionDTO, ChartParams, ChartDataResponse

# --- Dataset Controllers ---

def upload_dataset_controller(file: UploadFile) -> UploadSuccessResponse:
    """
    Controller to handle the dataset upload process.
    """
    result = dataset_service.process_new_dataset(file)
    return UploadSuccessResponse(datasetId=result["datasetId"], filename=result["filename"])


# --- Analysis Controllers ---

def get_analysis_suggestions_controller(request: SuggestionRequest) -> List[SuggestionDTO]:
    """
    Controller to handle the analysis suggestions request.
    """
    suggestions = suggestions_service.generate_suggestions(request.datasetId)
    return suggestions


# --- Chart Controllers ---

def get_chart_data_controller(request: ChartParams) -> ChartDataResponse:
    """
    Controller to handle the chart data generation request.
    It calls the charts_service to process the data based on chart parameters.
    """
    # The request body is a ChartParams object. We unpack its `datasetId`
    # and pass the object itself to the service.
    chart_data = charts_service.generate_chart_data(request.datasetId, request)
    return chart_data