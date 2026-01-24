import api from './api';
import { Category, NewCategory } from '../types';

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await api.get('/categories');
  return data;
};

export const createCategory = async (newCategory: NewCategory): Promise<Category> => {
  const { data } = await api.post('/categories', newCategory);
  return data;
};
