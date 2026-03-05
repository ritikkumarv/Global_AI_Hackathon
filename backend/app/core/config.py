import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    PROJECT_NAME: str = "MontgomeryAI - Smart City Dashboard"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api/v1"

    # OpenAI
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL: str = "gpt-4o-mini"
    OPENAI_EMBEDDING_MODEL: str = "text-embedding-3-small"

    # Weather
    OPENWEATHER_API_KEY: str = os.getenv("OPENWEATHER_API_KEY", "")
    MONTGOMERY_LAT: float = 32.3792
    MONTGOMERY_LON: float = -86.3077

    # Bright Data (Web Scraping)
    BRIGHT_DATA_API_KEY: str = os.getenv("BRIGHT_DATA_API_KEY", "")
    BRIGHT_DATA_DATASET_ID: str = os.getenv("BRIGHT_DATA_DATASET_ID", "")

    # Bright Data Scraping Browser (Puppeteer / Playwright over WSS)
    BRIGHT_DATA_BROWSER_WSS: str = os.getenv(
        "BRIGHT_DATA_BROWSER_WSS",
        "wss://brd-customer-hl_4a058a12-zone-scraping_browser1:moxhq12bumej@brd.superproxy.io:9222",
    )

    # NewsAPI (fallback for news scraping)
    NEWS_API_KEY: str = os.getenv("NEWS_API_KEY", "")

    # Montgomery Open Data Portal (ArcGIS Hub)
    MONTGOMERY_DATA_BASE_URL: str = os.getenv(
        "MONTGOMERY_DATA_BASE_URL", "https://opendata.montgomeryal.gov"
    )
    MONTGOMERY_ARCGIS_ORG_ID: str = "xNUwUjOJqYE54USz"
    MONTGOMERY_PORTAL_TIMEOUT: int = 15

    # Data paths
    DATA_DIR: str = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "datasets")

    # ChromaDB
    CHROMA_PERSIST_DIR: str = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "chroma_db"
    )

    # CORS
    ALLOWED_ORIGINS: list = ["http://localhost:3000", "http://127.0.0.1:3000"]


settings = Settings()
