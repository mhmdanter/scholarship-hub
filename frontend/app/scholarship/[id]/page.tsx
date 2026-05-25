"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ScholarshipDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://10.4.5.216:8000/scholarships/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Scholarship not found");
        return res.json();
      })
      .then((data) => {
        setItem(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Scholarship not found</h2>
        <button 
          onClick={() => router.push('/')}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold"
        >
          Back to Search
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <nav className="mb-8 flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="flex items-center text-slate-600 hover:text-blue-600 font-medium transition-colors"
          >
            <span className="mr-2">←</span> Back to list
          </button>
        </nav>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header Section */}
          <div className="p-6 md:p-10 border-b border-slate-100">
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider">
                {/* MAPPED: opportunity_type */}
                {item.opportunity_type || "General"}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
              {/* MAPPED: name */}
              {item.name}
            </h1>
            <p className="text-xl text-slate-500 font-medium italic">
              {/* MAPPED: provider */}
              {item.provider || "Academic Institution"}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-slate-100">
            <div className="p-6 border-b md:border-b-0 md:border-r border-slate-100 bg-slate-50/50">
              <p className="text-[10px] uppercase text-slate-400 font-bold mb-1 tracking-widest">Level</p>
              <p className="text-xl font-bold text-blue-600">
                {/* MAPPED: level (handles array or string) */}
                {Array.isArray(item.level) ? item.level.join(", ") : item.level || "Any"}
              </p>
            </div>
            <div className="p-6 border-b md:border-b-0 md:border-r border-slate-100 bg-slate-50/50">
              <p className="text-[10px] uppercase text-slate-400 font-bold mb-1 tracking-widest">Deadline</p>
              <p className="text-xl font-bold text-slate-900">{item.deadline || "Ongoing"}</p>
            </div>
            <div className="p-6 bg-slate-50/50">
              <p className="text-[10px] uppercase text-slate-400 font-bold mb-1 tracking-widest">Quality Score</p>
              <p className="text-xl font-bold text-slate-900">{item.data_quality_score || "N/A"}</p>
            </div>
          </div>

          {/* Description Section */}
          <div className="p-6 md:p-10">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Details</h3>
            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4">
              <p className="whitespace-pre-wrap">
                {/* MAPPED: name/provider again if description is null in your DB */}
                This {item.opportunity_type} program is provided by {item.provider}. 
                {item.is_math_intensive ? " This program is noted as being mathematics-intensive." : ""}
              </p>
            </div>

            <div className="mt-12 p-8 bg-slate-900 rounded-2xl text-white flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="text-xl font-bold mb-1">Ready to apply?</h4>
                <p className="text-slate-400">View the original listing for full eligibility criteria.</p>
              </div>
              <a 
                href={item.application_url} // MAPPED: application_url
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto bg-blue-600 text-white px-8 py-4 rounded-xl font-extrabold text-center hover:bg-blue-500 transition-all shadow-lg"
              >
                Apply on Official Site →
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}