import api from './api';
import { Expense, NewExpense, MonthlySummary } from '../types';

export const getExpenses = async (month: string): Promise<Expense[]> => {
  const { data } = await api.get(`/expenses?month=${month}`);
  return data;
};

export const createExpense = async (newExpense: NewExpense): Promise<Expense> => {
  const { data } = await api.post('/expenses', newExpense);
  return data;
};

export const getMonthlySummary = async (month: string): Promise<MonthlySummary[]> => {
  const { data } = await api.get(`/expenses/summary?month=${month}`);
  return data;
};
