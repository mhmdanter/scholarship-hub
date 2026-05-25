import fastapi
from fastapi.middleware.cors import CORSMiddleware
from .db.db_manager import supabase
from typing import Optional

app = fastapi.FastAPI(title="Scholarship Hub API")

# 1. Enable CORS - UPDATED for better security but keeping flexible

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://10.4.5.216:3000",  # network IP here
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Scholarship Hub API is Online", "status": "Ready"}


# 2. Optimized Scholarship Route

@app.get("/scholarships")
def get_scholarships(
    category: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 100  # Increased limit to show more items initially
):
    # Start the query
    query = supabase.table("scholarships").select("*").order("id", desc=True)

    # Filter by Category if provided (matches your Frontend Buttons)
    if category and category != "All":
        query = query.eq("category", category)

    # Filter by Search term (Searching in title)
    if search:
        query = query.ilike("title", f"%{search}%")

    response = query.limit(limit).execute()
    return response.data


# 3. Route to get a single scholarship by ID
@app.get("/scholarships/{item_id}")
def get_scholarship_detail(item_id: str):
    # This now accepts the long UUID string from your logs
    response = (
        supabase.table("scholarships")
        .select("*")
        .eq("id", item_id)
        .execute()
    )

    if not response.data:
        return {"error": "Scholarship not found"}, 404

    return response.data[0]
