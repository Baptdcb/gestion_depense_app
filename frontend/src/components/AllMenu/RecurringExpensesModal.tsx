import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../../services/categoryApi";
import type { Category, RecurringExpense } from "../../types";
import { FaEdit, FaTimes, FaTrash } from "react-icons/fa";
import DynamicFaIcon from "../utils/DynamicFaIcon";
import { format } from "date-fns";
import {
  useRecurringExpensesList,
  useCreateRecurringExpense,
  useUpdateRecurringExpense,
  useDeleteRecurringExpense,
} from "../../hooks/useRecurringExpenses";
import { useToast } from "../../hooks/useToast";

interface RecurringExpensesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormState {
  montant: string;
  description: string;
  categorieId: string;
  active: boolean;
  startDate: string;
}

const emptyForm = (defaultDate: string): FormState => ({
  montant: "",
  description: "",
  categorieId: "",
  active: true,
  startDate: defaultDate,
});

const getFormFromEditing = (
  editing: RecurringExpense | null,
  defaultDate: string,
): FormState => {
  if (editing) {
    return {
      montant: String(editing.montant),
      description: editing.description || "",
      categorieId: String(editing.categorieId),
      active: editing.active,
      startDate: editing.startDate
        ? format(new Date(editing.startDate), "yyyy-MM-01")
        : defaultDate,
    };
  }
  return emptyForm(defaultDate);
};

export default function RecurringExpensesModal({
  isOpen,
  onClose,
}: RecurringExpensesModalProps) {
  const [editing, setEditing] = useState<RecurringExpense | null>(null);
  const toast = useToast();

  const { data: recurring, isLoading } = useRecurringExpensesList();
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    enabled: isOpen,
  });

  const createMutation = useCreateRecurringExpense();
  const updateMutation = useUpdateRecurringExpense();
  const deleteMutation = useDeleteRecurringExpense();

  const defaultDate = useMemo(() => format(new Date(), "yyyy-MM-01"), []);
  const [form, setForm] = useState<FormState>(
    getFormFromEditing(editing, defaultDate),
  );

  useEffect(() => {
    setForm(getFormFromEditing(editing, defaultDate));
  }, [editing, defaultDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.categorieId) {
      toast.error("✗ Veuillez sélectionner une catégorie");
      return;
    }

    const payload = {
      montant: Number(form.montant),
      description: form.description || undefined,
      categorieId: Number(form.categorieId),
      active: form.active,
      startDate: form.startDate,
    };

    if (editing) {
      updateMutation.mutate({
        id: editing.id,
        data: payload,
      });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleEdit = (item: RecurringExpense) => {
    setEditing(item);
  };

  const handleDelete = (item: RecurringExpense) => {
    if (
      window.confirm(
        `Supprimer la dépense récurrente "${item.description || item.categorie.nom}" ?`,
      )
    ) {
      deleteMutation.mutate(item.id);
      setEditing(null);
      setForm(emptyForm(defaultDate));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex justify-center items-center p-4">
      <div className="bg-linear-surface border border-white/10 p-8 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Dépenses récurrentes
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white"
          >
            <FaTimes size={18} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
        >
          <div>
            <label className="block text-xs font-medium text-linear-text-secondary uppercase tracking-wider mb-2">
              Montant (€)
            </label>
            <input
              type="number"
              className="bento-input w-full text-lg font-semibold"
              value={form.montant}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, montant: e.target.value }))
              }
              step="0.01"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-linear-text-secondary uppercase tracking-wider mb-2">
              Catégorie
            </label>
            <select
              className="bento-input w-full text-sm appearance-none"
              value={form.categorieId}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, categorieId: e.target.value }))
              }
              required
            >
              <option value="" className="bg-linear-surface">
                Sélectionner
              </option>
              {categories?.map((cat: Category) => (
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
          <div>
            <label className="block text-xs font-medium text-linear-text-secondary uppercase tracking-wider mb-2">
              Description (optionnel)
            </label>
            <input
              type="text"
              className="bento-input w-full"
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-linear-text-secondary uppercase tracking-wider mb-2">
              Début (1er du mois)
            </label>
            <input
              type="date"
              className="bento-input w-full text-sm"
              value={form.startDate}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, startDate: e.target.value }))
              }
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="active"
              type="checkbox"
              checked={form.active}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, active: e.target.checked }))
              }
            />
            <label htmlFor="active" className="text-sm text-white/70">
              Actif
            </label>
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="bento-button-primary w-full"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {editing ? "Mettre à jour" : "Créer"}
            </button>
          </div>
        </form>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
          {isLoading ? (
            <div className="text-center py-8 text-white/20">Chargement...</div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {recurring?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/2 border border-white/5 hover:border-white/10 transition-all hover:bg-white/4"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center border border-white/10"
                      style={{
                        backgroundColor: `${item.categorie.couleur}20`,
                        color: item.categorie.couleur,
                      }}
                    >
                      <DynamicFaIcon
                        iconName={item.categorie.icone}
                        size={18}
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">
                        {item.description || item.categorie.nom}
                      </h3>
                      <p className="text-xs text-white/50">
                        {Number(item.montant).toFixed(2)} € • début{" "}
                        {format(new Date(item.startDate), "MMMM yyyy")}
                        {item.active ? "" : " • inactif"}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
                      title="Modifier"
                    >
                      <FaEdit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all"
                      title="Supprimer"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
              ))}
              {recurring?.length === 0 && (
                <div className="text-center text-white/40 py-12">
                  Aucune dépense récurrente.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
