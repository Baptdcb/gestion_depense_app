import { type Expense } from "../types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import DynamicFaIcon from "./DynamicFaIcon"; // Import DynamicFaIcon

interface ExpenseListItemProps {
  expense: Expense;
}

function ExpenseListItem({ expense }: ExpenseListItemProps) {
  return (
    <div className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm mb-2">
      <div className="flex items-center space-x-4">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-100"
          style={{ backgroundColor: expense.categorie.couleur }}
        >
          <DynamicFaIcon iconName={expense.categorie.icone} size={18} />
        </div>
        <div>
          <p className="font-semibold text-gray-800">
            {expense.description || expense.categorie.nom}
          </p>
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <span>
              {format(new Date(expense.date), "d MMMM yyyy", { locale: fr })}
            </span>
            {expense.description && (
              <>
                <span className="text-gray-300">•</span>
                <span className="bg-gray-100 px-1.5 py-0.5 rounded italic">
                  {expense.categorie.nom}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-lg">
          {Number(expense.montant).toFixed(2)} €
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
