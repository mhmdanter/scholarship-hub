from .base_scraper import BaseScraper
class APSSpider(BaseScraper):
    def scrape(self):
        soup = self.get_soup("https://www.aps.org/programs/honors/prizes")

        results = []
        if not soup:
            return results

        for item in soup.select("a"):
            title = item.get_text(strip=True)
            url = item.get("href")

            if title and url:
                if not url.startswith("http"):
                    url = "https://www.aps.org" + url

                results.append({
                    "title": title,
                    "description": title,
                    "url": url,
                    "provider": "APS",
                    "category": "Physics",
                    "level": "PhD/Postdoc",
                    "country": "USA",
                    "deadline": "Varies",
                    "funding_type": "Award"
                })

        return results