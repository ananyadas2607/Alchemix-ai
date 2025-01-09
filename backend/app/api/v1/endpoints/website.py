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
        logger.info(f"Received template generation request for business type: {request.business_type}")
        
        # Initialize template service
        template_service = TemplateGeneratorService()
        
        # Create the prompt for the template generation
        prompt = f"""
        Create a modern, responsive website for a {request.business_type} with the following description:
        {request.description}
        
        Style preferences: {request.style_preferences}
        Features requested: {', '.join(request.features)}
        
        Please include:
        - A clean, modern design
        - Responsive layout using modern CSS (flexbox/grid)
        - Semantic HTML5 elements
        - Interactive elements
        - Proper spacing and typography
        
        Return the complete HTML and CSS code in the following format:
        
        HTML:
        ```html
        [Your HTML code here]
        ```
        
        CSS:
        ```css
        [Your CSS code here]
        ```
        """
        
        # Generate the template using Claude
        logger.info("Calling Claude API for template generation")
        generated_content = await template_service.generate_template(prompt)
        
        # Parse the response to extract HTML and CSS
        try:
            # Split the content into HTML and CSS sections
            html_section = generated_content.split("```html")[1].split("```")[0].strip()
            css_section = generated_content.split("```css")[1].split("```")[0].strip()
            
            return {
                "html": html_section,
                "css": css_section,
                "preview": "preview_url"
            }
        except Exception as parsing_error:
            logger.error(f"Error parsing Claude response: {parsing_error}")
            logger.debug(f"Raw content: {generated_content}")
            raise HTTPException(
                status_code=500,
                detail="Failed to parse the generated template. Please try again."
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
