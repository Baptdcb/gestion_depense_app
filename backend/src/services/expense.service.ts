import prisma from "../config/prisma";
import { Expense } from "@prisma/client";
import { format } from "date-fns";

interface CreateExpenseInput {
  montant: number;
  description?: string;
  date: Date;
  categorieId: number;
  type?: "expense" | "refund";
  isShared?: boolean;
  sharePercentage?: number;
}

interface UpdateExpenseInput {
  montant?: number;
  description?: string | null;
  date?: Date;
  categorieId?: number;
  type?: "expense" | "refund";
  isShared?: boolean;
  sharePercentage?: number;
}

export const createExpense = async (
  data: CreateExpenseInput,
): Promise<Expense> => {
  const mois = format(new Date(data.date), "yyyy-MM");

  return prisma.expense.create({
    data: {
      ...data,
      montant: data.montant,
      mois,
      type: data.type ?? "expense",
      isShared: data.isShared,
      sharePercentage: data.sharePercentage,
    },
  });
};

export const updateExpense = async (
  id: number,
  data: UpdateExpenseInput,
): Promise<Expense> => {
  const updatedData: any = { ...data };
  if (data.date) {
    updatedData.mois = format(new Date(data.date), "yyyy-MM");
  }

  return prisma.expense.update({
    where: { id },
    data: updatedData,
    include: { categorie: true },
  });
};

export const deleteExpense = async (id: number): Promise<Expense> => {
  return prisma.expense.delete({
    where: { id },
  });
};

export const getExpensesByMonth = async (month: string): Promise<Expense[]> => {
  return prisma.expense.findMany({
    where: {
      mois: month,
    },
    include: {
      categorie: true, // Include category details
    },
    orderBy: {
      date: "desc",
    },
  });
};

export const getExpensesByYear = async (year: number): Promise<Expense[]> => {
  return prisma.expense.findMany({
    where: {
      date: {
        gte: new Date(`${year}-01-01T00:00:00.000Z`),
        lt: new Date(`${year + 1}-01-01T00:00:00.000Z`),
      },
    },
    include: {
      categorie: true,
    },
    orderBy: {
      date: "desc",
    },
  });
};

export const getMonthlySummary = async (month: string) => {
  const result = await prisma.expense.groupBy({
    by: ["categorieId"],
    where: {
      mois: month,
    },
    _sum: {
      montant: true,
    },
  });

  // To get category details, we need another query
  const categoryIds = result.map((item) => item.categorieId);
  const categories = await prisma.category.findMany({
    where: {
      id: {
        in: categoryIds,
      },
    },
  });

  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  return result.map((item) => ({
    categorie: categoryMap.get(item.categorieId),
    total: item._sum.montant,
  }));
};

export const getYearlySummary = async (year: number) => {
  const result = await prisma.expense.groupBy({
    by: ["categorieId"],
    where: {
      date: {
        gte: new Date(`${year}-01-01T00:00:00.000Z`),
        lt: new Date(`${year + 1}-01-01T00:00:00.000Z`),
      },
    },
    _sum: {
      montant: true,
    },
  });

  const categoryIds = result.map((item) => item.categorieId);
  const categories = await prisma.category.findMany({
    where: {
      id: {
        in: categoryIds,
      },
    },
  });

  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  return result.map((item) => ({
    categorie: categoryMap.get(item.categorieId),
    total: item._sum.montant,
  }));
};
