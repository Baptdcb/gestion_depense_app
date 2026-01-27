export default function ProgressBar({
  label,
  spent,
  limit,
  categoryColor,
}: {
  label: string;
  spent: number;
  limit: number;
  icon?: string;
  categoryColor?: string;
}) {
  const percentage = Math.min(100, Math.max(0, (spent / limit) * 100));
  const isOver = spent > limit;
  const isWarning = !isOver && percentage > 80;

  let colorClass = "bg-linear-accent shadow-[0_0_10px_rgba(94,106,210,0.3)]";
  if (isOver) colorClass = "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]";
  else if (isWarning)
    colorClass = "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]";

  return (
    <div className="mb-6 last:mb-0">
      <div className="flex justify-between text-xs mb-2">
        <div className="flex items-center space-x-2 truncate">
          {categoryColor && (
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: categoryColor }}
            />
          )}
          <span className="font-medium text-white/70 truncate uppercase tracking-wider">
            {label}
          </span>
        </div>

        <span className="text-linear-text-secondary">
          <span className={isOver ? "text-red-400 font-bold" : "text-white/90"}>
            {spent.toFixed(0)}
          </span>
          <span className="mx-1 text-white/20">/</span>
          {limit.toFixed(0)} <span className="text-[10px]">€</span>
        </span>
      </div>
      <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden border border-white/5">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${colorClass}`}
          style={{ width: `${limit > 0 ? percentage : spent > 0 ? 100 : 0}%` }}
        ></div>
      </div>
    </div>
  );
}
