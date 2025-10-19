import logging
from openai import OpenAI, APIConnectionError, RateLimitError, APIStatusError

from ..config import settings

# Configure a logger for this module.
logger = logging.getLogger(__name__)

# Initialize the OpenAI client with the API key
try:
    client = OpenAI(api_key=settings.OPENAI_API_KEY)
except Exception as e:
    logger.error(f"Failed to initialize OpenAI client: {e}")
    client = None

def get_suggestions_from_llm(summary_pack: str, attempt=1) -> str:
    """
    Sends a dataset summary to the OpenAI API and returns its raw JSON response.
    """
    if not client:
        raise ConnectionError("OpenAI client is not initialized. Check API key configuration.")

    logger.info(f"--- Calling OpenAI API (Attempt {attempt}) ---")

    try:
        # Make the API call to OpenAI.
        response = client.chat.completions.create(
            model="gpt-3.5-turbo", # Cost-effective and fast model
            #response_format={"type": "json_object"}, # Enable JSON mode
            messages=[
                {"role": "system", "content": "You are a helpful data analyst designed to output JSON."},
                {"role": "user", "content": summary_pack}
            ],
            temperature=0.2, # Lower temperature for more deterministic, structured output
            max_tokens=1500, # Limit the response size to save costs
        )

        # Extract the JSON string from the response.
        raw_response = response.choices[0].message.content
        logger.info("Successfully received response from OpenAI API.")
        return raw_response

    except (APIConnectionError, RateLimitError, APIStatusError) as e:
        logger.error(f"OpenAI API Error: {e}")
        # For simplicity, we can retry once on specific, potentially transient errors.
        if attempt < 2:
            logger.warning("Retrying OpenAI API call...")
            return get_suggestions_from_llm(summary_pack, attempt + 1)
        raise ConnectionError(f"Failed to connect to OpenAI API after multiple attempts: {e}") from e
    
    except Exception as e:
        logger.error(f"An unexpected error occurred while calling OpenAI API: {e}")
        raise
