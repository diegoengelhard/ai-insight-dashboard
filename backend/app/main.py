from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

from .api import routers
from .schemas.dto import ErrorResponse

# --- Application Initialization ---
app = FastAPI(
    title="Dashboard AI API",
    description="An API that uses AI to analyze datasets and suggest visualizations.",
    version="1.0.0"
)

# --- Global Exception Handlers ---

@app.exception_handler(FileNotFoundError)
async def file_not_found_exception_handler(request: Request, exc: FileNotFoundError):
    """
    Handles `FileNotFoundError` exceptions raised anywhere in the app.
    Returns a 404 Not Found response with a clear error message.
    """
    return JSONResponse(
        status_code=404,
        content={"detail": str(exc)},
    )

@app.exception_handler(ValueError)
async def value_error_exception_handler(request: Request, exc: ValueError):
    """
    Handles `ValueError` exceptions, which we use for client-side errors
    like invalid parameters or unsupported operations.
    Returns a 400 Bad Request response.
    """
    return JSONResponse(
        status_code=400,
        content={"detail": str(exc)},
    )


# --- Middleware Configuration ---

# Add GZip middleware to compress responses, improving network performance.
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Add CORS middleware to allow cross-origin requests from the frontend.
# This is crucial for connecting the React app to this API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        # The default origin for the Vite dev server
        "http://localhost:5173", 
        "http://127.0.0.1:5173",
        # Add production frontend URL here when deployed
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# --- API Router Inclusion ---
# Include the routes defined in the `routers.py` file.
app.include_router(routers.router)

# --- Root Endpoint ---
@app.get("/", tags=["Root"])
async def read_root():
    """
    A simple root endpoint to confirm the API is running.
    """
    return {"status": "ok", "message": "Welcome to the Dashboard AI API"}

