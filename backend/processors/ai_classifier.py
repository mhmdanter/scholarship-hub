from google import genai
import os

# Best practice: use environment variables for keys
client = genai.Client(api_key=os.environ.get("AIzaSyA3GKm1Kt4hg0Pwy4FH8ZygdBtu6uPua70"))

def classify_opportunity(title, description=""):
    # System instructions tell the model how to behave before the prompt starts
    system_instruction = """
    You are an expert academic advisor. Categorize scholarships into EXACTLY ONE of these categories: 
    [Mathematics, Physics, Data Science, Engineering, Other].
    Return ONLY the category name. If unsure, return 'Other'.
    """
    
    prompt = f"Scholarship Title: {title}\nDescription: {description}"
    
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash", # Use the latest stable flash model for speed/cost
            config={'system_instruction': system_instruction},
            contents=prompt
        )
        category = response.text.strip()
        
        # Guardrail: ensure the AI didn't hallucinate a category
        allowed = ["Mathematics", "Physics", "Data Science", "Engineering", "Other"]
        return category if category in allowed else "Other"
    except Exception as e:
        print(f"AI Classification Error: {e}")
        return "Uncategorized"