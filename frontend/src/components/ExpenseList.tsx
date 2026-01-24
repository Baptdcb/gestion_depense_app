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
        <div className="text-2xl text-gray-600">
          <DynamicFaIcon iconName={expense.categorie.icone} />
        </div>
        <div>
          <p className="font-semibold">
            {expense.description || expense.categorie.nom}
          </p>
          <p className="text-sm text-gray-500">
            {format(new Date(expense.date), "d MMMM yyyy", { locale: fr })}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-lg">{expense.montant.toFixed(2)} €</p>
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
