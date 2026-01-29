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
  const expensesCount = await prisma.expense.count({
    where: { categorieId: id },
  });

  if (expensesCount > 0) {
    let otherCategory = await prisma.category.findUnique({
      where: { nom: "Autres" },
    });

    if (!otherCategory) {
      otherCategory = await prisma.category.create({
        data: {
          nom: "Autres",
          icone: "FaQuestion",
          couleur: "#94a3b8",
        },
      });
    }

    if (otherCategory.id === id) {
      throw new Error(
        "Impossible  supprimer la catégorie 'Autres' car elle contient des dépenses.",
      );
    }

    await prisma.expense.updateMany({
      where: { categorieId: id },
      data: { categorieId: otherCategory.id },
    });
  }

  return prisma.category.delete({
    where: { id },
  });
};
