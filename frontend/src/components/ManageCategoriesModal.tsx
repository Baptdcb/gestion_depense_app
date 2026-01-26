import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { getCategories, deleteCategory } from "../services/categoryApi";
import { type Category } from "../types";
import { FaTimes, FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import DynamicFaIcon from "./DynamicFaIcon";
import AddCategoryForm from "./AddCategoryForm";

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
  const queryClient = useQueryClient();

  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    enabled: isOpen,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: (error) => {
      console.error("Erreur suppression catégorie:", error);
      alert(
        "Erreur lors de la suppression. Vérifiez si cette catégorie est utilisée par des dépenses.",
      );
    },
  });

  const handleDelete = (id: number, name: string) => {
    if (
      window.confirm(
        `Êtes-vous sûr de vouloir supprimer la catégorie "${name}" ?`,
      )
    ) {
      deleteMutation.mutate(id);
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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Gérer les Catégories</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="mb-4">
          <button
            onClick={handleAddNew}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            <FaPlus size={14} />
            <span>Nouvelle Catégorie</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-4">Chargement...</div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {categories?.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center border"
                      style={{ backgroundColor: cat.couleur }}
                    >
                      <DynamicFaIcon iconName={cat.icone} size={18} />
                    </div>
                    <span className="font-medium text-gray-800">{cat.nom}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition"
                      title="Modifier"
                    >
                      <FaEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id, cat.nom)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full transition"
                      title="Supprimer"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {categories?.length === 0 && (
                <div className="text-center text-gray-500 py-8">
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
