from typing import List, Optional
from sqlalchemy.orm import Session
from ..models.item import Item
from ..schemas.item import ItemCreate, ItemUpdate

def create_item(db: Session, item: ItemCreate, owner_id: int) -> Item:
    db_item = Item(**item.dict(), owner_id=owner_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def get_item(db: Session, item_id: int) -> Optional[Item]:
    return db.query(Item).filter(Item.id == item_id).first()

def get_items(db: Session, skip: int = 0, limit: int = 100) -> List[Item]:
    return db.query(Item).offset(skip).limit(limit).all()

def get_user_items(db: Session, user_id: int) -> List[Item]:
    return db.query(Item).filter(Item.owner_id == user_id).all()
