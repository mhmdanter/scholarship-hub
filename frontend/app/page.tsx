"use client";

import { useState, useEffect } from 'react';
import OpportunityCard from './components/OpportunityCard';

export default function Home() {
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    fetch('http://10.4.5.216:8000/scholarships')
      .then(res => res.json())
      .then(data => {
        console.log("Backend response:", data); // Check your F12 console for this!
        setScholarships(Array.isArray(data) ? data : []);
      })
      .catch(err => console.error("Fetch error:", err));
  }, []);

  const filteredData = scholarships.filter((item: any) => {
    // Safety check: make sure title exists before calling toLowerCase
    const title = item.title || "";
    const category = item.category || "All";
    
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["All","Master", "PhD", "Postdoctoral", "Research",];

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Scholarship Hub</h1>
        <p className="text-slate-600 mb-8">Discover and track global academic opportunities.</p>
        
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
                className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
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

      <div className="max-w-6xl mx-auto">
        {filteredData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((item: any) => (
              <OpportunityCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
            <p className="text-slate-400 text-lg">No scholarships found. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </main>
  );
}