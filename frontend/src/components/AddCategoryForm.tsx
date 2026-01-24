import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCategory } from '../services/categoryApi';
import { NewCategory } from '../types';
import { FaPlus, FaTimes, FaQuestion, FaHome, FaShoppingBag, FaUtensils, FaCar, FaFilm, FaBook, FaHeart, FaGamepad, FaWifi } from 'react-icons/fa'; // Example icons
import DynamicFaIcon from './DynamicFaIcon';

interface AddCategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
}

// A small predefined list of popular icons for selection
const predefinedIcons = [
  'FaQuestion', 'FaHome', 'FaShoppingBag', 'FaUtensils', 'FaCar', 'FaFilm', 'FaBook', 'FaHeart', 'FaGamepad', 'FaWifi', 'FaLaptop', 'FaDumbbell', 'FaPlane', 'FaBus', 'FaTrain', 'FaSubway', 'FaTaxi'
];

export default function AddCategoryForm({ isOpen, onClose }: AddCategoryFormProps) {
  const [nom, setNom] = useState('');
  const [icone, setIcone] = useState('FaQuestion'); // Default icon

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newCategory: NewCategory) => createCategory(newCategory),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setNom('');
      setIcone('FaQuestion');
      onClose();
    },
    onError: (error: any) => {
      console.error("Erreur lors de l'ajout de la catégorie:", error);
      alert("Erreur lors de l'ajout de la catégorie: " + (error.response?.data?.message || error.message));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ nom, icone });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Ajouter une Nouvelle Catégorie</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">
              Nom de la catégorie
            </label>
            <input
              type="text"
              id="categoryName"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="categoryIcon" className="block text-sm font-medium text-gray-700 mb-2">
              Sélectionner une icône
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {predefinedIcons.map((iconName) => (
                <button
                  type="button"
                  key={iconName}
                  onClick={() => setIcone(iconName)}
                  className={`p-2 border rounded-md ${icone === iconName ? 'bg-blue-200 border-blue-500' : 'bg-gray-100 border-gray-300'} hover:bg-blue-100 transition-colors`}
                >
                  <DynamicFaIcon iconName={iconName} size={24} />
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500">Icône choisie: <DynamicFaIcon iconName={icone} size={18} className="inline-block align-middle" /> {icone}</p>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Ajout en cours...' : 'Ajouter la catégorie'}
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