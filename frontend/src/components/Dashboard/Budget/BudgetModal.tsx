import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveBudget } from "../../../services/budgetApi";
import { getSetting } from "../../../services/settingApi";
import { type Category, type Budget } from "../../../types";
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

  const loadDefault = async () => {
    try {
      const def = await getSetting("defaultBudget");
      if (def) setGlobalLimit(def);
    } catch (e) {
      console.error("Failed to load default setting", e);
    }
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm overflow-y-auto h-full w-full z-100 flex justify-center items-center p-4">
      <div className="bg-linear-surface border border-white/10 p-8 rounded-3xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold">
            Définir le Budget pour {currentMonth}{" "}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {isDefault && initialBudget && (
          <p className="text-sm text-yellow-400 mb-6">
            Vous modifiez le budget par défaut. Ce budget sera utilisé pour les
            mois sans budget spécifique.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className=" p-4 rounded-lg border-3 border-linear-accent ">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-white">
                Budget Global Cible (€)
              </label>
              <button
                type="button"
                onClick={loadDefault}
                className="text-xs text-linear-accent hover:text-white transition-colors"
              >
                Utiliser Défaut
              </button>
            </div>
            <input
              type="number"
              step="0.01"
              className="block w-full border border-white/10 rounded-md shadow-sm p-2 text-lg font-bold text-linear-accent"
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
                    : "text-gray-400 "
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

          <div className="border-t border-white/10 pt-4">
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
                    className="block w-full border border-white/10 rounded-md shadow-sm p-2 text-sm"
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

          <div className="flex flex-col gap-3 pt-6 border-t border-white/10">
            <button
              type="submit"
              className="bento-button-primary w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Sauvegarde..." : "Enregistrer le Budget"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bento-button-secondary w-full"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
