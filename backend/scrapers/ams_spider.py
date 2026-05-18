from .base_scraper import BaseScraper

class AMSSpider(BaseScraper):
    def scrape(self):
        soup = self.get_soup("https://www.ams.org/opportunities")

        results = []
        if not soup:
            return results

        for item in soup.select("a"):
            title = item.get_text(strip=True)
            url = item.get("href")

            if title and url:
                if not url.startswith("http"):
                    url = "https://www.ams.org" + url

                results.append({
                    "title": title,
                    "description": title,
                    "url": url,
                    "provider": "AMS",
                    "category": "Mathematics",
                    "level": "PhD/Postdoc",
                    "country": "USA",
                    "deadline": "Varies",
                    "funding_type": "Fellowship"
                })

        return results