import prisma from "../config/prisma";
import { Category } from "@prisma/client";

export const getAllCategories = async (): Promise<Category[]> => {
  return prisma.category.findMany();
};

interface CreateCategoryInput {
  nom: string;
  icone: string;
  couleur: string;
}

export const createCategory = async (
  data: CreateCategoryInput,
): Promise<Category> => {
  return prisma.category.create({
    data,
  });
};

export const updateCategory = async (
  id: number,
  data: Partial<CreateCategoryInput>,
): Promise<Category> => {
  return prisma.category.update({
    where: { id },
    data,
  });
};

export const deleteCategory = async (id: number): Promise<Category> => {
  // First, check if there are expenses for this category or handle cascade if needed
  // Prisma handles this based on schema.
  return prisma.category.delete({
    where: { id },
  });
};
