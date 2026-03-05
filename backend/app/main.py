"""
MontgomeryAI - Smart City Dashboard Backend
FastAPI application with RAG-powered AI chatbot and real-time city data.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AI-Enhanced Civic Dashboard for the City of Montgomery, Alabama",
)

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
