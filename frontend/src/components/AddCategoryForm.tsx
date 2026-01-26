import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory, updateCategory } from "../services/categoryApi";
import { type Category, type NewCategory } from "../types";
import { FaTimes, FaCheck } from "react-icons/fa";
import DynamicFaIcon from "./DynamicFaIcon";

interface AddCategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingCategory?: Category | null;
}

const colorPalette = [
  "#FEE2E2", // Rose
  "#FFEDD5", // Orange
  "#FEF3C7", // Jaune
  "#DCFCE7", // Vert
  "#DBEAFE", // Bleu
  "#E0E7FF", // Indigo
  "#EDE9FE", // Violet
  "#FAE8FF", // Fuchsia
  "#FCE7F3", // Pink
  "#F3F4F6", // Gris
];

const predefinedIcons = [
  "FaQuestion",
  "FaHome",
  "FaShoppingBag",
  "FaUtensils",
  "FaCar",
  "FaFilm",
  "FaBook",
  "FaHeart",
  "FaGamepad",
  "FaWifi",
  "FaLaptop",
  "FaDumbbell",
  "FaPlane",
  "FaBus",
  "FaTrain",
  "FaSubway",
  "FaTaxi",
  "FaGift",
  "FaCoffee",
  "FaMedkit",
];

export default function AddCategoryForm({
  isOpen,
  onClose,
  editingCategory,
}: AddCategoryFormProps) {
  const [nom, setNom] = useState(editingCategory?.nom || "");
  const [icone, setIcone] = useState(editingCategory?.icone || "FaQuestion");
  const [couleur, setCouleur] = useState(
    editingCategory?.couleur || colorPalette[0],
  );

  const [prevEditingCategory, setPrevEditingCategory] =
    useState(editingCategory);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (editingCategory !== prevEditingCategory || isOpen !== prevIsOpen) {
    setPrevEditingCategory(editingCategory);
    setPrevIsOpen(isOpen);
    setNom(editingCategory?.nom || "");
    setIcone(editingCategory?.icone || "FaQuestion");
    setCouleur(editingCategory?.couleur || colorPalette[0]);
  }

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: NewCategory) => {
      if (editingCategory) {
        return updateCategory(editingCategory.id, data);
      }
      return createCategory(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      onClose();
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } },
    ) => {
      console.error("Erreur catégorie:", error);
      alert("Erreur lors de l'enregistrement de la catégorie.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ nom, icone, couleur });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 overflow-y-auto h-full w-full z-[60] flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {editingCategory ? "Modifier la Catégorie" : "Nouvelle Catégorie"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
              placeholder="Ex: Loisirs, Santé..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Couleur
            </label>
            <div className="flex flex-wrap gap-2">
              {colorPalette.map((c) => (
                <button
                  key={c}
                  type="button"
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center transition-transform hover:scale-110"
                  style={{ backgroundColor: c }}
                  onClick={() => setCouleur(c)}
                >
                  {couleur === c && (
                    <FaCheck size={12} className="text-gray-600" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icône
            </label>
            <div className="grid grid-cols-5 gap-2 max-h-32 overflow-y-auto p-2 border rounded-md">
              {predefinedIcons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  className={`p-2 rounded-md flex justify-center ${icone === icon ? "bg-blue-100 ring-2 ring-blue-500" : "hover:bg-gray-100"}`}
                  onClick={() => setIcone(icon)}
                >
                  <DynamicFaIcon iconName={icon} size={20} />
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            >
              {mutation.isPending ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
