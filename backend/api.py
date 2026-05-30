import fastapi
import os
from fastapi.middleware.cors import CORSMiddleware
from .db.db_manager import supabase # Ensure this uses os.environ for URL/Key
from typing import Optional
from fastapi.responses import JSONResponse

app = fastapi.FastAPI(title="Scholarship Hub API")

# Update CORS for Production
# Once you have your Vercel URL, replace "*" with ["https://your-app.vercel.app"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Scholarship Hub API is Online", "status": "Ready"}

@app.get("/scholarships")
def get_scholarships(
    category: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 100
):
    try:
        query = supabase.table("scholarships").select("*")

        if category and category != "All":
            query = query.eq("opportunity_type", category)

        if search:
            # Searches across name or provider
            query = query.or_(f"name.ilike.%{search}%,provider.ilike.%{search}%")

        response = query.order("id", desc=True).limit(limit).execute()
        return response.data
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": "Database connection failed"})

@app.get("/scholarships/{item_id}")
def get_scholarship_detail(item_id: str):
    try:
        # strip() is vital to prevent 404s from accidental URL spaces
        clean_id = item_id.strip()
        
        response = (
            supabase.table("scholarships")
            .select("*")
            .eq("id", clean_id)
            .maybe_single()
            .execute()
        )
        
        if not response.data:
            return JSONResponse(
                status_code=404, 
                content={"error": f"Scholarship {clean_id} not found"}
            )
            
        return response.data
    except Exception as e:
        return JSONResponse(
            status_code=500, 
            content={"error": "An internal server error occurred"}
        )