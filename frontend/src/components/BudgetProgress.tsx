import { type Budget, type MonthlySummary } from "../types";

interface BudgetProgressProps {
  budget: Budget | null;
  summary: MonthlySummary[];
  totalSpent: number;
}

const ProgressBar = ({
  label,
  spent,
  limit,
  icon,
  categoryColor,
}: {
  label: string;
  spent: number;
  limit: number;
  icon?: string;
  categoryColor?: string;
}) => {
  const percentage = Math.min(100, Math.max(0, (spent / limit) * 100));
  const isOver = spent > limit;
  const isWarning = !isOver && percentage > 80;

  let colorClass = "bg-green-500";
  if (isOver) colorClass = "bg-red-500";
  else if (isWarning) colorClass = "bg-yellow-500";

  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <div className="flex items-center space-x-2 truncate w-1/2">
          {categoryColor && (
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: categoryColor }}
            />
          )}
          <span className="font-medium text-gray-700 truncate">{label}</span>
        </div>
        <span className="text-gray-600">
          <span className={isOver ? "text-red-600 font-bold" : ""}>
            {spent.toFixed(2)}
          </span>
          <span className="text-gray-400 mx-1">/</span>
          {limit.toFixed(2)} €
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${colorClass}`}
          style={{ width: `${limit > 0 ? percentage : spent > 0 ? 100 : 0}%` }}
        ></div>
      </div>
    </div>
  );
};

export default function BudgetProgress({
  budget,
  summary,
  totalSpent,
}: BudgetProgressProps) {
  if (!budget) {
    return (
      <div className="text-center p-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <p className="text-gray-500 mb-2">Pas de budget défini pour ce mois.</p>
      </div>
    );
  }

  const globalLimit = parseFloat(budget.globalLimit);

  // Map category usage
  // We need to merge budget.categoryBudgets with summary because some cats might have spent but no budget, or budget but no spent.
  const categoryStats = new Map<
    number,
    { nom: string; spent: number; limit: number; couleur: string }
  >();

  // Init with budgets
  budget.categoryBudgets.forEach((cb) => {
    categoryStats.set(cb.categoryId, {
      nom: cb.category.nom,
      spent: 0,
      limit: parseFloat(cb.limit),
      couleur: cb.category.couleur,
    });
  });

  // Merge with spent
  summary.forEach((s) => {
    const existing = categoryStats.get(s.categorie.id);
    if (existing) {
      existing.spent = Number(s.total) || 0;
    } else {
      // Spent but no budget set explicitly for this category (or it wasn't in the budget object?)
      // Note: budget.categoryBudgets should contain all if properly fetched, but let's be safe
      categoryStats.set(s.categorie.id, {
        nom: s.categorie.nom,
        spent: Number(s.total) || 0,
        limit: 0,
        couleur: s.categorie.couleur,
      });
    }
  });

  const sortedStats = Array.from(categoryStats.values()).sort((a, b) => {
    // Sort by % usage desc
    const aP = a.limit > 0 ? a.spent / a.limit : a.spent > 0 ? 1 : 0;
    const bP = b.limit > 0 ? b.spent / b.limit : b.spent > 0 ? 1 : 0;
    return bP - aP;
  });

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 className="text-lg font-bold text-blue-900 mb-2">Budget Global</h3>
        <ProgressBar
          label="Total Dépenses"
          spent={totalSpent}
          limit={globalLimit}
        />
        <div className="text-right text-xs text-blue-600 font-semibold">
          {totalSpent > globalLimit
            ? `Dépassement de ${(totalSpent - globalLimit).toFixed(2)} €`
            : `Reste: ${(globalLimit - totalSpent).toFixed(2)} €`}
        </div>
      </div>

      <div>
        <h3 className="text-md font-semibold text-gray-700 mb-4">
          Détail par Catégorie
        </h3>
        <div className="max-h-96 overflow-y-auto pr-2">
          {sortedStats.map((stat, idx) => (
            <ProgressBar
              key={idx}
              label={stat.nom}
              spent={stat.spent}
              limit={stat.limit}
              categoryColor={stat.couleur}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
