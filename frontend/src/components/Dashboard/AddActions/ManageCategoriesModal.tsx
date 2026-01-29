import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../../../services/categoryApi";
import { type Category } from "../../../types";
import { FaTimes, FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import DynamicFaIcon from "../../utils/DynamicFaIcon";
import AddCategoryForm from "./AddCategoryForm";
import { useDeleteCategory } from "../../../hooks/useCategories";
import { toast } from "react-toastify";

interface ManageCategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ManageCategoriesModal({
  isOpen,
  onClose,
}: ManageCategoriesModalProps) {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    enabled: isOpen,
  });

  const deleteCategory = useDeleteCategory();

  const handleDelete = (id: number, name: string) => {
    if (
      window.confirm(
        `Êtes-vous sûr de vouloir supprimer la catégorie "${name}" ?`,
      )
    ) {
      deleteCategory.mutate(id, {
        onSuccess: () => {
          toast.success(`Catégorie "${name}" supprimée avec succès.`);
        },
        onError: () => {
          toast.error(
            name === "Autres"
              ? `La catégorie ${name} ne peut pas être supprimée.`
              : `Erreur lors de la suppression de la catégorie. Vérifiez si ${name} est utilisée par des dépenses.`,
          );
        },
      });
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsAddFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    setIsAddFormOpen(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex justify-center items-center p-4">
      <div className="bg-linear-surface border border-white/10 p-8 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Gérer les Catégories
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white"
          >
            <FaTimes size={18} />
          </button>
        </div>

        <div className="mb-6">
          <button
            onClick={handleAddNew}
            className="bento-button-primary flex items-center space-x-2"
          >
            <FaPlus size={12} />
            <span>Nouvelle Catégorie</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
          {isLoading ? (
            <div className="text-center py-8 text-white/20">Chargement...</div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {categories?.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/2 border border-white/5 hover:border-white/10 transition-all hover:bg-white/4"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center border border-white/10"
                      style={{
                        backgroundColor: `${cat.couleur}20`,
                        color: cat.couleur,
                      }}
                    >
                      <DynamicFaIcon iconName={cat.icone} size={18} />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{cat.nom}</h3>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
                      title="Modifier"
                    >
                      <FaEdit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id, cat.nom)}
                      className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all"
                      title="Supprimer"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
              ))}
              {categories?.length === 0 && (
                <div className="text-center text-white/40 py-12">
                  Aucune catégorie trouvée.
                </div>
              )}
            </div>
          )}
        </div>

        <AddCategoryForm
          isOpen={isAddFormOpen}
          onClose={() => setIsAddFormOpen(false)}
          editingCategory={editingCategory}
        />
      </div>
    </div>
  );
}
