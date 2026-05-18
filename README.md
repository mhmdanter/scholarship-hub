


# Install Playwright browsers (required for scraping)
playwright install chromium


# Start the FastAPI server locally
uvicorn backend.api:app --reload

# Start the Locust performance test
locust -f locustfile.py
