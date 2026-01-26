export interface Category {
  id: number;
  nom: string;
  icone: string;
  couleur: string;
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
  total: number | string | null;
}

export interface NewExpense {
  montant: number;
  description?: string;
  date: string; // YYYY-MM-DD
  categorieId: number;
}

export interface CategoryBudget {
  id: number;
  monthlyBudgetId: number;
  categoryId: number;
  limit: string;
  category: Category;
}

export interface Budget {
  id: number;
  month: string;
  globalLimit: string;
  categoryBudgets: CategoryBudget[];
  createdAt: string;
  updatedAt: string;
}

export interface NewBudget {
  month: string;
  globalLimit: number;
  categoryBudgets: {
    categoryId: number;
    limit: number;
  }[];
}

export interface NewCategory {
  nom: string;
  icone: string;
  couleur: string;
}
