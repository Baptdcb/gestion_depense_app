import { useQuery } from "@tanstack/react-query";
import { getHistory } from "../../services/reportApi";
import { useState } from "react";
import TotaleBalance from "../../components/MonthsHistory/TotaleBalance";
import OneMonthReview from "./OneMonthReview";

interface SidebarProps {
  onSelectMonth: (date: Date) => void;
  onSelectYear: (year: number) => void;
  viewMode: "month" | "year";
  onChangeViewMode: (mode: "month" | "year") => void;
}

export default function Sidebar({
  onSelectMonth,
  onSelectYear,
  viewMode,
  onChangeViewMode,
}: SidebarProps) {
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

  const years = Array.from(
    new Set((history || []).map((item) => new Date(item.month).getFullYear())),
  ).sort((a, b) => b - a);

  const yearlyTotals = years.map((year) => {
    const items = (history || []).filter(
      (item) => new Date(item.month).getFullYear() === year,
    );
    const totalSpent = items.reduce((acc, item) => acc + item.totalSpent, 0);
    const totalBudget = items.reduce((acc, item) => acc + item.globalLimit, 0);
    const difference = items.reduce((acc, item) => acc + item.difference, 0);
    return { year, totalSpent, totalBudget, difference };
  });

  return (
    <aside className="w-80 bg-linear-surface backdrop-blur-md border-r border-white/10 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-white/5 bg-linear-surface/20">
        <h2 className="text-xl font-bold text-white mb-2 leading-tight">
          Historique & Balance
          <br />
        </h2>
        <TotaleBalance history={history} />
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={() => onChangeViewMode("month")}
            className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${
              viewMode === "month"
                ? "bg-linear-accent/20 text-linear-accent border-linear-accent/40"
                : "bg-white/5 text-white/60 border-white/10 hover:text-white"
            }`}
          >
            Mensuel
          </button>
          <button
            onClick={() => onChangeViewMode("year")}
            className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${
              viewMode === "year"
                ? "bg-linear-accent/20 text-linear-accent border-linear-accent/40"
                : "bg-white/5 text-white/60 border-white/10 hover:text-white"
            }`}
          >
            Annuel
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin">
        {viewMode === "month" ? (
          history
            ?.slice()
            .filter((item) => new Date(item.month) < new Date())
            .reverse()
            .map((item) => (
              <OneMonthReview
                key={item.month}
                item={item}
                isExpanded={expandedMonths.includes(item.month)}
                onSelect={() => onSelectMonth(new Date(item.month))}
                onToggle={(e) => toggleMonth(item.month, e)}
              />
            ))
        ) : (
          <div className="space-y-2">
            {yearlyTotals.map((yearItem) => (
              <div
                key={yearItem.year}
                className="rounded-xl bg-white/2 border border-white/5 overflow-hidden hover:border-white/20 transition-all"
              >
                <button
                  className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors"
                  onClick={() => onSelectYear(yearItem.year)}
                >
                  <div className="flex flex-col text-left">
                    <span className="font-medium text-sm text-white/90">
                      {yearItem.year}
                    </span>
                    <span
                      className={`text-xs font-mono mt-1 ${
                        yearItem.difference >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {yearItem.difference > 0 ? "+" : ""}
                      {yearItem.difference.toFixed(2)} €
                    </span>
                  </div>
                  <div className="text-xs text-white/50 text-right">
                    {yearItem.totalSpent.toFixed(2)} €
                    <div className="text-[10px] text-white/30">
                      Budget {yearItem.totalBudget.toFixed(2)} €
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
