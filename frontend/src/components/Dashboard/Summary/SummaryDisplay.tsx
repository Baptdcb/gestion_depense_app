import { type MonthlySummary, type Expense } from "../../../types";

interface SummaryDisplayProps {
  summary: MonthlySummary[];
  isLoading: boolean;
  total: number;
  onCategoryClick?: (categoryId: number) => void;
  selectedCategoryId?: number | null;
  showSharedOnly?: boolean;
  expenses?: Expense[];
}

export default function SummaryDisplay({
  summary,
  isLoading,
  total,
  onCategoryClick,
  selectedCategoryId,
  showSharedOnly = false,
  expenses = [],
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

  // Calculer le total ajusté en mode partagé (seulement ce que l'utilisateur paie)
  const adjustedTotal = showSharedOnly
    ? expenses.reduce((acc, expense) => {
        const amount =
          expense.type === "refund"
            ? -Number(expense.montant)
            : Number(expense.montant);
        if (expense.isShared && expense.sharePercentage) {
          // L'utilisateur paie sa part seulement
          return acc + (amount * expense.sharePercentage) / 100;
        }
        // Pour les dépenses non partagées, on compte le montant complet
        return acc + amount;
      }, 0)
    : total;

  // Trier les catégories par pourcentage décroissant
  const sortedSummary = [...summary].sort(
    (a, b) => Number(b.total) - Number(a.total),
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sortedSummary.map((item, index) => (
          <div
            key={item.categorie.id || index}
            onClick={() => onCategoryClick?.(item.categorie.id)}
            className={`group flex flex-col p-4 rounded-xl transition-all cursor-pointer ${
              selectedCategoryId === item.categorie.id
                ? "bg-linear-accent/20 border-linear-accent/40 border-2"
                : "bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10"
            }`}
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
            {showSharedOnly ? "Votre Part" : "Dépense Totale"}
          </p>
          <p className="text-4xl font-bold bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent">
            {adjustedTotal.toLocaleString("fr-FR", {
              minimumFractionDigits: 2,
            })}{" "}
            €
          </p>
          {showSharedOnly && (
            <p className="text-xs text-blue-400 mt-2">
              Part de l'autre :{" "}
              {(total - adjustedTotal).toLocaleString("fr-FR", {
                minimumFractionDigits: 2,
              })}{" "}
              €
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
