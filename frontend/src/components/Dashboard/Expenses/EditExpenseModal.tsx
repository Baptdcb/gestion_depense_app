import { useEffect, useState } from "react";
import type { Category, Expense } from "../../../types";
import { FaTimes } from "react-icons/fa";
import { useUpdateExpense } from "../../../hooks/useExpenses";

interface EditExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense: Expense | null;
  categories: Category[];
  currentPeriodKey: string;
  viewMode: "month" | "year";
}

export default function EditExpenseModal({
  isOpen,
  onClose,
  expense,
  categories,
  currentPeriodKey,
  viewMode,
}: EditExpenseModalProps) {
  const [montant, setMontant] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [categorieId, setCategorieId] = useState<string>("");
  const [type, setType] = useState<"expense" | "refund">("expense");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (expense) {
      setMontant(String(expense.montant));
      setDescription(expense.description || "");
      setDate(expense.date.slice(0, 10));
      setCategorieId(String(expense.categorieId));
      setType(expense.type);
    }
  }, [expense]);

  const mutation = useUpdateExpense(currentPeriodKey, viewMode);

  if (!isOpen || !expense) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categorieId) return;
    mutation.mutate(
      {
        id: expense.id,
        payload: {
          montant: Number(montant),
          description: description || undefined,
          date,
          categorieId: Number(categorieId),
          type: type,
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex justify-center items-center p-4">
      <div className="bg-linear-surface border border-white/10 p-8 rounded-3xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Modifier la dépense
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white"
          >
            <FaTimes size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type Selection */}
          <div>
            <label className="block text-xs font-medium text-linear-text-secondary uppercase tracking-wider mb-3">
              Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="expense"
                  checked={type === "expense"}
                  onChange={(e) =>
                    setType(e.target.value as "expense" | "refund")
                  }
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="ml-2 text-sm text-white/80">Dépense (−)</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="refund"
                  checked={type === "refund"}
                  onChange={(e) =>
                    setType(e.target.value as "expense" | "refund")
                  }
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="ml-2 text-sm text-white/80">
                  Remboursement (+)
                </span>
              </label>
            </div>
          </div>

          <div>
            <label
              htmlFor="montant-edit"
              className="block text-xs font-medium text-linear-text-secondary uppercase tracking-wider mb-2"
            >
              Montant (€)
            </label>
            <input
              type="number"
              id="montant-edit"
              className="bento-input w-full text-lg font-semibold"
              value={montant}
              onChange={(e) => setMontant(e.target.value)}
              step="0.01"
              required
            />
          </div>
          <div>
            <label
              htmlFor="description-edit"
              className="block text-xs font-medium text-linear-text-secondary uppercase tracking-wider mb-2"
            >
              Description (optionnel)
            </label>
            <input
              type="text"
              id="description-edit"
              className="bento-input w-full"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="date-edit"
                className="block text-xs font-medium text-linear-text-secondary uppercase tracking-wider mb-2"
              >
                Date
              </label>
              <input
                type="date"
                id="date-edit"
                className="bento-input w-full text-sm"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="categorie-edit"
                className="block text-xs font-medium text-linear-text-secondary uppercase tracking-wider mb-2"
              >
                Catégorie
              </label>
              <select
                id="categorie-edit"
                className="bento-input w-full text-sm appearance-none"
                value={categorieId}
                onChange={(e) => setCategorieId(e.target.value)}
                required
              >
                {categories.map((cat) => (
                  <option
                    key={cat.id}
                    value={cat.id}
                    className="bg-linear-surface"
                  >
                    {cat.nom}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="bento-button-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mutation.isPending ? "Mise à jour..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
