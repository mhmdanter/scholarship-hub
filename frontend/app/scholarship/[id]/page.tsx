"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

function getDaysLeft(deadline: string | null): number | null {
  if (!deadline) return null;
  const diff = new Date(deadline).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getCategoryStyle(type: string) {
  const t = (type || "").toLowerCase();
  if (t.includes("phd"))     return { badge: "bg-purple-100 text-purple-700", label: "PHD" };
  if (t.includes("postdoc")) return { badge: "bg-green-100 text-green-700",   label: "POSTDOC" };
  if (t.includes("master"))  return { badge: "bg-yellow-100 text-yellow-700", label: "MASTER" };
  if (t.includes("research"))return { badge: "bg-blue-100 text-blue-700",     label: "RESEARCH" };
  return { badge: "bg-slate-100 text-slate-600", label: type?.toUpperCase() || "GENERAL" };
}

export default function ScholarshipDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Note: Fetching via the internal proxy route we created
    if (!id || Array.isArray(id)) return;

    fetch(`/api/scholarships/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setItem(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setItem(null);
        setLoading(false);
      });
  }, [id]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600" />
          <p className="text-slate-400 text-sm font-medium">Loading details...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-8 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Scholarship not found</h2>
        <button onClick={() => router.push('/')} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold transition">
          Back to Hub
        </button>
      </div>
    );
  }

  const { badge, label } = getCategoryStyle(item.opportunity_type || item.category || "");
  const daysLeft = getDaysLeft(item.deadline);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm mb-8 transition-colors">
          ← Back to list
        </button>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-8 md:p-12 border-b border-slate-50">
            <div className="flex items-center gap-3 mb-6">
              <span className={`text-[10px] font-black px-4 py-1.5 rounded-lg tracking-widest ${badge}`}>
                {label}
              </span>
              {daysLeft !== null && (
                <span className="text-orange-500 font-bold text-xs">
                  In {daysLeft} days
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 leading-tight">
              {item.name || item.title}
            </h1>
            <p className="text-xl text-slate-400 font-medium">
              {item.provider || item.organization}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 border-b border-slate-50">
            <div className="p-8 border-b md:border-b-0 md:border-r border-slate-50">
              <p className="text-[10px] uppercase text-slate-400 font-black mb-1 tracking-widest">Target Level</p>
              <p className="text-lg font-bold text-indigo-600">{Array.isArray(item.level) ? item.level.join(", ") : item.level || "Postgraduate"}</p>
            </div>
            <div className="p-8 border-b md:border-b-0 md:border-r border-slate-50">
              <p className="text-[10px] uppercase text-slate-400 font-black mb-1 tracking-widest">Deadline</p>
              <p className="text-lg font-bold text-slate-900">{item.deadline || "Ongoing"}</p>
            </div>
            <div className="p-8">
              <p className="text-[10px] uppercase text-slate-400 font-black mb-1 tracking-widest">Quality Score</p>
              <p className="text-lg font-bold text-green-600">{item.data_quality_score}/10</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 md:p-12">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Opportunity Description</h3>
            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-6">
              <p className="whitespace-pre-wrap text-lg">
                This {item.opportunity_type || "academic"} program is provided by {item.provider}. 
                {item.is_math_intensive && " This opportunity is identified as being mathematics-intensive."}
              </p>
            </div>

            {/* CTA Section */}
            {item.application_url && (
              <div className="mt-12 p-10 bg-slate-900 rounded-[2rem] text-white flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <h4 className="text-2xl font-black mb-2">Ready to apply?</h4>
                  <p className="text-slate-400">Please review all eligibility criteria on the official portal.</p>
                </div>
                {/* FIX: Properly formatted opening anchor tag */}
                <a 
                  href={item.application_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full md:w-auto bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black text-center hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-900/20"
                >
                  Apply on Official Site →
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}