# Relative Path: backend/app/services/suggestions_service.py
# -----------------------------------------------------------------------------
# Correction:
# - The master_prompt f-string contained a dictionary-like structure with a
#   set union operator '|' between strings: {"sum" | "mean" | ...}.
# - This is invalid Python syntax inside an f-string, as it tries to execute
#   an unsupported operation on strings, causing a TypeError.
# - The fix is to change this line to a simple descriptive string that conveys
#   the same information to the LLM without being interpreted as executable code.
# -----------------------------------------------------------------------------

import json
import logging
from typing import List
from pydantic import ValidationError

from ..schemas.dto import SuggestionDTO
from ..services import profiling_service
from ..adapters import llm_client
from pathlib import Path
from fastapi import HTTPException, status

logger = logging.getLogger(__name__)

def generate_suggestions(dataset_id: str) -> List[SuggestionDTO]:
    """
    Generates chart suggestions for a given dataset ID.
    """
    summary_pack = profiling_service.create_summary_pack(dataset_id)

    master_prompt = f"""
    You are an expert data analyst. Your task is to analyze the following dataset summary
    and suggest 3 to 5 insightful and visually appealing charts. For each chart, you must
    provide a clear title, a brief insight, and the precise parameters required to build it.

    Your response MUST be a valid JSON array of objects. Each object must conform to the
    following structure:
    {{
      "title": "A clear, descriptive chart title.",
      "insight": "A brief, one-sentence insight explaining what the chart reveals.",
      "parameters": {{
        "chart_type": "one of ['bar', 'line', 'pie', 'scatter']",
        "x_axis": "The name of the column for the X-axis.",
        "y_axis": "The name of the column (or a list of columns) for the Y-axis.",
        "aggregation": "one of ['sum', 'mean', 'count', 'median', 'min', 'max']"
      }}
    }}

    Do not include any text, explanations, or code formatting outside of the main JSON array.

    --- DATASET SUMMARY ---
    {summary_pack}
    --- END OF SUMMARY ---

    Now, provide your JSON response.
    """
    
    # ... (el resto del código permanece igual)
    try:
        raw_llm_response = llm_client.get_suggestions_from_llm(master_prompt)
        suggestions_data = json.loads(raw_llm_response)
        
        # Pydantic validation
        validated_suggestions = [SuggestionDTO.parse_obj(item) for item in suggestions_data]
        
        logger.info(f"Successfully generated and validated {len(validated_suggestions)} suggestions for dataset '{dataset_id}'.")
        
        return validated_suggestions

    except json.JSONDecodeError:
        logger.error(f"LLM returned an invalid JSON string for dataset '{dataset_id}'.")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="The AI service returned a malformed response. Could not decode JSON."
        )
    except ValidationError as e:
        logger.error(f"LLM response failed Pydantic validation for dataset '{dataset_id}'. Errors: {e}")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"The AI service returned data in an unexpected format. Validation failed."
        )
    except Exception as e:
        logger.error(f"An unexpected error occurred during suggestion generation for dataset '{dataset_id}': {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while generating AI suggestions."
        )