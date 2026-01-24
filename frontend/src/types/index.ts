export interface Category {
  id: number;
  nom: string;
  icone: string;
}

export interface Expense {
  id: number;
  montant: number;
  description: string | null;
  date: string; // ISO date string
  mois: string; // YYYY-MM
  categorieId: number;
  createdAt: string; // ISO date string
  categorie: Category;
}

export interface MonthlySummary {
  categorie: Category;
  total: number | null;
}

// For creating a new expense
export interface NewExpense {
    montant: number;
    description?: string;
    date: string; // ISO date string
    categorieId: number;
}

// For creating a new category
export interface NewCategory {
    nom: string;
    icone: string;
}
