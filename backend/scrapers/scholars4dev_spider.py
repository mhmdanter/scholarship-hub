from .base_scraper import BaseScraper
class Scholars4DevSpider(BaseScraper):
    def scrape(self):
        soup = self.get_soup("https://www.scholars4dev.com/tag/university-scholarships/")

        results = []
        if not soup:
            return results

        for post in soup.select(".post-title a"):
            title = post.get_text(strip=True)
            url = post.get("href")

            results.append({
                "title": title,
                "description": title,
                "url": url,
                "provider": "Scholars4Dev",
                "category": "Scholarship",
                "level": "Master/PhD",
                "country": "Various",
                "deadline": "Varies",
                "funding_type": "Fully Funded"
            })

        return results