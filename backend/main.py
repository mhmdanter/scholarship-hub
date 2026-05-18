import os
import json
import sys
from pathlib import Path
from datetime import datetime

# --- 1. THE PATH FIX ---
BASE_DIR = Path(__file__).resolve().parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

# --- 2. THE UPDATED IMPORTS ---
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.db.db_manager import upload_to_supabase

from scrapers.mathprograms_spider import MathProgramsSpider
from scrapers.scholars4dev_spider import Scholars4DevSpider
from scrapers.ams_spider import AMSSpider
from scrapers.siam_spider import SIAMSpider
from scrapers.findamasters_spider import FindAMastersSpider
from scrapers.findaphd_spider import FindAPhDSpider
from scrapers.cern_spider import CERNSpider
from scrapers.aps_spider import APSSpider
from scrapers.applykite_spider import ApplyKiteSpider
# --- 3. DIRECTORY SETUP ---
RAW_DATA_DIR = BASE_DIR / "data" / "raw"
RAW_DATA_DIR.mkdir(parents=True, exist_ok=True)

# --- 4. INITIALIZE SPIDERS ---
spiders = [
    MathProgramsSpider("mathprograms", "https://www.mathprograms.org"),
    Scholars4DevSpider("scholars4dev", "https://www.scholars4dev.com"),
    AMSSpider("ams", "https://www.ams.org"),
    SIAMSpider("siam", "https://www.siam.org"),
    FindAMastersSpider("findamasters", "https://www.findamasters.com"),
    FindAPhDSpider("findaphd", "https://www.findaphd.com"),
    CERNSpider("cern", "https://careers.smartrecruiters.com"),
    APSSpider("aps", "https://www.aps.org"),
    ApplyKiteSpider("applykite", "https://applykite.com")
]

all_extracted_data = []
total_items = 0
successful_spiders = 0
failed_spiders = []

print("\n" + "=" * 50)
print(f"🕒 Run Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
print("=" * 50)

# --- 5. SCRAPING LOOP ---
for spider in spiders:
    print(f"\n🚀 Running {spider.name}...")
    try:
        data = spider.scrape()
        if not data:
            print(f"⚠️ No data found for {spider.name}")
            continue

        output_file = RAW_DATA_DIR / f"{spider.name}.json"
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4, ensure_ascii=False)

        all_extracted_data.extend(data)
        total_items += len(data)
        successful_spiders += 1
        print(f"✅ {spider.name} extracted {len(data)} items.")

    except Exception as e:
        failed_spiders.append(spider.name)
        print(f"❌ Error in {spider.name}: {e}")

# --- 6. DEDUPLICATION & SYNC ---
unique_results = {item['url']: item for item in all_extracted_data}.values()
final_list = list(unique_results)

MASTER_FILE = BASE_DIR / "data" / "clean_dataset.json"
with open(MASTER_FILE, "w", encoding="utf-8") as f:
    json.dump(final_list, f, indent=4, ensure_ascii=False)

print("\n☁️ Syncing to Supabase...")
try:
    upload_to_supabase(final_list)
    print("✅ Database sync complete!")
except Exception as e:
    print(f"⚠️ Database sync failed: {e}")

print("\n" + "=" * 50)
print(f"🏁 END OF RUN: {len(final_list)} unique items saved.")
print("=" * 50)