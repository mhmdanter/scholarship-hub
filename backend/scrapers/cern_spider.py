from .base_scraper import BaseScraper
class CERNSpider(BaseScraper):
    def scrape(self):
        soup = self.get_soup("https://careers.smartrecruiters.com/CERN")

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
                    "provider": "CERN",
                    "category": "Research Internship",
                    "level": "Master/PhD",
                    "country": "Switzerland",
                    "deadline": "Varies",
                    "funding_type": "Paid Internship"
                })

        return results