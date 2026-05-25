import Link from "next/link";

export default function OpportunityCard({ item }: { item: any }) {
  return (
    <Link href={`/scholarship/${item.id}`} className="group block h-full">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-blue-500 transition-all duration-300 flex flex-col h-full cursor-pointer">
        
        <div className="flex justify-between items-start mb-4">
          <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {item.opportunity_type || "General"}
          </span>
          <span className="text-green-600 font-bold text-lg leading-none">
             {/* Note: Your data shows null deadlines/amounts, keep fallbacks */}
            {item.deadline || "Ongoing"}
          </span>
        </div>

        <div className="flex-grow">
          {/* Change item.title to item.name */}
          <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
            {item.name}
          </h3>
          {/* Change item.organization to item.provider */}
          <p className="text-slate-500 text-sm mb-4">
            {item.provider}
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
           <span className="text-sm font-medium text-blue-600">View Program →</span>
        </div>
      </div>
    </Link>
  );
}