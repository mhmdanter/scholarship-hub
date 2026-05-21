"use client"; // Required for Search and Filter logic

import { useState, useEffect } from 'react';
import OpportunityCard from './components/OpportunityCard';

export default function Home() {
  const [scholarships, setScholarships] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // 1. Fetch data from your Python Backend
  useEffect(() => {
    // Make sure your FastAPI is running on port 8000!
    fetch('http://10.4.5.216:8000/scholarships')
      .then(res => res.json())
      .then(data => setScholarships(data))
      .catch(err => console.error("Could not fetch scholarships:", err));
  }, []);

  // 2. Filter Logic (Search + Category)
  const filteredData = scholarships.filter((item: any) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["All", "STEM", "Full Fund", "Research", "Undergrad"];

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Scholarship Hub</h1>
        <p className="text-slate-600 mb-8">Discover and track global academic opportunities.</p>
        
        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <input 
            type="text"
            placeholder="Search by title or keyword..."
            className="w-full md:w-1/2 p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none text-slate-700"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeCategory === cat 
                  ? "bg-blue-600 text-white shadow-md" 
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Grid */}
      {filteredData.length > 0 ? (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((item: any) => (
            <OpportunityCard key={item.id} opportunity={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-slate-400 text-lg">No scholarships found matching your criteria.</p>
        </div>
      )}
    </main>
  );
}