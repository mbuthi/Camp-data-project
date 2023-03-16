from pydantic import BaseModel
from uuid import UUID
from enum import Enum
from typing import Optional
class Roles(str, Enum):
    admin = "admin"
    normal_user = "normail_user"


class UserBase(BaseModel):
    first_name : str
    last_name : str
    email : str
    # roles: list[Roles]


class UserCreate(UserBase):
    password : str
    
class User(UserBase):
    id : UUID
    
    class Config:
        orm_mode = True
        
        
class DataCreate(BaseModel):
    family : str	
    genus : str	
    species : str
    authority : str	
    localName : list[str]
    language : str	
    country : str
    
class UserLogin(BaseModel):
    password : str
    email : str

class Token(BaseModel):
    access_token : str
    token_type : str

class TokenData(BaseModel):
    email: str | None = None
    
class Row(BaseModel):
    row : int
    
    
class AccessionLink(BaseModel):
    accession : Optional[int] 
    google_sheet_link : Optional[str]
