import { type Expense } from "../../../types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import DynamicFaIcon from "../../utils/DynamicFaIcon";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteExpense } from "../../../services/expenseApi";

interface ExpenseListItemProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}

function ExpenseListItem({ expense, onEdit, onDelete }: ExpenseListItemProps) {
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
            {expense.recurringExpenseId && (
              <>
                <span className="w-1 h-1 rounded-full bg-white/10" />
                <span className="px-2 py-0.5 rounded-full bg-linear-accent/10 border border-linear-accent/20 text-[10px] uppercase tracking-wider text-linear-accent">
                  Récurrente
                </span>
              </>
            )}
            {expense.type === "refund" && (
              <>
                <span className="w-1 h-1 rounded-full bg-white/10" />
                <span className="px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-[10px] uppercase tracking-wider text-green-400">
                  Remboursement
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="text-right">
        <p
          className={`font-semibold text-lg ${expense.type === "refund" ? "text-green-400" : "text-white"}`}
        >
          {expense.type === "refund" ? "+" : ""}
          {Number(expense.montant).toLocaleString("fr-FR", {
            minimumFractionDigits: 2,
          })}{" "}
          <span className="text-xs text-linear-text-secondary ml-0.5">€</span>
        </p>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {expense.type === "refund" && (
            <span className="text-[10px] text-green-400 font-medium uppercase">
              Remboursé
            </span>
          )}
          <button
            onClick={() => onEdit(expense)}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
            title="Modifier"
          >
            <FaEdit size={12} />
          </button>
          <button
            onClick={() => onDelete(expense)}
            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all"
            title="Supprimer"
          >
            <FaTrash size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

interface ExpenseListProps {
  expenses: Expense[];
  currentPeriodKey: string;
  viewMode: "month" | "year";
  onEditExpense?: (expense: Expense) => void;
}

export default function ExpenseList({
  expenses,
  currentPeriodKey,
  viewMode,
  onEditExpense,
}: ExpenseListProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["expenses", currentPeriodKey, viewMode],
      });
      queryClient.invalidateQueries({
        queryKey: ["summary", currentPeriodKey, viewMode],
      });
    },
  });

  const handleEdit = (expense: Expense) => {
    onEditExpense?.(expense);
  };

  const handleDelete = (expense: Expense) => {
    if (window.confirm("Supprimer cette dépense ?")) {
      deleteMutation.mutate(expense.id);
    }
  };

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
        <ExpenseListItem
          key={expense.id}
          expense={expense}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
