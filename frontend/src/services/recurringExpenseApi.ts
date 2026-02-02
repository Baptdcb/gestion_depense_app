import api from "./api";
import type { RecurringExpense, NewRecurringExpense } from "../types";

export const getRecurringExpenses = async (): Promise<RecurringExpense[]> => {
  const { data } = await api.get("/recurring-expenses");
  return data;
};

export const createRecurringExpense = async (
  payload: NewRecurringExpense,
): Promise<RecurringExpense> => {
  const { data } = await api.post("/recurring-expenses", payload);
  return data;
};

export const updateRecurringExpense = async (
  id: number,
  payload: Partial<NewRecurringExpense> & { active?: boolean },
): Promise<RecurringExpense> => {
  const { data } = await api.put(`/recurring-expenses/${id}`, payload);
  return data;
};

export const deleteRecurringExpense = async (
  id: number,
): Promise<RecurringExpense> => {
  const { data } = await api.delete(`/recurring-expenses/${id}`);
  return data;
};
