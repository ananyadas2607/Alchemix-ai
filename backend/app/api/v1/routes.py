from fastapi import APIRouter
from .endpoints import website

api_router = APIRouter()

api_router.include_router(
    website.router,
    prefix="/website",
    tags=["website"]
)