from fastapi import APIRouter, HTTPException
from app.schemas.website import WebsiteRequest, WebsiteResponse
from app.services.template_service import TemplateGeneratorService
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/generate-template", response_model=WebsiteResponse)
async def generate_template(request: WebsiteRequest):
    try:
        logger.info(f"Received template generation request: {request.description}")
        if request.layout_image:
            logger.info("Layout image provided")
        
        # Initialize template service
        template_service = TemplateGeneratorService()
        
        # Generate the template
        generated_content = await template_service.generate_template(
            description=request.description,
            layout_image=request.layout_image
        )
        logger.info("Template generated successfully")
        
        # Parse the response to extract HTML and CSS
        try:
            # Split the content into HTML and CSS sections
            html_parts = generated_content.split("```html")
            if len(html_parts) < 2:
                raise ValueError("Could not find HTML section in response")
            
            html_section = html_parts[1].split("```")[0].strip()
            
            css_parts = generated_content.split("```css")
            if len(css_parts) < 2:
                raise ValueError("Could not find CSS section in response")
                
            css_section = css_parts[1].split("```")[0].strip()
            
            logger.info("Successfully parsed HTML and CSS sections")
            
            return {
                "html": html_section,
                "css": css_section,
                "preview": "preview_url"  # Placeholder for preview URL
            }
        except Exception as parsing_error:
            logger.error(f"Error parsing Claude response: {parsing_error}")
            logger.error(f"Raw content: {generated_content}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to parse the generated template: {str(parsing_error)}"
            )
            
    except ValueError as ve:
        logger.error(f"Validation error: {str(ve)}")
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logger.error(f"Template generation failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Template generation failed: {str(e)}"
        )
