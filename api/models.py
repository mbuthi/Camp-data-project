from database import Base

from sqlalchemy import Column, String, Integer, ARRAY

import uuid

from sqlalchemy.dialects.postgresql import UUID

from typing import Literal

class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    # id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=False, index=True)
    last_name = Column(String, nullable=False, index=True)
    email = Column(String, nullable=False, index=True)
    password = Column(String, nullable=False)
    # roles = Column(ARRAY(String))


class RowNumber(Base):
    __tablename__ = "rownumber"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    row = Column(Integer, index=True)
    
class AccessionLink(Base):
    __tablename__ = "accession_sheet_link"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    accession = Column(Integer, index=True)
    google_sheet_link  = Column(String, index=True)
    
    