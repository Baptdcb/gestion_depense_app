import prisma from '../config/prisma';
import { Expense } from '@prisma/client';
import { format } from 'date-fns';

interface CreateExpenseInput {
  montant: number;
  description?: string;
  date: Date;
  categorieId: number;
}

export const createExpense = async (data: CreateExpenseInput): Promise<Expense> => {
  const mois = format(new Date(data.date), 'yyyy-MM');
  
  return prisma.expense.create({
    data: {
      ...data,
      montant: data.montant,
      mois,
    },
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
      date: 'desc',
    },
  });
};

export const getMonthlySummary = async (month: string) => {
  const result = await prisma.expense.groupBy({
    by: ['categorieId'],
    where: {
      mois: month,
    },
    _sum: {
      montant: true,
    },
  });

  // To get category details, we need another query
  const categoryIds = result.map(item => item.categorieId);
  const categories = await prisma.category.findMany({
    where: {
      id: {
        in: categoryIds,
      },
    },
  });

  const categoryMap = new Map(categories.map(c => [c.id, c]));

  return result.map(item => ({
    categorie: categoryMap.get(item.categorieId),
    total: item._sum.montant,
  }));
};
