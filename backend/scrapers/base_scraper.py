from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
import requests
import time
import logging
import os
from datetime import datetime
from google import genai
from dotenv import load_dotenv

# Load API keys from .env file
load_dotenv()

class BaseScraper:
    def __init__(self, name, base_url):
        self.name = name
        self.base_url = base_url

        # --- LOGGING SETUP ---
        os.makedirs('backend/logs', exist_ok=True)
        self.logger = logging.getLogger(name)
        if not self.logger.handlers:
            log_file = f'backend/logs/run_{datetime.now().strftime("%Y-%m-%d")}.log'
            file_handler = logging.FileHandler(log_file)
            formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
            file_handler.setFormatter(formatter)
            self.logger.addHandler(file_handler)
            self.logger.setLevel(logging.INFO)

        # --- GEMINI CLIENT SETUP ---
        # It reads the key from your .env file
        api_key = os.environ.get("AIzaSyA3GKm1Kt4hg0Pwy4FH8ZygdBtu6uPua70")
        self.ai_client = genai.Client(api_key=api_key) if api_key else None

        self.headers = {
            "User-Agent": (
                "Mozilla/5.0 (X11; Linux x86_64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/122.0 Safari/537.36"
            )
        }

    def get_soup(self, url, retries=2):
        try:
            for attempt in range(retries):
                response = requests.get(
                    url,
                    headers=self.headers,
                    timeout=15
                )

                if response.status_code == 403:
                    print(f"🚫 403 detected for {self.name}")
                    self.logger.warning(f"403 Forbidden at {url}. Switching to Playwright.")
                    return self.get_soup_dynamic(url)

                if response.status_code == 200:
                    return BeautifulSoup(response.text, "html.parser")

                print(f"⚠️ Attempt {attempt+1} failed: {response.status_code}")
                time.sleep(2)

        except Exception as e:
            error_msg = f"❌ Requests Error for {self.name}: {e}"
            print(error_msg)
            self.logger.error(error_msg)

        return None

    def get_soup_dynamic(self, url):
        print(f"🎭 Playwright scraping: {url}")
        try:
            with sync_playwright() as p:
                browser = p.chromium.launch(
                    headless=True,
                    args=["--no-sandbox"]
                )
                page = browser.new_page()
                page.set_extra_http_headers(self.headers)
                page.goto(
                    url,
                    wait_until="domcontentloaded",
                    timeout=30000   
                )
                html = page.content()
                browser.close()
                return BeautifulSoup(html, "html.parser")

        except Exception as e:
            error_msg = f"❌ Playwright Error for {self.name}: {e}"
            print(error_msg)
            self.logger.error(error_msg)
            return None

    # --- NEW AI CLASSIFICATION METHOD ---
    def ai_classify(self, title, description=""):
        """Uses Gemini to intelligently categorize a scholarship."""
        if not self.ai_client:
            return "Uncategorized"

        system_instruction = """
        You are an expert academic advisor. Categorize scholarships into EXACTLY ONE of these categories: 
        [Mathematics, Physics, Data Science, Engineering, Other].
        Return ONLY the category name. If unsure, return 'Other'.
        """
        
        prompt = f"Scholarship Title: {title}\nDescription: {description}"
        
        try:
            response = self.ai_client.models.generate_content(
                model="gemini-2.0-flash",
                config={'system_instruction': system_instruction},
                contents=prompt
            )
            return response.text.strip()
        except Exception as e:
            self.logger.error(f"AI Classification Error: {e}")
            return "Other"