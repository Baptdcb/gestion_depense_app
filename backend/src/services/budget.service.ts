import prisma from "../config/prisma";
import { MonthlyBudget, CategoryBudget } from "@prisma/client";
import { subMonths, format } from "date-fns";

interface CategoryBudgetInput {
  categoryId: number;
  limit: number;
  isDisabled?: boolean; // optional, defaults to false
}

interface SetBudgetInput {
  month: string;
  globalLimit: number;
  categoryBudgets: CategoryBudgetInput[];
}

export const getBudget = async (month: string) => {
  // 1. Try to find the budget for the requested month
  const budget = await prisma.monthlyBudget.findUnique({
    where: { month },
    include: {
      categoryBudgets: {
        include: {
          category: true,
        },
      },
    },
  });

  if (budget) {
    return budget;
  }

  // 2. If not found, try to find the previous month's budget to use as default values
  // But do NOT create it yet. The frontend will pre-fill the form with these values.
  const date = new Date(`${month}-01`); // YYYY-MM-01
  const previousMonth = format(subMonths(date, 1), "yyyy-MM");

  const previousBudget = await prisma.monthlyBudget.findUnique({
    where: { month: previousMonth },
    include: {
      categoryBudgets: {
        include: {
          category: true,
        },
      },
    },
  });

  if (previousBudget) {
    // Return structured like a budget but indicate it's from previous month?
    // Or simply let the caller handle it.
    // Let's simpler: Just return null and handle "fetch previous" in a separate specific call if needed?
    // User Requirement: "Option B: Reuse previous".
    // It is better to have a specific endpoint or flag to "get suggestions" if actual doesn't exist.
    // However, for simplicity, let's return null here. The frontend will treat null as "No budget set".
    // When the user opens the "Set Budget" modal, we can have logic to fetch defaults.
    return null;
  }

  return null;
};

// Helper to get budget OR defaults if missing
export const getBudgetOrDefault = async (month: string) => {
  const budget = await prisma.monthlyBudget.findUnique({
    where: { month },
    include: {
      categoryBudgets: {
        include: { category: true },
      },
    },
  });

  if (budget) return { budget, isDefault: false };

  // Fetch previous month for defaults
  const date = new Date(`${month}-01`);
  const previousMonth = format(subMonths(date, 1), "yyyy-MM");
  const previousBudget = await prisma.monthlyBudget.findUnique({
    where: { month: previousMonth },
    include: {
      categoryBudgets: {
        include: { category: true },
      },
    },
  });

  if (previousBudget) {
    // Transform to remove IDs specific to previous month so it acts as a template
    return { budget: previousBudget, isDefault: true };
  }

  return { budget: null, isDefault: false };
};

export const setBudget = async (data: SetBudgetInput) => {
  const { month, globalLimit, categoryBudgets } = data;

  // Use transaction to ensure consistency
  return await prisma.$transaction(async (tx) => {
    // 1. Upsert Monthly Budget
    const monthlyBudget = await tx.monthlyBudget.upsert({
      where: { month },
      update: { globalLimit },
      create: { month, globalLimit },
    });

    // 2. Upsert Category Budgets
    // We delete existing ones for this month to cleanly replace with new set (handling removals if any)
    // Or strictly upsert. Deleting and recreating is often easier for bulk updates via forms.
    // Let's go with delete-all-for-month-and-recreate approach for simplicity and correctness of "state sync"

    // Wait, deleting might lose history if we track history? No, history is MonthlyBudget specific.
    // This is safe.

    await tx.categoryBudget.deleteMany({
      where: { monthlyBudgetId: monthlyBudget.id },
    });

    if (categoryBudgets.length > 0) {
      await tx.categoryBudget.createMany({
        data: categoryBudgets.map((cb) => ({
          monthlyBudgetId: monthlyBudget.id,
          categoryId: cb.categoryId,
          limit: cb.limit,
          isDisabled: cb.isDisabled ?? false,
        })),
      });
    }

    // Return full object
    return await tx.monthlyBudget.findUnique({
      where: { id: monthlyBudget.id },
      include: {
        categoryBudgets: {
          include: { category: true },
        },
      },
    });
  });
};
