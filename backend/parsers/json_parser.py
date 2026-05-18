import json
import os
from datetime import datetime

def standardize_data():
    raw_dir = "backend/data/raw"
    master_list = []

    for filename in os.listdir(raw_dir):
        if filename.endswith(".json"):
            with open(os.path.join(raw_dir, filename), 'r') as f:
                raw_data = json.load(f)
                
                for entry in raw_data:
                    standard_entry = {
                        "name": entry.get("title") or entry.get("name"),
                        "provider": entry.get("provider", "Unknown"),
                        "deadline": entry.get("deadline", "N/A"),
                        "application_url": entry.get("url") or entry.get("application_url"),
                        "source": filename.replace(".json", "")
                    }
                    master_list.append(standard_entry)

    output = {
        "scraped_at": datetime.now().isoformat(),
        "scholarships": master_list
    }
    
    with open("backend/data/standardized_scholarships.json", "w") as f:
        json.dump(output, f, indent=4)
    
    print(f"Successfully standardized {len(master_list)} scholarships!")

if __name__ == "__main__":
    standardize_data()