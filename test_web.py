import os
from dotenv import load_dotenv

load_dotenv()
os.environ["GEMINI_API_KEY"] = os.getenv("GEMINI_API_KEY", "dummy")
os.environ["GOOGLE_API_KEY"] = os.getenv("GOOGLE_API_KEY", "dummy")

from app.services.document_processor import DocumentIngestor

ingestor = DocumentIngestor()
try:
    text = ingestor.ingest_url("https://example.com")
    print(f"Success! Length: {len(text)}")
    print(text[:100])
except Exception as e:
    print(f"Error: {e}")
