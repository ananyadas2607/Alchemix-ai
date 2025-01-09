from pydantic import BaseModel
from typing import List, Optional

class WebsiteRequest(BaseModel):
    description: str
    business_type: str = "business"  # default value
    style_preferences: Optional[str] = "simple and minimal"
    features: Optional[List[str]] = ["basic"]
    layout_image: Optional[str] = None

class WebsiteResponse(BaseModel):
    html: str
    css: str
    preview: str