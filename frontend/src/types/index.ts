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
  type: "expense" | "refund"; // New field
  categorieId: number;
  createdAt: string; // ISO date string
  recurringExpenseId?: number | null;
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
  type?: "expense" | "refund"; // New field
}

export interface RecurringExpense {
  id: number;
  montant: number;
  description: string | null;
  categorieId: number;
  active: boolean;
  startDate: string;
  createdAt: string;
  categorie: Category;
}

export interface NewRecurringExpense {
  montant: number;
  description?: string;
  categorieId: number;
  active?: boolean;
  startDate?: string;
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
