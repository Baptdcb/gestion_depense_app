import { useQuery } from "@tanstack/react-query";
import { getHistory } from "../../services/reportApi";
import { useState } from "react";
import TotaleBalance from "../../components/MonthsHistory/TotaleBalance";
import OneMonthReview from "./OneMonthReview";

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

  return (
    <aside className="w-80 bg-black/20 backdrop-blur-md border-r border-white/10 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-white/5 bg-linear-bg/50">
        <h2 className="text-xl font-bold text-white mb-2 leading-tight">
          Historique &<br />
          Balance
        </h2>
        <TotaleBalance history={history} />
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin">
        {history
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
          ))}
      </div>
    </aside>
  );
}
