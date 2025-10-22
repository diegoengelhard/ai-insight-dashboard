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

"""
Example of expected response format:
You are a Senior Data Analyst. Your goal is to analyze a dataset summary and suggest 3-5 visualizations. NO MORE, NO LESS.
...
--- EXAMPLE RESPONSE ---
[ { "title": "Total Sales by Region", ... } ]
--- END EXAMPLE ---

--- DATASET SUMMARY ---
--- Dataset Schema and Basic Info ---
Filename: sample_sales.csv
Number of Rows: 9
Number of Columns: 5

Column Names and Data Types:
- 'OrderDate' (Type: object)
- 'Region' (Type: object)
- 'Category' (Type: object)
- 'Product' (Type: object)
- 'SaleAmount' (Type: int64)

--- Statistical Summary for Numerical Columns ---
       SaleAmount
count    9.000000
mean   258.000000
std    358.680000
min     30.000000
25%    125.000000
50%    180.000000
75%    200.000000
max   1200.000000

--- Analysis of Categorical Columns (Top 5 Values) ---

--- Dataset Schema and Basic Info ---
Filename: sample_sales.csv
Number of Rows: 9
Number of Columns: 5

Column Names and Data Types:
- 'OrderDate' (Type: object)
- 'Region' (Type: object)
- 'Category' (Type: object)
- 'Product' (Type: object)
- 'SaleAmount' (Type: int64)

--- Statistical Summary for Numerical Columns ---
       SaleAmount
count    9.000000
mean   258.000000
std    358.680000
min     30.000000
25%    125.000000
50%    180.000000
75%    200.000000
max   1200.000000

--- Analysis of Categorical Columns (Top 5 Values) ---

Column: 'Region'
North    3
South    2
West     2
East     2

Column: 'Category'
Electronics       4
Furniture         3
Office Supplies   2

Column: 'Product'
Laptop     1
Keyboard   1
Pens       1
Desk       1
Chair      1

--- END OF SUMMARY ---

Now, provide ONLY the JSON array as your response.
"""

"""
Expected JSON Response:
[
  {
    "title": "Sales Trend Over Time",
    "insight": "Sales fluctuate across months with a clear spike in mid-January driven by a high-value transaction, indicating irregular demand over time.",
    "parameters": {
      "chart_type": "line",
      "x_axis": "OrderDate",
      "y_axis": "SaleAmount",
      "aggregation": "sum"
    }
  },
  {
    "title": "Total Sales by Region",
    "insight": "The North region leads with $1,380 in sales (≈3.4x South), suggesting the strongest demand footprint.",
    "parameters": {
      "chart_type": "bar",
      "x_axis": "Region",
      "y_axis": "SaleAmount",
      "aggregation": "sum"
    }
  },
  {
    "title": "Sales Composition by Category",
    "insight": "Electronics concentrates ≈72% of revenue (1,662 of 2,322), far ahead of Furniture and Office Supplies.",
    "parameters": {
      "chart_type": "pie",
      "x_axis": "Category",
      "y_axis": "SaleAmount",
      "aggregation": "sum"
    }
  },
  {
    "title": "Average Order Value by Region",
    "insight": "Average ticket is highest in the North at ≈$460, outpacing other regions.",
    "parameters": {
      "chart_type": "bar",
      "x_axis": "Region",
      "y_axis": "SaleAmount",
      "aggregation": "mean"
    }
  }
]
"""