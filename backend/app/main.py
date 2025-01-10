from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.routes import api_router
import os

app = FastAPI()

# CORS middleware with environment-based origins
allowed_origins = [
    "https://frontend-ks5on2clo-alchemix-ai.vercel.app",
    "http://localhost:3000",  # For local development
    os.getenv("FRONTEND_URL", ""),  # From environment variable
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin for origin in allowed_origins if origin],  # Filter out empty strings
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {
        "message": "API is running",
        "environment": os.getenv("ENVIRONMENT", "development"),
        "version": "1.0.0"
    }

# For Railway deployment
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True) 