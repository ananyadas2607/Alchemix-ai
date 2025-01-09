from fastapi import APIRouter, Depends
from app.services.template_service import TemplateService

router = APIRouter()

@router.post("/generate-template")
async def generate_template(
    description: str,
    template_service: TemplateService = Depends(TemplateService)
):
    template = await template_service.generate_template(description)
    return {"template": template} 