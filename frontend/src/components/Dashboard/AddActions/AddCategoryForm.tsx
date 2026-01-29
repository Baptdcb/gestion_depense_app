import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory, updateCategory } from "../../../services/categoryApi";
import { type Category, type NewCategory } from "../../../types";
import { FaTimes, FaCheck } from "react-icons/fa";
import DynamicFaIcon from "../../utils/DynamicFaIcon";

interface AddCategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingCategory?: Category | null;
}

const colorPalette = [
  "#5e6ad2", // Linear Blue
  "#ff4444", // Red
  "#ffbb33", // Orange
  "#00C851", // Green
  "#33b5e5", // Light Blue
  "#aa66cc", // Purple
  "#2E2E2E", // Dark Gray
  "#ff8800", // Dark Orange
  "#669900", // Dark Green
  "#CC0000", // Dark Red
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
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm overflow-y-auto h-full w-full z-100 flex justify-center items-center p-4">
      <div className="bg-linear-surface border border-white/10 p-8 rounded-3xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent">
            {editingCategory ? "Modifier la Catégorie" : "Nouvelle Catégorie"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white"
          >
            <FaTimes size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-medium text-linear-text-secondary uppercase tracking-wider mb-2">
              Nom de la catégorie
            </label>
            <input
              type="text"
              className="bento-input w-full"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
              placeholder="Ex: Loisirs, Santé..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-linear-text-secondary uppercase tracking-wider mb-2">
              Palette de couleur
            </label>
            <div className="flex flex-wrap gap-3">
              {colorPalette.map((c) => (
                <button
                  key={c}
                  type="button"
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 border-2"
                  style={{
                    backgroundColor: c,
                    borderColor: couleur === c ? "white" : "transparent",
                    boxShadow: couleur === c ? `0 0 12px ${c}88` : "none",
                  }}
                  onClick={() => setCouleur(c)}
                >
                  {couleur === c && (
                    <FaCheck size={10} className="text-white drop-shadow-md" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-linear-text-secondary uppercase tracking-wider mb-2">
              Icône représentative
            </label>
            <div className="grid grid-cols-5 gap-2 max-h-40 overflow-y-auto p-3 bg-white/2 border border-white/5 rounded-xl scrollbar-hide">
              {predefinedIcons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  className={`p-3 rounded-xl flex justify-center transition-all ${
                    icone === icon
                      ? "bg-linear-accent text-white shadow-lg shadow-linear-accent/20"
                      : "text-white/40 hover:bg-white/5 hover:text-white"
                  }`}
                  onClick={() => setIcone(icon)}
                >
                  <DynamicFaIcon iconName={icon} size={18} />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-6">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="bento-button-primary w-full"
            >
              {mutation.isPending
                ? "Enregistrement..."
                : editingCategory
                  ? "Mettre à jour"
                  : "Créer la catégorie"}
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
