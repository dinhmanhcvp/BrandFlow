import sys
import os
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from app.services.document_processor import DocumentIngestor

ingestor = DocumentIngestor()
try:
    text = ingestor.ingest_url("https://example.com")
    print(f"Success! Length: {len(text)}")
except Exception as e:
    print(f"Error: {e}")
