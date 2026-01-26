import api from "./api";
import { type Budget, type NewBudget } from "../types";

export const getBudget = async (
  month: string,
): Promise<{ budget: Budget | null; isDefault: boolean }> => {
  const { data } = await api.get(`/budgets?month=${month}`);
  return data;
};

export const saveBudget = async (budget: NewBudget): Promise<Budget> => {
  const { data } = await api.post("/budgets", budget);
  return data;
};
