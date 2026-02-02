import { useState } from "react";
import { type Category } from "../../../types";
import { FaTimes } from "react-icons/fa";
import { format } from "date-fns";
import { useCreateExpense } from "../../../hooks/useExpenses";
import { useDisabledCategories } from "../../../hooks/useBudget";

interface AddExpenseFormProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  currentMonth: string; // YYYY-MM
}

export default function AddExpenseForm({
  isOpen,
  onClose,
  categories,
  currentMonth,
}: AddExpenseFormProps) {
  const [montant, setMontant] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [categorieId, setCategorieId] = useState<string>("");
  const [type, setType] = useState<"expense" | "refund">("expense");

  const disabledCategoryIds = useDisabledCategories(currentMonth);
  const mutation = useCreateExpense(currentMonth, "month");

  const availableCategories = categories.filter(
    (cat) => !disabledCategoryIds.includes(cat.id),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categorieId) {
      return;
    }
    mutation.mutate(
      {
        montant: parseFloat(montant),
        description: description || undefined,
        date: date,
        categorieId: parseInt(categorieId),
        type: type,
      },
      {
        onSuccess: () => {
          setMontant("");
          setDescription("");
          setDate(format(new Date(), "yyyy-MM-dd"));
          setCategorieId("");
          setType("expense");
          onClose();
        },
      },
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm overflow-y-auto h-full w-full z-100 flex justify-center items-center p-4">
      <div className="bg-linear-surface border border-white/10 p-8 rounded-3xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent">
            {type === "expense" ? "Nouvelle Dépense" : "Nouveau Remboursement"}
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
              htmlFor="montant"
              className="block text-xs font-medium text-linear-text-secondary uppercase tracking-wider mb-2"
            >
              Montant (€)
            </label>
            <input
              type="number"
              id="montant"
              className="bento-input w-full text-lg font-semibold"
              placeholder="0.00"
              value={montant}
              onChange={(e) => setMontant(e.target.value)}
              step="0.01"
              required
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-xs font-medium text-linear-text-secondary uppercase tracking-wider mb-2"
            >
              Description (optionnel)
            </label>
            <input
              type="text"
              id="description"
              className="bento-input w-full"
              placeholder="Ex: Courses"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="date"
                className="block text-xs font-medium text-linear-text-secondary uppercase tracking-wider mb-2"
              >
                Date
              </label>
              <input
                type="date"
                id="date"
                className="bento-input w-full text-sm"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="categorie"
                className="block text-xs font-medium text-linear-text-secondary uppercase tracking-wider mb-2"
              >
                Catégorie
              </label>
              <select
                id="categorie"
                className="bento-input w-full text-sm appearance-none"
                value={categorieId}
                onChange={(e) => setCategorieId(e.target.value)}
                required
              >
                <option value="" className="bg-linear-surface">
                  Sélectionner
                </option>
                {availableCategories.map((cat) => (
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
              {mutation.isPending
                ? type === "expense"
                  ? "Ajout de la dépense..."
                  : "Ajout du remboursement..."
                : type === "expense"
                  ? "Confirmer la dépense"
                  : "Confirmer le remboursement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
