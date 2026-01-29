import { useQuery } from "@tanstack/react-query";
import { getHistory } from "../services/reportApi";
import { format } from "date-fns";
import { fr } from "date-fns/locale/fr";
import { useState } from "react";
import { FaChevronRight, FaChevronDown, FaWallet } from "react-icons/fa";

interface SidebarProps {
  onSelectMonth: (date: Date) => void;
}

export default function Sidebar({ onSelectMonth }: SidebarProps) {
  const { data: history, isLoading } = useQuery({
    queryKey: ["history"],
    queryFn: getHistory,
  });

  const [expandedMonths, setExpandedMonths] = useState<string[]>([]);

  const toggleMonth = (month: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering selection if button clicked
    setExpandedMonths((prev) =>
      prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month],
    );
  };

  if (isLoading)
    return (
      <div className="w-80 p-6 text-white/50 border-r border-white/10 h-screen">
        Chargement...
      </div>
    );

  const lastBalance =
    history && history.length > 0
      ? history[history.length - 1].runningBalance
      : 0;

  return (
    <aside className="w-80 bg-black/20 backdrop-blur-md border-r border-white/10 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-white/5 bg-linear-bg/50">
        <h2 className="text-xl font-bold text-white mb-2 leading-tight">
          Historique &<br />
          Balance
        </h2>
        <div className="flex items-center space-x-3 mt-4 p-4 rounded-2xl bg-white/5 border border-white/10 shadow-lg">
          <div className="p-3 rounded-full bg-linear-accent/20 text-linear-accent">
            <FaWallet size={20} />
          </div>
          <div>
            <p className="text-xs text-white/40 font-medium uppercase tracking-wider">
              Balance Totale
            </p>
            <span
              className={`text-xl font-mono font-bold ${lastBalance >= 0 ? "text-white" : "text-red-400"}`}
            >
              {lastBalance.toFixed(2)} €
            </span>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin">
        {history
          ?.slice()
          .reverse()
          .map((item) => (
            <div
              key={item.month}
              className="rounded-xl bg-white/2 border border-white/5 overflow-hidden hover:border-white/20 transition-all"
            >
              <div
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-white/5 transition-colors group"
                onClick={() => onSelectMonth(new Date(item.month))}
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
                  onClick={(e) => toggleMonth(item.month, e)}
                  className="p-2 text-white/20 hover:text-white transition-colors"
                >
                  {expandedMonths.includes(item.month) ? (
                    <FaChevronDown size={12} />
                  ) : (
                    <FaChevronRight size={12} />
                  )}
                </button>
              </div>

              {expandedMonths.includes(item.month) && (
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
          ))}
      </div>
    </aside>
  );
}
