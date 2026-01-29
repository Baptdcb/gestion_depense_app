import prisma from "../config/prisma";

export const getHistory = async () => {
  const budgets = await prisma.monthlyBudget.findMany({
    include: {
      categoryBudgets: {
        include: { category: true },
      },
    },
    orderBy: { month: "asc" },
  });

  const expenses = await prisma.expense.findMany({
    include: { categorie: true },
    orderBy: { mois: "asc" },
  });

  const months = new Set<string>();
  budgets.forEach((b) => months.add(b.month));
  expenses.forEach((e) => months.add(e.mois));
  const sortedMonths = Array.from(months).sort();

  let runningBalance = 0;
  const history = [];

  for (const month of sortedMonths) {
    const budget = budgets.find((b) => b.month === month);
    const monthlyExpenses = expenses.filter((e) => e.mois === month);

    const limit = budget ? Number(budget.globalLimit) : 0;
    const totalSpent = monthlyExpenses.reduce(
      (acc, curr) => acc + Number(curr.montant),
      0,
    );
    const difference = limit - totalSpent;
    runningBalance += difference;

    // Group by category
    const categoryMap = new Map<
      number,
      {
        category: any;
        spent: number;
        limit: number;
      }
    >();

    // Initialize from expenses
    monthlyExpenses.forEach((e) => {
      if (!categoryMap.has(e.categorieId)) {
        categoryMap.set(e.categorieId, {
          category: e.categorie,
          spent: 0,
          limit: 0,
        });
      }
      categoryMap.get(e.categorieId)!.spent += Number(e.montant);
    });

    // Initialize from budget (if not already there)
    if (budget) {
      budget.categoryBudgets.forEach((cb) => {
        if (!categoryMap.has(cb.categoryId)) {
          categoryMap.set(cb.categoryId, {
            category: cb.category,
            spent: 0,
            limit: 0, // Will set below
          });
        }
        categoryMap.get(cb.categoryId)!.limit = Number(cb.limit);
      });
    }

    const categoriesReport = Array.from(categoryMap.values()).map((item) => ({
      categoryId: item.category.id,
      name: item.category.nom,
      color: item.category.couleur,
      icon: item.category.icone,
      spent: item.spent,
      limit: item.limit,
      diff: item.limit - item.spent,
    }));

    history.push({
      month,
      globalLimit: limit,
      totalSpent,
      difference,
      runningBalance,
      categories: categoriesReport,
    });
  }

  return history;
};
