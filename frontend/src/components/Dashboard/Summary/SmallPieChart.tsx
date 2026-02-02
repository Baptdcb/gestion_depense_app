interface SmallPieChartProps {
  summary: Array<{
    categorie: {
      id: number;
      nom: string;
      couleur: string;
    };
    total: string | number;
  }>;
  total: number;
}

interface Slice {
  category: string;
  color: string;
  percent: number;
  startPercent: number;
}

export default function SmallPieChart({ summary, total }: SmallPieChartProps) {
  if (!summary || summary.length === 0 || total === 0) return null;

  const slices: Slice[] = summary.reduce<Slice[]>((acc, item) => {
    const percent = (Number(item.total) / total) * 100;
    const startPercent = acc.reduce((sum, slice) => sum + slice.percent, 0);
    acc.push({
      category: item.categorie.nom,
      color: item.categorie.couleur,
      percent,
      startPercent,
    });
    return acc;
  }, []);

  return (
    <svg viewBox="0 0 36 36" className="w-full h-full">
      <circle
        cx="18"
        cy="18"
        r="15.9155"
        fill="transparent"
        stroke="#1a1a1a"
        strokeWidth="3.8"
      />
      {slices.map((slice, idx) => {
        const angle = (slice.startPercent * 3.6).toFixed(2);
        const dashLength = ((slice.percent / 100) * 100).toFixed(2);
        return (
          <circle
            key={idx}
            cx="18"
            cy="18"
            r="15.9155"
            fill="transparent"
            stroke={slice.color}
            strokeWidth="3.8"
            strokeDasharray={`${dashLength} ${100 - Number(dashLength)}`}
            strokeDashoffset="25"
            transform={`rotate(${angle} 18 18)`}
          />
        );
      })}
    </svg>
  );
}
