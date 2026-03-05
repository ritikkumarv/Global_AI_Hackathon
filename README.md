# 🏛️ MontgomeryAI — Smart City Dashboard

> **AI-Enhanced Civic Dashboard for the City of Montgomery, Alabama**
> *One Global AI Hackathon @ GenAI.works Academy*

---

## 🎯 Problem Statement

The city of Montgomery faces challenges in ensuring residents have timely, accessible, and personalized information about their daily lives—ranging from public safety alerts to business activity and cultural events. Existing city services lack a centralized, real-time platform that can synthesize diverse datasets and offer AI-driven insights tailored to each citizen's needs.

## 🎯 Purpose

Build a real-time, AI-enhanced civic dashboard for Montgomery. By integrating live city data—such as weather, public safety, business licenses, and cultural events—alongside AI-driven personalized insights, it empowers residents with actionable, relevant information.

## 💡 Summary

A sleek, user-friendly interface that pulls real-time data from multiple city services. AI generates personalized recommendations and natural-language summaries. The goal is to create a unique, engaging, and informative tool that transforms how residents interact with their city—making Montgomery a more connected, informed, and resilient community.

---

## 📊 Datasets Used (All 8 Categories)

| # | Category | Items | Source |
|---|----------|-------|--------|
| 1 | 🏛️ City Services | 7 | Montgomery Open Data Portal |
| 2 | ℹ️ General Information | 5 | Montgomery Open Data Portal |
| 3 | 📈 Planning & Development | 6 | Montgomery Open Data Portal |
| 4 | ❤️ Public Health | 6 | Montgomery Open Data Portal |
| 5 | 🛡️ Public Safety | 6 | Montgomery Open Data Portal |
| 6 | 🌲 Recreation & Culture | 8 | Montgomery Open Data Portal |
| 7 | 🚗 Transportation | 5 | Montgomery Open Data Portal |
| 8 | 📍 Historical Markers | 8 | Montgomery Open Data Portal |

**+ Real-time Weather** via OpenWeatherMap API
**+ Live News Scraping** via Bright Data Web Scraper API
**+ AI Sentiment Analysis** on scraped city news
**+ City Service Alerts** via Bright Data web scraping

---

## 🏆 Challenge Stream Alignment

### Primary: Civic Access & Community Communication ✅
| Requirement | Implementation |
|---|---|
| Scrape live city updates | Bright Data Web Scraper scrapes Montgomery news & city alerts in real-time |
| Power resident-facing chatbots | RAG-powered "Ask Montgomery" chatbot across all 8 city datasets |
| Track sentiment or misinformation | AI sentiment analysis on scraped news (positive/neutral/negative with trends) |
| Service Finder with open data | Interactive Service Finder matching citizen needs to city services |

### Also Covers:
- **Smart Cities, Infrastructure & Public Spaces** — Interactive city map, transportation data, planning layers
- **Public Safety, Emergency Response & City Analytics** — Crime stats, police/fire data, alert system, emergency management
- **Workforce, Business & Economic Growth** — Business licenses, development projects, opportunity zones

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────┐
│              Next.js Frontend (React + TypeScript)        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐  │
│  │ Map      │ │ AI Chat  │ │ News &   │ │ Service    │  │
│  │ (Leaflet)│ │ (GenAI)  │ │Sentiment │ │ Finder     │  │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └─────┬──────┘  │
└───────┼─────────────┼────────────┼─────────────┼─────────┘
        │  REST API   │            │             │
