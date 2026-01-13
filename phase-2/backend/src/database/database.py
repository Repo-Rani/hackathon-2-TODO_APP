from sqlmodel import create_engine, Session
from typing import Generator
import os
from dotenv import load_dotenv
# src/database/database.py
from sqlmodel import Session, create_engine
# Agar models import kar rahe ho toh:

# Load environment variables
load_dotenv()

# Get database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL")

# Create the engine
engine = create_engine(DATABASE_URL, echo=False)

def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session