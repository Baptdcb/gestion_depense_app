import prisma from '../config/prisma';
import { Category } from '@prisma/client';

export const getAllCategories = async (): Promise<Category[]> => {
  return prisma.category.findMany();
};

interface CreateCategoryInput {
  nom: string;
  icone: string;
}

export const createCategory = async (data: CreateCategoryInput): Promise<Category> => {
  return prisma.category.create({
    data,
  });
};
