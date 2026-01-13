from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from sqlmodel import SQLModel, create_engine
from dotenv import load_dotenv
import os

# Routers
from src.api.auth_router import router as auth_router
from src.api.task_router import router as task_router

# IMPORTANT: models import so SQLModel tables detect ho
import src.models 

# CORS settings
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "https://*.vercel.app",  
]

# Extra origins from env
cors_origin = os.getenv("CORS_ORIGIN")
if cors_origin:
    origins.extend(cors_origin.split(","))

# Load environment variables
load_dotenv()



# Database URL
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("❌ DATABASE_URL environment variable is not set")

# Create DB engine
engine = create_engine(
    DATABASE_URL,
    echo=True,            # SQL logs console mein
    pool_pre_ping=True,   # dead connections avoid
    pool_recycle=300      # 5 min baad recycle
)


# ✅ Lifespan (startup + shutdown replacement)
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 App starting... creating database tables")

    try:
        SQLModel.metadata.create_all(engine)
        print("✅ Tables created successfully")
    except Exception as e:
        print("❌ Error while creating tables:", e)
        raise

    yield  # ---- app runs here ----

    print("👋 App shutting down...")


# FastAPI app
app = FastAPI(
    title="Todo API",
    version="1.0.0",
    description="A RESTful API for managing todos with Neon PostgreSQL",
    lifespan=lifespan
)


# CORS settings
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
]

# Extra origins from env
cors_origin = os.getenv("CORS_ORIGIN")
if cors_origin:
    origins.extend(cors_origin.split(","))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Routers
app.include_router(auth_router, prefix="/api", tags=["Authentication"])
app.include_router(task_router, prefix="/api", tags=["Tasks"])


# Root
@app.get("/", tags=["Root"])
def read_root():
    return {
        "message": "Welcome to the Todo API with Neon PostgreSQL",
        "version": "1.0.0",
        "docs": "/docs"
    }


# Health check
@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "database": "Neon PostgreSQL"
    }

app = app  

