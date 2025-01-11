from anthropic import Anthropic
import os
from fastapi import HTTPException
from dotenv import load_dotenv
import logging
import requests
import base64

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

class TemplateGeneratorService:
    def __init__(self):
        try:
            # Initialize Anthropic
            anthropic_key = os.getenv('ANTHROPIC_API_KEY')
            if not anthropic_key:
                raise ValueError("ANTHROPIC_API_KEY environment variable is not set")
            
            anthropic_key = anthropic_key.strip().replace('"', '')
            
            if not anthropic_key.startswith('sk-ant-api'):
                raise ValueError("Invalid API key format. It should start with 'sk-ant-api'")
                
            self.client = Anthropic(api_key=anthropic_key)
            logger.info("Successfully initialized Anthropic client")
        except Exception as e:
            logger.error(f"Failed to initialize services: {str(e)}")
            raise

    async def generate_template(self, description: str, layout_image: str = None):
        try:
            logger.info("Starting template generation process")
            
            # Base prompt for website generation
            base_prompt = """Please ensure the template:
            1. Is responsive using modern CSS practices (flexbox/grid)
            2. Has proper semantic HTML structure
            3. Is optimized for performance
            4. Uses real placeholder images from https://picsum.photos
            
            For images, use these URLs:
            - Hero/Banner image: https://picsum.photos/1200/600
            - Square images: https://picsum.photos/400
            - Profile/Team photos: https://picsum.photos/300/300
            - Gallery images: https://picsum.photos/800/600
            
            You can add random numbers to the URLs to get different images, like:
            https://picsum.photos/seed/1/400/300
            https://picsum.photos/seed/2/400/300"""

            if layout_image and layout_image.startswith('data:image'):
                # Extract the base64 image data
                image_data = layout_image.split(',')[1] if ',' in layout_image else layout_image
                
                full_prompt = f"""I have a hand-drawn layout sketch for a website. Please analyze this sketch and create a matching HTML/CSS template.

                The sketch shows the desired layout and structure of the website. Please interpret the drawn elements and create a corresponding website template.

                {base_prompt}

                Analyze the layout sketch and create a template that:
                1. Matches the overall structure shown in the sketch
                2. Interprets drawn boxes as content sections
                3. Converts rough sketches into proper UI elements
                4. Maintains the relative positioning of elements
                5. Uses appropriate semantic HTML elements

                [Sketch: {image_data}]

                Return ONLY the HTML and CSS code in this exact format:

                HTML:
                ```html
                [Your HTML code here with real image URLs]
                ```

                CSS:
                ```css
                [Your CSS code here]
                ```"""
            else:
                full_prompt = f"""Generate an HTML template based on this description: {description}
                
                {base_prompt}

                Return ONLY the HTML and CSS code in this exact format:

                HTML:
                ```html
                [Your HTML code here with real image URLs]
                ```

                CSS:
                ```css
                [Your CSS code here]
                ```"""

            # Generate template with Claude
            try:
                logger.info("Calling Claude API...")
                message = self.client.messages.create(
                    model="claude-3-sonnet-20240229",
                    max_tokens=4000,
                    temperature=0.7,
                    messages=[{
                        "role": "user",
                        "content": full_prompt
                    }]
                )
                logger.info("Successfully received response from Claude API")
                
                if not message or not hasattr(message, 'content'):
                    raise ValueError("No content received from Claude API")
                
                # Extract the content from the message
                content = message.content[0].text
                logger.info(f"Generated content length: {len(content)}")
                
                return content
                
            except Exception as claude_error:
                logger.error(f"Claude API error: {str(claude_error)}")
                raise HTTPException(
                    status_code=500,
                    detail=f"Error calling Claude API: {str(claude_error)}"
                )
            
        except Exception as e:
            logger.error(f"Error in template generation: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Template generation failed: {str(e)}"
            ) 