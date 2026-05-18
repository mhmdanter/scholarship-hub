from .base_scraper import BaseScraper

class MathProgramsSpider(BaseScraper):
    def __init__(self, name, base_url):
        super().__init__(name, base_url)

    def scrape(self):
        url = "https://www.mathprograms.org/db/programs"
        soup = self.get_soup(url)
        
        results = []
        
        if not soup:
            print(f"⚠️ {self.name} could not load the page.")
            return []

        for link in soup.select("a[href*='programs/']"):
            title = link.text.strip()
            if title and len(title) > 5: 
                results.append({
                    "title": title,
                    "provider": "MathPrograms.org",
                    "url": "https://www.mathprograms.org" + link.get('href') if link.get('href').startswith('/') else link.get('href')
                })
        
        unique_results = {res['url']: res for res in results}.values()
        
        print(f"✅ {self.name} successfully extracted {len(unique_results)} items.")
        return list(unique_results)