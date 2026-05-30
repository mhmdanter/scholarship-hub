import Link from "next/link";

function getDaysLeft(deadline: string | null): number | null {
  if (!deadline) return null;
  const diff = new Date(deadline).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getCategoryStyle(type: string) {
  const t = type?.toLowerCase();
  if (t?.includes("phd"))
    return { badge: "bg-purple-100 text-purple-700", label: "PHD" };
  if (t?.includes("postdoc"))
    return { badge: "bg-green-100 text-green-700", label: "POSTDOC" };
  if (t?.includes("master"))
    return { badge: "bg-yellow-100 text-yellow-700", label: "MASTER" };
  return { badge: "bg-blue-100 text-blue-700", label: type?.toUpperCase() || "GENERAL" };
}

function getDeadlineStyle(days: number | null) {
  if (days === null) return { color: "text-slate-400", label: "Ongoing" };
  if (days <= 10) return { color: "text-red-500", label: `In ${days} days` };
  if (days <= 30) return { color: "text-orange-500", label: `In ${days} days` };
  return { color: "text-green-600", label: `In ${days} days` };
}

export default function OpportunityCard({ item }: { item: any }) {
  const { badge, label } = getCategoryStyle(item.opportunity_type || item.category);
  const daysLeft = getDaysLeft(item.deadline);
  const { color, label: deadlineLabel } = getDeadlineStyle(daysLeft);

  // Math fields/tags — match your Supabase schema
  // Supabase schema uses: `major_tags` (TEXT[]) and `level` (TEXT[])
  const fields: string[] =
    item.major_tags ||
    item.level ||
    item.fields ||
    item.math_fields ||
    item.tags ||
    [];


  return (
    <Link href={`/scholarship/${item.id}`} className="group block h-full">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-lg hover:border-blue-300 transition-all duration-300 flex flex-col h-full">
        
        {/* Top row: badge + deadline */}
        <div className="flex justify-between items-center mb-3">
          <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${badge}`}>
            {label}
          </span>
          <span className={`flex items-center gap-1 text-xs font-semibold ${color}`}>
            {/* Calendar icon */}
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
            </svg>
            {deadlineLabel}
          </span>
        </div>

        {/* Title + provider */}
        <div className="flex-grow">
          <h3 className="text-base font-bold text-slate-900 mb-0.5 group-hover:text-blue-600 transition-colors leading-snug">
            {item.name || item.title}
          </h3>
          <p className="text-slate-400 text-xs mb-3">
            {item.provider || item.organization}
          </p>

          {/* Math field tags */}
          {fields.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {fields.map((field: string) => (
                <span key={field} className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 inline-block" />
                  {field.toUpperCase()}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-sm font-semibold text-blue-600 group-hover:underline">
            View Details →
          </span>
          {/* External link icon */}
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"
            className="text-slate-300" viewBox="0 0 24 24">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
        </div>
      </div>
    </Link>
  );
}