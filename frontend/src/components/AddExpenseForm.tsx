import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createExpense } from "../services/expenseApi";
import { type Category, type NewExpense } from "../types";
import { FaTimes } from "react-icons/fa";
import { format } from "date-fns";

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
  const [categorieId, setCategorieId] = useState<string>(""); // Storing as string from select

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newExpense: NewExpense) => createExpense(newExpense),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses", currentMonth] });
      queryClient.invalidateQueries({ queryKey: ["summary", currentMonth] });
      setMontant("");
      setDescription("");
      setDate(format(new Date(), "yyyy-MM-dd"));
      setCategorieId("");
      onClose();
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } },
    ) => {
      console.error("Erreur lors de l'ajout de la dépense:", error);
      alert(
        "Erreur lors de l'ajout de la dépense: " +
          (error.response?.data?.message || error.message),
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categorieId) {
      alert("Veuillez sélectionner une catégorie.");
      return;
    }
    mutation.mutate({
      montant: parseFloat(montant),
      description: description || undefined,
      date: date,
      categorieId: parseInt(categorieId),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Ajouter une Nouvelle Dépense</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="montant"
              className="block text-sm font-medium text-gray-700"
            >
              Montant (€)
            </label>
            <input
              type="number"
              id="montant"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={montant}
              onChange={(e) => setMontant(e.target.value)}
              step="0.01"
              required
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description (optionnel)
            </label>
            <input
              type="text"
              id="description"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700"
            >
              Date
            </label>
            <input
              type="date"
              id="date"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="categorie"
              className="block text-sm font-medium text-gray-700"
            >
              Catégorie
            </label>
            <select
              id="categorie"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={categorieId}
              onChange={(e) => setCategorieId(e.target.value)}
              required
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nom}
                </option>
              ))}
            </select>
            {categories.length === 0 && (
              <p className="text-red-500 text-sm mt-1">
                Aucune catégorie disponible. Veuillez en ajouter une d'abord.
              </p>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Ajout en cours..." : "Ajouter la dépense"}
            </button>
          </div>
          {mutation.isError && (
            <p className="text-red-500 text-sm mt-2">
              {mutation.error.message || "Une erreur est survenue."}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
