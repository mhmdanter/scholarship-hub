from .base_scraper import BaseScraper
class FindAPhDSpider(BaseScraper):
    def scrape(self):
        soup = self.get_soup("https://www.findaphd.com/phds/mathematics/")

        results = []
        if not soup:
            return results

        for item in soup.select("a"):
            title = item.get_text(strip=True)
            url = item.get("href")

            if title and url:
                if not url.startswith("http"):
                    url = "https://www.findaphd.com" + url

                results.append({
                    "title": title,
                    "description": title,
                    "url": url,
                    "provider": "FindAPhD",
                    "category": "PhD",
                    "level": "PhD",
                    "country": "Various",
                    "deadline": "Varies",
                    "funding_type": "Fully Funded"
                })

        return results