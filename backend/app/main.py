from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.routers import router as api_router

# Create the FastAPI application instance
app = FastAPI(
    title="Dashboard AI API",
    description="Backend for the AI dashboard creation.",
    version="1.0.0"
)

# CORS config to allow requests from the frontend
origins = [
    "http://localhost:5173",  # The Vite (frontend) port
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the API router
app.include_router(api_router)

# Dummy root endpoint to verify the server is running
@app.get("/")
def read_root():
    return {"status": "ok", "message": "Welcome to the Dashboard AI API"}
