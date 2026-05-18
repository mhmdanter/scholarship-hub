from .base_scraper import BaseScraper
class ApplyKiteSpider(BaseScraper):
    def scrape(self):
        soup = self.get_soup("https://applykite.com")

        results = []
        if not soup:
            return results

        for item in soup.select("a"):
            title = item.get_text(strip=True)
            url = item.get("href")

            if title and url:
                if not url.startswith("http"):
                    url = "https://applykite.com" + url

                results.append({
                    "title": title,
                    "description": title,
                    "url": url,
                    "provider": "ApplyKite",
                    "category": "Scholarship",
                    "level": "Master/PhD",
                    "country": "Various",
                    "deadline": "Varies",
                    "funding_type": "Varies"
                })

        return results