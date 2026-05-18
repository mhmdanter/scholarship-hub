from playwright.sync_api import sync_playwright
import time
import random

class DynamicScraper:
    def __init__(self, name, base_url):
        self.name = name
        self.base_url = base_url

    def get_dynamic_soup(self, url):
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True) 
            context = browser.new_context(
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
            )
            page = context.new_page()
            
            try:
                print(f"🌐 Navigating to {url} via Playwright...")
                page.goto(url, wait_until="networkidle", timeout=60000)
                
                page.mouse.wheel(0, 1000)
                time.sleep(random.uniform(2, 4)) 
                
                content = page.content()
                from bs4 import BeautifulSoup
                return BeautifulSoup(content, 'html.parser')
                
            except Exception as e:
                print(f"❌ Playwright failed for {self.name}: {e}")
                return None
            finally:
                browser.close()