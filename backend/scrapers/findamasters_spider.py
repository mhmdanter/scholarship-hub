from .base_scraper import BaseScraper


class FindAMastersSpider(BaseScraper):
    def scrape(self):
        soup = self.get_soup("https://www.findamasters.com/masters-degrees/mathematics/")

        results = []
        if not soup:
            return results

        for item in soup.select("a"):
            title = item.get_text(strip=True)
            url = item.get("href")

            if title and url:
                if not url.startswith("http"):
                    url = "https://www.findamasters.com" + url

                results.append({
                    "title": title,
                    "description": title,
                    "url": url,
                    "provider": "FindAMasters",
                    "category": "Masters",
                    "level": "Master",
                    "country": "Various",
                    "deadline": "Varies",
                    "funding_type": "Partial/Fully Funded"
                })

        return results