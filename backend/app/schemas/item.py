from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ItemBase(BaseModel):
    title: str
    description: Optional[str] = None

class ItemCreate(ItemBase):
    pass

class ItemUpdate(ItemBase):
    pass

class Item(ItemBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True
