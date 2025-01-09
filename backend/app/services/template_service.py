from anthropic import Anthropic
import os
from fastapi import HTTPException
from dotenv import load_dotenv
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

class TemplateGeneratorService:
    def __init__(self):
        try:
            api_key = os.getenv('ANTHROPIC_API_KEY')
            if not api_key:
                raise ValueError("ANTHROPIC_API_KEY environment variable is not set")
            
            # Clean the API key (remove quotes and whitespace)
            api_key = api_key.strip().replace('"', '')
            
            # Validate API key format
            if not api_key.startswith('sk-ant-api'):
                raise ValueError("Invalid API key format. It should start with 'sk-ant-api'")
                
            self.client = Anthropic(api_key=api_key)
            logger.info("Successfully initialized Anthropic client")
        except Exception as e:
            logger.error(f"Failed to initialize Anthropic client: {str(e)}")
            raise

    async def generate_template(self, description: str):
        try:
            logger.info("Starting template generation with Claude")
            message = self.client.messages.create(
                model="claude-3-sonnet-20240229",
                max_tokens=4000,
                temperature=0.7,
                messages=[{
                    "role": "user",
                    "content": description
                }]
            )
            
            logger.info("Successfully received response from Claude")
            if not message or not hasattr(message, 'content'):
                raise ValueError("No content received from Claude API")
                
            return message.content[0].text
            
        except Exception as e:
            logger.error(f"Error in template generation: {str(e)}")
            logger.error(f"Error type: {type(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Template generation failed: {str(e)}"
            ) 