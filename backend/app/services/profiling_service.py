import pandas as pd
from pathlib import Path
import json
from fastapi import HTTPException, status

# Import the settings object to get the correct storage path
from ..config import settings

def create_summary_pack(dataset_id: str) -> str:
    """
    Analyzes a dataset and creates a text summary for the LLM.
    """
    # --- 1. Locate and Load Dataset Manifest and File ---
    try:
        # Use the path from settings to build the manifest path
        manifest_path = settings.TEMP_STORAGE_PATH / dataset_id / "manifest.json"

        if not manifest_path.exists():
            raise FileNotFoundError("Manifest file not found.")

        with open(manifest_path, "r") as f: # Load the manifest file, which contains metadata about the dataset
            manifest = json.load(f)

        file_path = Path(manifest["storagePath"]) # Get the actual data file path from the manifest
        if not file_path.exists():
            raise FileNotFoundError("Data file not found at path specified in manifest.")

        if manifest["fileExtension"] == ".csv": # Read the dataset into a DataFrame based on file type
            df = pd.read_csv(file_path)
        elif manifest["fileExtension"] == ".xlsx":
            df = pd.read_excel(file_path)
        else:
            raise ValueError(f"Unsupported file type: {manifest['fileExtension']}")

    except FileNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Dataset '{dataset_id}' not found. {e}")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to read or process dataset file. Error: {str(e)}")

    # --- 2. Perform EDA and Build the Summary String (No changes here) ---
    summary_parts = []

    # Basic Information
    summary_parts.append("--- Dataset Schema and Basic Info ---")
    summary_parts.append(f"Filename: {manifest['originalFilename']}")
    summary_parts.append(f"Number of Rows: {len(df)}")
    summary_parts.append(f"Number of Columns: {len(df.columns)}")
    summary_parts.append("\nColumn Names and Data Types:")
    for col, dtype in df.dtypes.items():
        summary_parts.append(f"- '{col}' (Type: {dtype})")

    # Descriptive Statistics for Numerical Columns
    numeric_df = df.select_dtypes(include=['number'])
    if not numeric_df.empty:
        summary_parts.append("\n--- Statistical Summary for Numerical Columns ---") # e.g. mean, median, std, min, max
        summary_parts.append(numeric_df.describe().to_string())

    # Analysis of Categorical Columns
    categorical_df = df.select_dtypes(include=['object', 'category'])
    if not categorical_df.empty:
        summary_parts.append("\n--- Analysis of Categorical Columns (Top 5 Values) ---") # e.g. value counts for top categories
        for col in categorical_df.columns:
            if df[col].nunique() < 50:
                summary_parts.append(f"\nColumn: '{col}'")
                summary_parts.append(df[col].value_counts().nlargest(5).to_string())
            else:
                summary_parts.append(f"\nColumn: '{col}' has high cardinality (>50 unique values).") # e.g. user IDs, timestamps

    # Correlation Analysis
    if len(numeric_df.columns) > 1:
        summary_parts.append("\n--- Correlation Matrix (Top 5 Pairs by Absolute Value) ---") # e.g. correlation between numerical features
        corr_matrix = numeric_df.corr().abs()
        corr_pairs = corr_matrix.unstack()
        sorted_pairs = corr_pairs.sort_values(kind="quicksort", ascending=False)
        unique_pairs = sorted_pairs[sorted_pairs < 1.0].drop_duplicates()
        summary_parts.append(unique_pairs.head(5).to_string())

    # --- 3. Combine and Return the Summary Pack ---
    return "\n".join(summary_parts)

"""
Example of generated summary pack:

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
"""