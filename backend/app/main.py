"""
MontgomeryAI - Smart City Dashboard Backend
FastAPI application with RAG-powered AI chatbot and real-time city data.
"""
import app.compat  # noqa: F401  — Python 3.14+ compatibility patches (must be first)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import router

import logging
import sys

# Configure verbose logging to file and console
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[
        logging.FileHandler("backend_verbose.log", encoding="utf-8"),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AI-Enhanced Civic Dashboard for the City of Montgomery, Alabama",
)

@app.on_event("startup")
async def startup_event():
    logger.info("Starting MontgomeryAI Backend with verbose logging enabled.")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router, prefix=settings.API_PREFIX)


@app.get("/")
async def root():
    return {
        "message": "🏛️ Welcome to MontgomeryAI - Smart City Dashboard API",
        "docs": "/docs",
        "api": settings.API_PREFIX,
    }
