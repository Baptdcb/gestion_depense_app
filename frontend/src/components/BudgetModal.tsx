import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveBudget } from "../services/budgetApi";
import { type Category, type Budget } from "../types";
import { FaTimes } from "react-icons/fa";

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  currentMonth: string;
  initialBudget: Budget | null;
  isDefault: boolean;
}

export default function BudgetModal({
  isOpen,
  onClose,
  categories,
  currentMonth,
  initialBudget,
  isDefault,
}: BudgetModalProps) {
  const [globalLimit, setGlobalLimit] = useState<string>("");
  const [categoryLimits, setCategoryLimits] = useState<{
    [key: number]: string;
  }>({});

  const queryClient = useQueryClient();

  // Synchronize state with props during render to avoid cascading renders in useEffect
  const [prevProps, setPrevProps] = useState({ isOpen, initialBudget });
  if (
    prevProps.isOpen !== isOpen ||
    prevProps.initialBudget !== initialBudget
  ) {
    setPrevProps({ isOpen, initialBudget });
    if (isOpen) {
      if (initialBudget) {
        setGlobalLimit(initialBudget.globalLimit || "0"); // Ensure string
        const newLimits: { [key: number]: string } = {};
        initialBudget.categoryBudgets.forEach((cb) => {
          newLimits[cb.categoryId] = cb.limit || "0";
        });
        setCategoryLimits(newLimits);
      } else {
        setGlobalLimit("");
        setCategoryLimits({});
      }
    }
  }

  const mutation = useMutation({
    mutationFn: (data: {
      month: string;
      globalLimit: number;
      categoryBudgets: { categoryId: number; limit: number }[];
    }) => saveBudget(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget", currentMonth] });
      onClose();
    },
    onError: (error) => {
      console.error("Erreur sauvegarde budget:", error);
      alert("Erreur lors de la sauvegarde du budget");
    },
  });

  const handleCategoryLimitChange = (categoryId: number, value: string) => {
    setCategoryLimits((prev) => ({ ...prev, [categoryId]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare payload
    const payload = {
      month: currentMonth,
      globalLimit: parseFloat(globalLimit) || 0,
      categoryBudgets: Object.entries(categoryLimits).map(([catId, limit]) => ({
        categoryId: parseInt(catId),
        limit: parseFloat(limit) || 0,
      })),
    };

    mutation.mutate(payload);
  };

  // Calculate sum of categories for helper display
  const categoriesTotal = Object.values(categoryLimits).reduce(
    (acc, val) => acc + (parseFloat(val) || 0),
    0,
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            Définir le Budget pour {currentMonth}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {isDefault && initialBudget && (
          <div className="bg-blue-50 text-blue-700 p-3 rounded mb-4 text-sm">
            Les valeurs ont été pré-remplies avec le budget du mois précédent.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Budget Global Cible (€)
            </label>
            <input
              type="number"
              step="0.01"
              className="block w-full border border-gray-300 rounded-md shadow-sm p-2 text-lg font-bold text-blue-600"
              value={globalLimit}
              onChange={(e) => setGlobalLimit(e.target.value)}
              placeholder="Ex: 1500"
              required
            />
            <div className="mt-2 text-xs flex justify-between">
              <span
                className={
                  categoriesTotal > (parseFloat(globalLimit) || 0)
                    ? "text-red-600 font-bold"
                    : "text-gray-500"
                }
              >
                Total des catégories: {categoriesTotal.toFixed(2)} €
              </span>
              <span className="text-gray-400">
                {categoriesTotal > (parseFloat(globalLimit) || 0)
                  ? "Attention: dépasse la cible !"
                  : "Reste à allouer: " +
                    Math.max(
                      0,
                      (parseFloat(globalLimit) || 0) - categoriesTotal,
                    ).toFixed(2) +
                    " €"}
              </span>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-md font-semibold mb-3">
              Ventilation par Catégorie
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map((cat) => (
                <div key={cat.id}>
                  <label className="block text-xs font-medium text-gray-600 mb-1 truncate">
                    {cat.nom}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                    value={categoryLimits[cat.id] || ""}
                    onChange={(e) =>
                      handleCategoryLimitChange(cat.id, e.target.value)
                    }
                    placeholder="0.00"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Sauvegarde..." : "Enregistrer le Budget"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
