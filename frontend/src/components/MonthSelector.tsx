import { format, subMonths, addMonths } from 'date-fns';
import { fr } from 'date-fns/locale';

interface MonthSelectorProps {
  selectedMonth: Date;
  setSelectedMonth: (date: Date) => void;
}

export default function MonthSelector({ selectedMonth, setSelectedMonth }: MonthSelectorProps) {
  const handlePrevMonth = () => {
    setSelectedMonth(subMonths(selectedMonth, 1));
  };

  const handleNextMonth = () => {
    setSelectedMonth(addMonths(selectedMonth, 1));
  };

  const formattedMonth = format(selectedMonth, 'MMMM yyyy', { locale: fr });

  return (
    <div className="flex items-center justify-center space-x-4 my-4">
      <button onClick={handlePrevMonth} className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">
        &lt; Préc.
      </button>
      <span className="text-xl font-semibold w-48 text-center">{formattedMonth}</span>
      <button onClick={handleNextMonth} className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">
        Suiv. &gt;
      </button>
    </div>
  );
}
