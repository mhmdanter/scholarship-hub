"use client";
import { useState, useEffect } from 'react';
import OpportunityCard from './components/OpportunityCard';

export default function Home() {
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    fetch('/api/scholarships') 
    .then(res => res.json())
    .then(data => {
      console.log("Data received via proxy:", data);
      setScholarships(Array.isArray(data) ? data : []);
    })
    .catch(err => console.error("Fetch error:", err));
}, []);

  const filteredData = scholarships.filter((item: any) => {
    const title = item.name || item.title || "";
    const provider = item.provider || item.organization || "";
    const category = item.opportunity_type || item.category || "";
    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      activeCategory === "All" ||
      category.toLowerCase() === activeCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const categories = ["All", "Master", "PhD", "Postdoc"];

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10">
      {/* Search + Filter Bar */}
      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-3 mb-10">
        <div className="relative w-full sm:w-auto flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search by title, organization, or field..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeCategory === cat
                  ? "bg-blue-600 text-white shadow"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="max-w-5xl mx-auto">
        {filteredData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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