from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from dotenv import load_dotenv

import os

load_dotenv()
db_url = os.getenv("DATABASE_URL", "sqlite:///./app.db")

if db_url.startswith("postgres") and "postgresql" not in db_url:
    db_url = db_url.replace("postgres", "postgresql")

SQLALCHEMY_DATABASE_URI = db_url

engine = create_engine(
    url=SQLALCHEMY_DATABASE_URI, 
)

SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False
)

Base = declarative_base()
