import React from 'react';

interface ScholarshipProps {
  title: string;
  organization: string;
  amount: string;
  deadline: string;
  category: string;
  link: string;
}

export default function OpportunityCard({ opportunity }: { opportunity: ScholarshipProps }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-blue-500 transition-all duration-300 flex flex-col h-full">
      {/* Badge & Amount */}
      <div className="flex justify-between items-start mb-4">
        <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          {opportunity.category}
        </span>
        <span className="text-green-600 font-bold text-lg leading-none">
          {opportunity.amount}
        </span>
      </div>

      {/* Title & Org */}
      <div className="flex-grow">
        <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-600">
          {opportunity.title}
        </h3>
        <p className="text-slate-500 text-sm mb-4">
          {opportunity.organization}
        </p>
      </div>

      {/* Bottom Meta Data */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase text-slate-400 font-semibold tracking-tighter">Deadline</span>
          <span className="text-sm font-medium text-slate-700">{opportunity.deadline}</span>
        </div>
        
        <a 
          href={opportunity.link}
          target="_blank"
          className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors shadow-sm"
        >
          View Details
        </a>
      </div>
    </div>
  );
}