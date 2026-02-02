import { type Budget, type MonthlySummary } from "../../../types";
import ProgressBar from "../../utils/ProgressBar";

interface BudgetProgressProps {
  budget: Budget | null;
  summary: MonthlySummary[];
  totalSpent: number;
}

export default function BudgetProgress({
  budget,
  summary,
  totalSpent,
}: BudgetProgressProps) {
  if (!budget) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white/2 rounded-2xl border border-dashed border-white/10 group-hover:border-white/20 transition-colors">
        <p className="text-linear-text-secondary text-sm mb-4 text-center">
          Aucun objectif de budget pour cette période.
        </p>
        <div className="text-4xl font-bold text-white/20">0.00 €</div>
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
      <div className=" p-4 rounded-lg border-3   border-linear-accent shadow-lg">
        <h3 className="text-lg font-bold text-purple-100 mb-2">
          Budget Global
        </h3>
        <ProgressBar
          label="Total Dépenses"
          spent={totalSpent}
          limit={globalLimit}
        />
        <div className="text-right text-xs text-linear-accent font-semibold">
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
