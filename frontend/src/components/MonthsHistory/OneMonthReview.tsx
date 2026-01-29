import { format } from "date-fns";
import { fr } from "date-fns/locale/fr";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
import type { MonthlyHistoryItem } from "../../services/reportApi";

interface OneMonthReviewProps {
  item: MonthlyHistoryItem;
  isExpanded: boolean;
  onSelect: () => void;
  onToggle: (e: React.MouseEvent) => void;
}

export default function OneMonthReview({
  item,
  isExpanded,
  onSelect,
  onToggle,
}: OneMonthReviewProps) {
  return (
    <div className="rounded-xl bg-white/2 border border-white/5 overflow-hidden hover:border-white/20 transition-all">
      <div
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-white/5 transition-colors group"
        onClick={onSelect}
      >
        <div className="flex flex-col">
          <span className="font-medium text-sm group-hover:text-linear-accent transition-colors">
            {format(new Date(item.month), "MMMM yyyy", { locale: fr })}
          </span>
          <span
            className={`text-xs font-mono mt-1 ${item.difference >= 0 ? "text-green-400" : "text-red-400"}`}
          >
            {item.difference > 0 ? "+" : ""}
            {item.difference.toFixed(2)} €
          </span>
        </div>
        <button
          onClick={onToggle}
          className="p-2 text-white/20 hover:text-white transition-colors"
        >
          {isExpanded ? (
            <FaChevronDown size={12} />
          ) : (
            <FaChevronRight size={12} />
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="p-3 bg-black/20 text-xs space-y-2 border-t border-white/5 shadow-inner">
          {item.categories.map((cat) => (
            <div
              key={cat.categoryId}
              className="flex justify-between items-center text-white/60"
            >
              <span>{cat.name}</span>
              <span
                className={`font-mono ${cat.diff >= 0 ? "text-green-400/80" : "text-red-400/80"}`}
              >
                {cat.diff > 0 ? "+" : ""}
                {cat.diff.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
