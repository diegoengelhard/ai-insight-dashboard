ALLOWED_CHART_TYPES = {"bar", "line", "pie", "scatter"}

# Define the universe of supported aggregation functions.
# This is a critical security and stability feature. It prevents the backend
# from attempting to execute arbitrary or unsupported aggregation methods.
ALLOWED_AGGREGATIONS = {"sum", "mean", "count", "median", "min", "max"}


def validate_chart_type(value: str) -> str:
    """
    Pydantic validator to ensure a chart_type is within the allowed set.
    """
    if value not in ALLOWED_CHART_TYPES:
        raise ValueError(f"Invalid chart_type '{value}'. Must be one of {ALLOWED_CHART_TYPES}")
    return value


def validate_aggregation_type(value: str) -> str:
    """
    Pydantic validator to ensure an aggregation is within the allowed set.
    """
    if value not in ALLOWED_AGGREGATIONS:
        raise ValueError(f"Invalid aggregation '{value}'. Must be one of {ALLOWED_AGGREGATIONS}")
    return value
