import prisma from "../config/prisma";
import { format } from "date-fns";

interface CreateRecurringExpenseInput {
  montant: number;
  description?: string;
  categorieId: number;
  active?: boolean;
  startDate?: Date;
}

interface UpdateRecurringExpenseInput {
  montant?: number;
  description?: string | null;
  categorieId?: number;
  active?: boolean;
  startDate?: Date;
}

const monthFromDate = (date: Date) => format(date, "yyyy-MM");

export const listRecurringExpenses = async () => {
  return prisma.recurringExpense.findMany({
    include: { categorie: true },
    orderBy: { createdAt: "desc" },
  });
};

export const createRecurringExpense = async (
  data: CreateRecurringExpenseInput,
) => {
  return prisma.recurringExpense.create({
    data: {
      montant: data.montant,
      description: data.description,
      categorieId: data.categorieId,
      active: data.active ?? true,
      startDate: data.startDate ?? new Date(),
    },
    include: { categorie: true },
  });
};

export const updateRecurringExpense = async (
  id: number,
  data: UpdateRecurringExpenseInput,
) => {
  return prisma.recurringExpense.update({
    where: { id },
    data: {
      ...data,
    },
    include: { categorie: true },
  });
};

export const deleteRecurringExpense = async (id: number) => {
  // Delete instances from the current month and future only
  const now = new Date();
  const currentMonth = monthFromDate(now);

  await prisma.expense.deleteMany({
    where: {
      recurringExpenseId: id,
      mois: { gte: currentMonth },
    },
  });

  return prisma.recurringExpense.delete({
    where: { id },
  });
};

export const ensureRecurringExpensesForMonth = async (month: string) => {
  const recurring = await prisma.recurringExpense.findMany({
    where: { active: true },
  });

  if (recurring.length === 0) return;

  const existing = await prisma.expense.findMany({
    where: {
      mois: month,
      recurringExpenseId: { not: null },
    },
    select: { recurringExpenseId: true },
  });

  const existingIds = new Set(
    existing.map((e) => e.recurringExpenseId).filter(Boolean) as number[],
  );

  const targetDate = new Date(`${month}-01T00:00:00.000Z`);
  const today = new Date();

  await Promise.all(
    recurring.map(
      async (rec: {
        id: number;
        montant: any;
        description: string | null;
        categorieId: number;
        startDate: Date;
      }) => {
        const recStartDate = new Date(rec.startDate);
        const recStartMonth = monthFromDate(recStartDate);
        // Ne pas créer avant le mois de départ
        if (month < recStartMonth) return;
        // Ne créer la dépense que si le mois a commencé
        if (targetDate > today) return;
        // Ne créer la dépense que si aujourd'hui >= startDate
        if (today < recStartDate) return;
        if (existingIds.has(rec.id)) return;

        await prisma.expense.create({
          data: {
            montant: rec.montant,
            description: rec.description,
            date: targetDate,
            mois: month,
            categorieId: rec.categorieId,
            recurringExpenseId: rec.id,
          },
        });
      },
    ),
  );
};

export const ensureRecurringExpensesForYear = async (year: number) => {
  const now = new Date();
  const isCurrentYear = now.getFullYear() === year;
  const lastMonth = isCurrentYear ? now.getMonth() + 1 : 12;

  for (let month = 1; month <= lastMonth; month += 1) {
    const monthString = `${year}-${String(month).padStart(2, "0")}`;
    await ensureRecurringExpensesForMonth(monthString);
  }
};
