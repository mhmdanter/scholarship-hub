from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from .db.db_manager import supabase # Reusing your existing client
from typing import List, Optional

app = FastAPI(title="Scholarship Hub API")

# 1. Enable CORS (Allows your Frontend to talk to your Backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Scholarship Hub API is Online"}

# 2. Route to get all scholarships with optional filtering
@app.get("/scholarships")
def get_scholarships(
    tag: Optional[str] = None, 
    limit: int = 20
):
    query = supabase.table("scholarships").select("*").limit(limit)
    
    if tag:
        # Use your auto-generated tags to filter
        query = query.contains("major_tags", [tag])
        
    response = query.execute()
    return response.data

# 3. Route to get a single scholarship by ID
@app.get("/scholarships/{item_id}")
def get_scholarship_detail(item_id: int):
    response = supabase.table("scholarships").select("*").eq("id", item_id).single().execute()
    return response.data