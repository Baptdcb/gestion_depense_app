import { type MonthlySummary } from "../types";

interface SummaryDisplayProps {
  summary: MonthlySummary[];
  isLoading: boolean;
  total: number;
}

export default function SummaryDisplay({
  summary,
  isLoading,
  total,
}: SummaryDisplayProps) {
  if (isLoading) {
    return <div className="text-center py-4">Chargement du résumé...</div>;
  }

  if (summary.length === 0 && total === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        Pas de résumé pour ce mois.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {summary.map((item, index) => (
          <div
            key={item.categorie.id || index}
            className="group flex flex-col p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all cursor-default"
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <span
                  className="w-2 h-2 rounded-full mr-2 shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                  style={{
                    backgroundColor: item.categorie.couleur,
                    boxShadow: `0 0 10px ${item.categorie.couleur}66`,
                  }}
                />
                <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                  {item.categorie.nom}
                </span>
              </div>
              <span className="text-xs text-linear-text-secondary">
                {((Number(item.total) / total) * 100).toFixed(0)}%
              </span>
            </div>
            <span className="text-xl font-semibold text-white">
              {Number(item.total).toLocaleString("fr-FR", {
                minimumFractionDigits: 2,
              })}{" "}
              €
            </span>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-end">
        <div>
          <p className="text-xs uppercase tracking-widest text-linear-text-secondary mb-1">
            Dépense Totale
          </p>
          <p className="text-4xl font-bold bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent">
            {total.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
          </p>
        </div>
      </div>
    </div>
  );
}
