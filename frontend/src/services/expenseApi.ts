import api from "./api";
import { type Expense, type NewExpense, type MonthlySummary } from "../types";

export const getExpenses = async (month: string): Promise<Expense[]> => {
  const { data } = await api.get(`/expenses?month=${month}`);
  return data;
};

export const createExpense = async (
  newExpense: NewExpense,
): Promise<Expense> => {
  const { data } = await api.post("/expenses", newExpense);
  return data;
};

export const updateExpense = async (
  id: number,
  payload: Partial<NewExpense>,
): Promise<Expense> => {
  const { data } = await api.put(`/expenses/${id}`, payload);
  return data;
};

export const deleteExpense = async (id: number): Promise<Expense> => {
  const { data } = await api.delete(`/expenses/${id}`);
  return data;
};

export const getMonthlySummary = async (
  month: string,
): Promise<MonthlySummary[]> => {
  const { data } = await api.get(`/expenses/summary?month=${month}`);
  return data;
};

export const getExpensesByYear = async (year: number): Promise<Expense[]> => {
  const { data } = await api.get(`/expenses?year=${year}`);
  return data;
};

export const getYearlySummary = async (
  year: number,
): Promise<MonthlySummary[]> => {
  const { data } = await api.get(`/expenses/summary?year=${year}`);
  return data;
};