┌───────▼─────────────▼────────────▼─────────────▼─────────┐
│              FastAPI Backend (Python)                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────────┐ │
│  │ Data     │ │ RAG      │ │ Bright   │ │ Sentiment   │ │
│  │ Loader   │ │ Engine   │ │ Data     │ │ Analyzer    │ │
│  │ (8 sets) │ │(LangChain│ │ Scraper  │ │ (OpenAI)    │ │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └──────┬──────┘ │
│       │        ┌────▼─────┐  ┌───▼──────┐       │        │
│       │        │ ChromaDB │  │Bright    │       │        │
│       │        │ Vectors  │  │Data API  │       │        │
│       │        └────┬─────┘  └──────────┘       │        │
│       │        ┌────▼─────┐  ┌──────────┐  ┌────▼─────┐ │
│       │        │ OpenAI   │  │OpenWeather│  │  NewsAPI  │ │
│       │        │ GPT-4o   │  │   API     │  │(fallback) │ │
│       │        └──────────┘  └──────────┘  └──────────┘ │
└──────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.10+**
- **Node.js 18+**
- **OpenAI API Key** (required — for AI chatbot & sentiment analysis)
- **Bright Data API Key** (recommended — for live news scraping)
- **OpenWeatherMap API Key** (optional — for live weather)
- **NewsAPI Key** (optional — fallback for news if Bright Data unavailable)

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate      # Windows
# source venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
copy .env.example .env
# Edit .env and add your API keys

# Run the backend
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
copy .env.local.example .env.local

# Run the frontend
npm run dev
```

### 3. Open the Dashboard

Navigate to **http://localhost:3000**

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14, React 18, TypeScript |
| **UI Styling** | Tailwind CSS, Custom Dark Theme |
| **Map** | Leaflet.js (CARTO dark tiles) |
| **Charts** | Recharts |
| **Animations** | Framer Motion, CSS Animations |
| **Backend** | Python FastAPI |
| **GenAI / LLM** | OpenAI GPT-4o-mini via LangChain |
| **RAG Pipeline** | LangChain + ChromaDB (Vector Store) |
| **Embeddings** | OpenAI text-embedding-3-small |
| **Web Scraping** | Bright Data Web Scraper API |
| **Sentiment** | OpenAI GPT-4o-mini (structured analysis) |
| **Real-time Data** | OpenWeatherMap API, Bright Data, NewsAPI |
| **Data Source** | City of Montgomery Open Data Portal |

---

## ✨ Key Features

- **Interactive Dark-Theme Map** — 8 toggleable data layers with glowing colored markers
- **AI Chatbot ("Ask Montgomery")** — RAG-powered Q&A across ALL city datasets
- **🌐 Live News via Bright Data** — Real-time web scraping of Montgomery news & events
- **📊 AI Sentiment Analysis** — Classifies scraped news as positive/neutral/negative with trends
- **🔍 AI Service Finder** — Natural language search to find the right city service
- **🚨 City Alerts** — Scraped emergency alerts and advisories
- **Real-Time Weather** — Live temperature, humidity, wind for Montgomery
- **Cross-Dataset AI Insights** — Ask questions that combine multiple datasets
- **Map-Chat Integration** — AI responses highlight relevant locations on map
- **Responsive Design** — Works on desktop and mobile
- **Live Stats Ticker** — Real-time dashboard metrics
- **Graceful Fallbacks** — Bright Data → NewsAPI → Mock Data; ensures demo always works

---

## 📁 Project Structure

```
Global_AI_Hackathon/
├── backend/
│   ├── app/
│   │   ├── api/routes.py          # All API endpoints
│   │   ├── core/config.py         # Configuration
│   │   ├── data/
│   │   │   ├── loader.py          # Dataset loader & processor
│   │   │   └── datasets/          # All 8 JSON datasets
│   │   ├── rag/engine.py          # RAG pipeline (LangChain + ChromaDB)
│   │   └── services/
│   │       ├── weather.py         # OpenWeatherMap integration
│   │       ├── scraper.py         # Bright Data web scraper
│   │       ├── sentiment.py       # AI sentiment analysis
│   │       └── service_finder.py  # AI service finder
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx         # Root layout
│   │   │   ├── page.tsx           # Main dashboard page
│   │   │   └── globals.css        # Global styles
│   │   ├── components/
│   │   │   ├── Map/CityMap.tsx    # Interactive Leaflet map
│   │   │   ├── Chat/ChatPanel.tsx # AI chatbot interface
│   │   │   ├── News/NewsSentimentPanel.tsx  # News & sentiment
│   │   │   ├── ServiceFinder/ServiceFinderPanel.tsx # Service finder
│   │   │   ├── Dashboard/        # Stats bar & layer panel
│   │   │   └── Layout/Header.tsx  # Header with live clock
│   │   ├── hooks/useApi.ts        # Data fetching hooks
│   │   ├── lib/api.ts             # API client
│   │   └── types/index.ts         # TypeScript types
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/health` | Health check |
| GET | `/api/v1/stats` | Dashboard statistics |
| GET | `/api/v1/categories` | All category summaries |
| GET | `/api/v1/datasets` | All datasets |
| GET | `/api/v1/datasets/{cat}` | Single dataset |
| GET | `/api/v1/map/points` | All map markers |
| GET | `/api/v1/map/points/{cat}` | Map markers by category |
| GET | `/api/v1/weather` | Current weather (live) |
| GET | `/api/v1/weather/forecast` | Weather forecast |
| POST | `/api/v1/chat` | AI chatbot (RAG) |
| POST | `/api/v1/chat/reset` | Reset chat history |
| GET | `/api/v1/news` | Live scraped news (Bright Data) |
| GET | `/api/v1/alerts` | City emergency alerts |
| GET | `/api/v1/sentiment` | Sentiment analysis report |
| POST | `/api/v1/sentiment/analyze` | Analyze custom text sentiment |
| POST | `/api/v1/services/find` | AI service finder |
| GET | `/api/v1/services/categories` | All service categories |

---

## 👥 Team

**One Global AI Hackathon** — GenAI.works Academy / Alabama State University

---

## 🔑 API Keys Required

| Key | Required | Source | Purpose |
|-----|----------|--------|---------|
| `OPENAI_API_KEY` | ✅ Yes | [platform.openai.com](https://platform.openai.com) | AI chat, sentiment analysis, service finder |
| `BRIGHT_DATA_API_KEY` | Recommended | [brightdata.com](https://brightdata.com) | Live news scraping |
| `BRIGHT_DATA_DATASET_ID` | With above | Bright Data dashboard | Web Scraper dataset |
| `OPENWEATHER_API_KEY` | Optional | [openweathermap.org](https://openweathermap.org) | Live weather |
| `NEWS_API_KEY` | Optional | [newsapi.org](https://newsapi.org) | News fallback |

> All features have graceful fallbacks — the demo works even without Bright Data/NewsAPI keys using realistic mock data.

---

*Built with ❤️ for the City of Montgomery — Powered by Bright Data • OpenAI • Montgomery Open Data*
