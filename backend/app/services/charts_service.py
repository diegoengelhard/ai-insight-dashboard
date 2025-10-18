import pandas as pd
from pathlib import Path
from typing import Dict, Any

# Import the INSTANCE of the adapter, not the module
from ..adapters.storage import storage_adapter
from ..schemas.dto import ChartParams, ChartDataResponse

VALID_AGGREGATIONS = {
    "sum": "sum",
    "mean": "mean",
    "count": "count",
    "median": "median",
    "min": "min",
    "max": "max",
}

def _load_dataframe(dataset_id: str) -> pd.DataFrame:
    """Loads a dataset into a pandas DataFrame based on its ID."""
    # Call the method on the storage_adapter instance
    dataset_path = storage_adapter.get_dataset_filepath(dataset_id)

    # The get_dataset_filepath method already checks for existence, but an extra
    # check here provides a more specific error message if needed.
    if not dataset_path.exists():
        raise FileNotFoundError(f"Data file for ID {dataset_id} does not exist at path {dataset_path}")

    if str(dataset_path).endswith('.csv'):
        return pd.read_csv(dataset_path)
    elif str(dataset_path).endswith('.xlsx'):
        return pd.read_excel(dataset_path)
    else:
        raise ValueError(f"Unsupported file type for dataset {dataset_id}")


def generate_chart_data(dataset_id: str, params: ChartParams) -> ChartDataResponse:
    """
    Generates chart data by loading a dataset and applying transformations.
    """
    df = _load_dataframe(dataset_id)

    agg_func = VALID_AGGREGATIONS.get(params.aggregation)
    if not agg_func:
        raise ValueError(f"Unsupported aggregation function: {params.aggregation}")
    try:
        aggregated_df = df.groupby(params.x_axis)[params.y_axis].agg(agg_func).reset_index()
    except KeyError as e:
        raise ValueError(f"Invalid column name provided for aggregation: {e}")

    aggregated_df.rename(columns={params.x_axis: 'x', params.y_axis: 'y'}, inplace=True)
    chart_data_points = aggregated_df.to_dict('records')

    # Structure the final response to match the ChartDataResponse DTO.
    # It expects a list of series objects, each with a label and data points.
    final_series = [{
        "label": params.y_axis,
        "data": chart_data_points
    }]

    return ChartDataResponse(series=final_series)
