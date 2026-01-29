import { format, subMonths, addMonths } from "date-fns";
import { fr } from "date-fns/locale";

interface MonthSelectorProps {
  selectedMonth: Date;
  setSelectedMonth: (date: Date) => void;
}

export default function MonthSelector({
  selectedMonth,
  setSelectedMonth,
}: MonthSelectorProps) {
  const handlePrevMonth = () => {
    setSelectedMonth(subMonths(selectedMonth, 1));
  };

  const handleNextMonth = () => {
    setSelectedMonth(addMonths(selectedMonth, 1));
  };

  const formattedMonth = format(selectedMonth, "MMMM yyyy", { locale: fr });

  return (
    <div className="flex items-center bg-white/3 border border-white/10 rounded-2xl p-1 shadow-inner">
      <button
        onClick={handlePrevMonth}
        className="p-2 hover:bg-white/5 rounded-xl transition-colors text-white/60 hover:text-white"
        aria-label="Mois précédent"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      <span className="text-sm font-medium px-6 text-center min-w-35 first-letter:uppercase text-white/90 tracking-tight">
        {formattedMonth}
      </span>

      <button
        onClick={handleNextMonth}
        className="p-2 hover:bg-white/5 rounded-xl transition-colors text-white/60 hover:text-white"
        aria-label="Mois suivant"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}
