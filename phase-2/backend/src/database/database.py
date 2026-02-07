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

# Create the engine with proper SSL settings for Neon
engine = create_engine(
    DATABASE_URL,
    echo=True,  # Enable SQL logging for debugging
    pool_pre_ping=True,   # Verify connections before use
    pool_recycle=300,     # Recycle connections every 5 minutes
    connect_args={
        "sslmode": "require",
        "connect_timeout": 10,
    }
)

def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session