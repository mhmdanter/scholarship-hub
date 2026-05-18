import json
import hashlib
import re

def clean_text(text):
    if not text: return ""
    text = re.sub('<[^<]+?>', '', text)
    return " ".join(text.split()).strip()

def generate_fingerprint(name, provider):
    combined = f"{name}{provider}".lower().replace(" ", "")
    return hashlib.md5(combined.encode()).hexdigest()

def process_and_deduplicate():
    with open("backend/data/standardized_scholarships.json", "r") as f:
        data = json.load(f)
    
    raw_list = data.get("scholarships", [])
    unique_data = {}
    
    print(f"Starting cleaning for {len(raw_list)} items...")

    for item in raw_list:
        name = clean_text(item.get("name"))
        provider = clean_text(item.get("provider"))
        
        if not name or not provider:
            continue
            
        fingerprint = generate_fingerprint(name, provider)
        
        if fingerprint not in unique_data:
            item["name"] = name
            item["provider"] = provider
            item["fingerprint"] = fingerprint
            unique_data[fingerprint] = item
        else:
            print(f"Duplicate found and removed: {name}")

    final_list = list(unique_data.values())
    with open("backend/data/clean_dataset.json", "w") as f:
        json.dump(final_list, f, indent=4)
        
    print(f"Cleaning complete. Total unique scholarships: {len(final_list)}")

if __name__ == "__main__":
    process_and_deduplicate()