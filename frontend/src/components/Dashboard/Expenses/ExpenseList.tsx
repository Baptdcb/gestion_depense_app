import { type Expense } from "../../../types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import DynamicFaIcon from "../../utils/DynamicFaIcon"; // Import DynamicFaIcon

interface ExpenseListItemProps {
  expense: Expense;
}

function ExpenseListItem({ expense }: ExpenseListItemProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/2 hover:bg-white/5 hover:border-white/10 transition-all group mb-3">
      <div className="flex items-center space-x-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center border border-white/10 shadow-lg relative overflow-hidden"
          style={{
            backgroundColor: `${expense.categorie.couleur}15`,
            color: expense.categorie.couleur,
          }}
        >
          <div className="absolute inset-0 opacity-20 bg-current" />
          <DynamicFaIcon iconName={expense.categorie.icone} size={20} />
        </div>
        <div>
          <p className="font-medium text-white/90 group-hover:text-white transition-colors">
            {expense.description || expense.categorie.nom}
          </p>
          <div className="flex items-center space-x-3 text-[11px] text-linear-text-secondary">
            <span className="flex items-center">
              {format(new Date(expense.date), "d MMM yyyy", { locale: fr })}
            </span>
            {expense.description && (
              <>
                <span className="w-1 h-1 rounded-full bg-white/10" />
                <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[10px] uppercase tracking-wider">
                  {expense.categorie.nom}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold text-lg text-white">
          {Number(expense.montant).toLocaleString("fr-FR", {
            minimumFractionDigits: 2,
          })}{" "}
          <span className="text-xs text-linear-text-secondary ml-0.5">€</span>
        </p>
      </div>
    </div>
  );
}

interface ExpenseListProps {
  expenses: Expense[];
}

export default function ExpenseList({ expenses }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        Aucune dépense pour ce mois.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {expenses.map((expense) => (
        <ExpenseListItem key={expense.id} expense={expense} />
      ))}
    </div>
  );
}
