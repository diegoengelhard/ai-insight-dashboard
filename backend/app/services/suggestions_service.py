import json
import logging
from typing import List
from pydantic import ValidationError
from fastapi import HTTPException, status

from ..schemas.dto import SuggestionDTO
from ..services import profiling_service
from ..adapters import llm_client

logger = logging.getLogger(__name__)

def generate_suggestions(dataset_id: str) -> List[SuggestionDTO]:
    summary_pack = profiling_service.create_summary_pack(dataset_id)

    # Example JSON structure to guide the LLM's response format.
    example_json = [
            {
                "title": "Total Sales by Region",
                "insight": "The East region leads in sales, suggesting a strong market presence or successful sales strategies in that area.",
                "parameters": {
                    "chart_type": "bar",
                    "x_axis": "Region",
                    "y_axis": "Sales",
                    "aggregation": "sum"
                }
            }
        ]

    # Refined and translated master prompt for the LLM.
    master_prompt = f"""
    You are a Senior Data Analyst. Your goal is to analyze a dataset summary and suggest 3-5 visualizations. NO MORE, NO LESS. 
    Regarding suggestions: Feel free to add between 3 (as minimum) and 5 (as maximum) suggestions, depending on what you find relevant. It's completely fine tsometimes 4, some other times 5, or even just 3 really good ones.
    You must return ONLY a valid JSON which should be an ARRAY of OBJECTS. Do not include any text outside the JSON array.

    Each object MUST have these keys: "title", "parameters", "insight".
    - "parameters" MUST contain: "chart_type", "x_axis", "y_axis", "aggregation".
    - "chart_type" MUST be JUST one of: "bar", "line", "pie", "scatter".
    - "aggregation" MUST be JUST one of: "sum", "mean", "count", "median", "min", "max".
    - "insight" MUST be a SINGLE sentence in English.

    --- EXAMPLE RESPONSE ---
    {json.dumps(example_json, indent=4)}
    --- END EXAMPLE ---

    --- DATASET SUMMARY ---
    {summary_pack}
    --- END OF SUMMARY ---

    Now, provide ONLY the JSON array as your response.
    """

    try:
        
        raw_llm_response = llm_client.get_suggestions_from_llm(master_prompt)
        print("--- RAW LLM RESPONSE ---")
        print(raw_llm_response)
        print("--- END RAW LLM RESPONSE ---")

        def _parse_llm_json(s: str):
            # Try direct load
            try:
                obj = json.loads(s)
                if isinstance(obj, list):
                    return obj
                if isinstance(obj, dict):
                    return [obj]
            except Exception:
                pass
            # Fallback: extract first JSON array substring
            start = s.find('[')
            end = s.rfind(']')
            if start != -1 and end != -1 and end > start:
                return json.loads(s[start:end+1])
            raise json.JSONDecodeError("Could not parse JSON array from LLM output.", s, 0)

        suggestions_data = _parse_llm_json(raw_llm_response)
        
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
            detail=f"The AI service returned data in an unexpected format. Validation failed: {e}"
        )
    except Exception as e:
        logger.error(f"An unexpected error occurred during suggestion generation for dataset '{dataset_id}': {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while generating AI suggestions."
        )
