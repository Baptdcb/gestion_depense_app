import api from "./api";
import { type Category, type NewCategory } from "../types";

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await api.get("/categories");
  return data;
};

export const createCategory = async (
  newCategory: NewCategory,
): Promise<Category> => {
  const { data } = await api.post("/categories", newCategory);
  return data;
};

export const updateCategory = async (
  id: number,
  categoryData: Partial<NewCategory>,
): Promise<Category> => {
  const { data } = await api.put(`/categories/${id}`, categoryData);
  return data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await api.delete(`/categories/${id}`);
};
