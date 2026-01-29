import api from "./api";

export interface CategoryReport {
  categoryId: number;
  name: string;
  color: string;
  icon: string;
  spent: number;
  limit: number;
  diff: number;
}

export interface MonthlyHistoryItem {
  month: string;
  globalLimit: number;
  totalSpent: number;
  difference: number;
  runningBalance: number;
  categories: CategoryReport[];
}

export const getHistory = async (): Promise<MonthlyHistoryItem[]> => {
  const { data } = await api.get("/reports/history");
  return data;
};
