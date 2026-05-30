# --- Scraper Configuration ---
SCRAPE_TIMEOUT = 60000  # 60 seconds
DEFAULT_DELAY_RANGE = (2, 7)  # Random delay between 2-7 seconds

# --- Modern User-Agents (Updated May 2026) ---
USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1"
]

# --- Auto-Tagging Logic ---
# Keywords used to scan titles and descriptions
TAG_CRITERIA = {
    "Fully Funded": [
        "fully funded", "full tuition", "stipend", "full ride", 
        "all expenses", "complete coverage", "bursary"
    ],
    "Undergraduate": [
        "undergraduate", "bachelor", "high school senior", 
        "freshman", "high school student", "secondary school"
    ],
    "Graduate": [
        "masters", "phd", "doctoral", "postgraduate", "graduate student"
    ],
    "International": [
        "international students", "any country", "global", 
        "study abroad", "non-citizen", "outside the country"
    ],
    "STEM": [
        "science", "technology", "engineering", "math", "physics", 
        "biology", "computer science", "chemistry", "it", "stem"
    ],
    "Financial Need": [
        "financial need", "low income", "economic hardship", 
        "socioeconomic", "underprivileged"
    ]
}

# --- Target URLs ---
TAG_CRITERIA = {
    "Fully Funded": ["full tuition", "fully funded", "stipend", "all expenses", "full ride"],
    "Undergraduate": ["undergraduate", "bachelor", "high school senior", "freshman"],
    "Graduate": ["masters", "phd", "doctoral", "postgraduate", "graduate"],
    "International": ["international students", "any country", "non-us citizen", "global"],
    "Math/STEM": ["mathematics", "physics", "statistics", "calculus", "stem", "engineering"]
}