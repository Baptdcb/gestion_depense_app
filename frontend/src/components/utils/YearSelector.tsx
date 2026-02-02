import { useMemo } from "react";

interface YearSelectorProps {
  selectedYear: number;
  onChange: (year: number) => void;
  minYear?: number;
  maxYear?: number;
}

export default function YearSelector({
  selectedYear,
  onChange,
  minYear,
  maxYear,
}: YearSelectorProps) {
  const years = useMemo(() => {
    const start = minYear ?? selectedYear - 5;
    const end = maxYear ?? selectedYear + 1;
    const list = [] as number[];
    for (let y = end; y >= start; y -= 1) {
      list.push(y);
    }
    return list;
  }, [minYear, maxYear, selectedYear]);

  return (
    <select
      className="bento-input text-sm appearance-none"
      value={selectedYear}
      onChange={(e) => onChange(Number(e.target.value))}
    >
      {years.map((year) => (
        <option key={year} value={year} className="bg-linear-surface">
          {year}
        </option>
      ))}
    </select>
  );
}
