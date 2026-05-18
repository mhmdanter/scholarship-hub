import os
import re
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

# Read credentials from environment variables (recommended)
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Initialize Supabase Client
try:
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("⚠️ Warning: SUPABASE_URL and/or SUPABASE_KEY not set. Supabase sync will be disabled.")
        supabase: Client | None = None
    else:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
except Exception as e:
    print(f"❌ Supabase Initialization Error: {e}")
    supabase = None


def upload_to_supabase(data_list):
    """Clears, formats, and syncs scraped data to the `scholarships` table."""
    if not supabase:
        print("❌ Sync aborted: Supabase client is not initialized.")
        return

    if not data_list:
        print("⚠️ Sync aborted: No data provided to the uploader.")
        return

    final_data = []

    for item in data_list:
        # DATE CLEANING: Postgres DATE expects YYYY-MM-DD
        raw_date = item.get("deadline")
        clean_date = None
        if raw_date and re.match(r"^\d{4}-\d{2}-\d{2}$", str(raw_date)):
            clean_date = raw_date

        # ARRAY FORMATTING: Postgres TEXT[] expects a Python list
        raw_level = item.get("level", [])
        level_list = [raw_level] if isinstance(raw_level, str) else raw_level

        raw_tags = item.get("tags", [])
        tags_list = [raw_tags] if isinstance(raw_tags, str) else raw_tags

        clean_item = {
            "name": item.get("title", "Untitled Opportunity"),
            "provider": item.get("provider", "Unknown Provider"),
            "application_url": item.get("url"),
            "opportunity_type": item.get("category", "Scholarship"),
            "deadline": clean_date,
            "is_math_intensive": True,
            "level": level_list,
            "major_tags": tags_list,
        }

        # Unique constraint: application_url
        if clean_item["application_url"]:
            final_data.append(clean_item)

    try:
        print(f"🚀 Syncing {len(final_data)} items to Production Table...")
        response = supabase.table("scholarships").upsert(
            final_data,
            on_conflict="application_url",
        ).execute()

        print(f"✅ SUCCESS: {len(final_data)} scholarships are now live in Supabase!")
        return response

    except Exception as e:
        error_str = str(e)
        if "42501" in error_str:
            print("❌ SECURITY ERROR (42501): Row-Level Security is blocking the insert.")
        elif "22P02" in error_str:
            print("❌ DATA TYPE ERROR (22P02): Level or Tags are not formatted as arrays.")
        elif "22007" in error_str:
            print("❌ DATE ERROR (22007): An invalid date string reached the database.")
        else:
            print(f"❌ DATABASE SYNC ERROR: {e}")

