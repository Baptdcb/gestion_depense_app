import { useState, useEffect } from "react";
import { getSetting, updateSetting } from "../services/settingApi";
import { FaTimes } from "react-icons/fa";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [defaultBudget, setDefaultBudget] = useState("");
  const [isLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      getSetting("defaultBudget").then((val) => {
        setDefaultBudget(val || "");
      });
    }
  }, [isOpen]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSetting("defaultBudget", defaultBudget);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex justify-center items-center p-4">
      <div className="bg-linear-surface border border-white/10 p-8 rounded-3xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Paramètres
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white"
          >
            <FaTimes size={18} />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/70">
              Budget Global par Défaut (€)
            </label>
            <input
              type="number"
              value={defaultBudget}
              onChange={(e) => setDefaultBudget(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-hidden focus:ring-2 focus:ring-linear-accent focus:border-transparent transition-all"
              placeholder="0.00"
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="bento-button-primary px-8 py-3 w-full"
              disabled={isLoading}
            >
              {isLoading ? "Chargement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
