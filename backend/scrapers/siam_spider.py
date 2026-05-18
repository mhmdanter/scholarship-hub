from .base_scraper import BaseScraper

class SIAMSpider(BaseScraper):
    def scrape(self):
        soup = self.get_soup("https://www.siam.org/prizes-recognition/fellows-program")

        results = []
        if not soup:
            return results

        for item in soup.select("a"):
            title = item.get_text(strip=True)
            url = item.get("href")

            if title and url:
                results.append({
                    "title": title,
                    "description": title,
                    "url": url,
                    "provider": "SIAM",
                    "category": "Applied Mathematics",
                    "level": "PhD/Postdoc",
                    "country": "USA",
                    "deadline": "Varies",
                    "funding_type": "Award/Fellowship"
                })

        return results