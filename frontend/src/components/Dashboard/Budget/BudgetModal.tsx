import { useState } from "react";
import { getSetting } from "../../../services/settingApi";
import { type Category, type Budget } from "../../../types";
import { FaTimes } from "react-icons/fa";
import { useCreateBudget, useUpdateBudget } from "../../../hooks/useBudget";
import { useToast } from "../../../hooks/useToast";
import DynamicFaIcon from "../../utils/DynamicFaIcon";
import { Switch } from "../../ui/switch";
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
}: BudgetModalProps) {
  const [globalLimit, setGlobalLimit] = useState<string>("");
  const [categoryLimits, setCategoryLimits] = useState<{
    [key: number]: string;
  }>({});
  const [disabledCategories, setDisabledCategories] = useState<Set<number>>(
    new Set(),
  );

  const toast = useToast();
  const createMutation = useCreateBudget(currentMonth);
  const updateMutation = useUpdateBudget(currentMonth);

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
        const disabled = new Set<number>();
        initialBudget.categoryBudgets.forEach((cb) => {
          newLimits[cb.categoryId] = cb.limit || "0";
          if (cb.isDisabled) {
            disabled.add(cb.categoryId);
          }
        });
        setCategoryLimits(newLimits);
        setDisabledCategories(disabled);
      } else {
        setGlobalLimit("");
        setCategoryLimits({});
        setDisabledCategories(new Set());
      }
    }
  }

  const handleCategoryLimitChange = (categoryId: number, value: string) => {
    setCategoryLimits((prev) => ({ ...prev, [categoryId]: value }));
  };

  const toggleCategoryDisabled = (categoryId: number) => {
    setDisabledCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
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

    const globalLimitValue = parseFloat(globalLimit) || 0;
    if (globalLimitValue <= 0) {
      toast.error("✗ Veuillez entrer un budget global valide");
      return;
    }

    // Prepare payload
    const payload = {
      month: currentMonth,
      globalLimit: globalLimitValue,
      categoryBudgets: Object.entries(categoryLimits).map(([catId, limit]) => ({
        categoryId: parseInt(catId),
        limit: parseFloat(limit) || 0,
        isDisabled: disabledCategories.has(parseInt(catId)),
      })),
    };

    if (initialBudget) {
      updateMutation.mutate({
        id: initialBudget.id,
        data: payload,
      });
    } else {
      createMutation.mutate(payload);
    }

    onClose();
  };

  // Calculate sum of categories for helper display (only enabled categories)
  const categoriesTotal = Object.entries(categoryLimits).reduce(
    (acc, [catId, val]) => {
      const categoryId = parseInt(catId);
      return !disabledCategories.has(categoryId)
        ? acc + (parseFloat(val) || 0)
        : acc;
    },
    0,
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm  flex justify-center items-center p-4">
      <div className="bg-linear-surface border border-white/10 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header - Fixed */}
        <div className="flex justify-between items-center p-6 border-b border-white/5">
          <div>
            <h2 className="text-xl font-bold text-white">
              Configuration du Budget
            </h2>
            <p className="text-sm text-gray-400">Mois de {currentMonth}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <form id="budget-form" onSubmit={handleSubmit} className="space-y-8">
            {/* Global Section */}
            <div className="bg-white/5 rounded-xl p-5 border border-white/5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <label className="text-sm font-medium text-white/90">
                  Objectif Global Mensuel
                </label>
                <button
                  type="button"
                  onClick={loadDefault}
                  className="text-xs font-medium text-linear-accent hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-linear-accent/10 hover:bg-linear-accent/20 border border-linear-accent/20"
                >
                  Charger défaut
                </button>
              </div>

              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  className="block w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-2xl font-bold text-white placeholder-gray-600 focus:ring-2 focus:ring-linear-accent/50 focus:border-linear-accent transition-all outline-none"
                  value={globalLimit}
                  onChange={(e) => setGlobalLimit(e.target.value)}
                  placeholder="0.00"
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  €
                </span>
              </div>

              <div className="mt-3 flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      categoriesTotal > (parseFloat(globalLimit) || 0)
                        ? "bg-red-500"
                        : "bg-green-500"
                    }`}
                  />
                  <span className="text-gray-400">Total alloué:</span>
                  <span
                    className={
                      categoriesTotal > (parseFloat(globalLimit) || 0)
                        ? "text-red-400 font-bold"
                        : "text-white font-medium"
                    }
                  >
                    {categoriesTotal.toFixed(2)} €
                  </span>
                </div>
                <span className="text-gray-500">
                  {categoriesTotal > (parseFloat(globalLimit) || 0)
                    ? "⚠️ Dépassement"
                    : `Reste: ${Math.max(
                        0,
                        (parseFloat(globalLimit) || 0) - categoriesTotal,
                      ).toFixed(2)} €`}
                </span>
              </div>
            </div>

            {/* Categories Section */}
            <div>
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-md font-semibold text-white/90">
                  Allocations par catégorie
                </h3>
                <span className="text-xs text-gray-500">
                  {categories.length - disabledCategories.size} catégories
                  actives
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat) => {
                  const isDisabled = disabledCategories.has(cat.id);
                  return (
                    <div
                      key={cat.id}
                      className={`group relative p-4 rounded-xl border transition-all duration-200 ${
                        isDisabled
                          ? "border-white/5 "
                          : "border-white/10 bg-white/5 hover:border-linear-accent/30 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div
                          className={`flex items-center gap-2 ${isDisabled ? "opacity-40" : "opacity-100"}`}
                        >
                          <div
                            className="p-1.5 rounded-lg border border-white/5"
                            style={{
                              backgroundColor: `${cat.couleur}15`,
                              color: cat.couleur,
                            }}
                          >
                            <DynamicFaIcon iconName={cat.icone} size={14} />
                          </div>
                          <span className="text-sm font-medium text-white truncate ">
                            {cat.nom}
                          </span>
                        </div>

                        {/* Modern Switch from Radix UI */}
                        <Switch
                          checked={!isDisabled}
                          onCheckedChange={() => toggleCategoryDisabled(cat.id)}
                        />
                      </div>

                      <div className="relative">
                        <input
                          type="number"
                          step="0.01"
                          disabled={isDisabled}
                          className={`block w-full rounded-lg px-3 py-2 text-sm font-medium transition-all outline-none ${
                            isDisabled
                              ? "bg-transparent border border-transparent text-gray-600 placeholder-gray-700 cursor-not-allowed"
                              : "bg-black/20 border border-white/10 text-white placeholder-gray-600 focus:border-linear-accent/50 focus:bg-black/30"
                          }`}
                          value={categoryLimits[cat.id] || ""}
                          onChange={(e) =>
                            handleCategoryLimitChange(cat.id, e.target.value)
                          }
                          placeholder={isDisabled ? "Désactivé" : "0.00"}
                        />
                        {!isDisabled && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">
                            €
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </form>
        </div>

        {/* Footer - Fixed */}
        <div className="p-6 border-t border-white/5 bg-linear-surface/50 backdrop-blur-xl rounded-b-2xl flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all outline-none focus:ring-2 focus:ring-white/10"
          >
            Annuler
          </button>
          <button
            type="submit"
            form="budget-form"
            className="flex-1 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-linear-accent hover:opacity-90 transition-all shadow-lg shadow-linear-accent/20 outline-none focus:ring-2 focus:ring-linear-accent/50 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {createMutation.isPending || updateMutation.isPending
              ? "Enregistrement..."
              : "Enregistrer le Budget"}
          </button>
        </div>
      </div>
    </div>
  );
}
