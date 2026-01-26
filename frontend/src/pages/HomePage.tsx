import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

import MonthSelector from "../components/MonthSelector";
import ExpenseList from "../components/ExpenseList";
import AddCategoryForm from "../components/AddCategoryForm";
import ManageCategoriesModal from "../components/ManageCategoriesModal";
import AddExpenseForm from "../components/AddExpenseForm"; // Import AddExpenseForm
import { getExpenses, getMonthlySummary } from "../services/expenseApi";
import { getCategories } from "../services/categoryApi";
import { getBudget } from "../services/budgetApi";
import { FaPlus, FaChartPie } from "react-icons/fa";
import SummaryDisplay from "../components/SummaryDisplay";
import BudgetProgress from "../components/BudgetProgress";
import BudgetModal from "../components/BudgetModal";

export default function HomePage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isManageCategoriesModalOpen, setIsManageCategoriesModalOpen] =
    useState(false);
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  const monthString = format(selectedMonth, "yyyy-MM");

  const {
    data: expenses,
    isLoading: isLoadingExpenses,
    error: expensesError,
  } = useQuery({
    queryKey: ["expenses", monthString],
    queryFn: () => getExpenses(monthString),
  });

  const { data: summary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ["summary", monthString],
    queryFn: () => getMonthlySummary(monthString),
  });

  // Fetch categories as well
  const {
    data: categories,
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { data: budgetData } = useQuery({
    queryKey: ["budget", monthString],
    queryFn: () => getBudget(monthString),
  });

  const total =
    summary?.reduce((acc, item) => acc + (Number(item.total) || 0), 0) ?? 0;

  const renderContent = () => {
    if (isLoadingExpenses) {
      return <div className="text-center p-8">Chargement des dépenses...</div>;
    }
    if (expensesError) {
      return (
        <div className="text-center p-8 text-red-500">
          Erreur: {expensesError.message}
        </div>
      );
    }
    return <ExpenseList expenses={expenses || []} />;
  };

  return (
    <div>
      <MonthSelector
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {/* Budget Section */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Suivi Budget</h2>
              <button
                onClick={() => setIsBudgetModalOpen(true)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
              >
                <FaChartPie className="mr-1" /> Gérer
              </button>
            </div>
            <BudgetProgress
              budget={budgetData?.budget ?? null}
              summary={summary || []}
              totalSpent={total}
            />
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">
              Dépenses de {format(selectedMonth, "MMMM yyyy")}
            </h2>
            {renderContent()}
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow p-4 mb-4">
            <h2 className="text-lg font-semibold mb-4">
              Répartition des dépenses
            </h2>
            <SummaryDisplay
              summary={summary || []}
              isLoading={isLoadingSummary}
              total={total}
            />
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Actions</h2>
            <div className="space-y-2">
              <button
                onClick={() => setIsAddExpenseModalOpen(true)}
                className="w-full inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={
                  isLoadingCategories ||
                  categoriesError != null ||
                  (categories && categories.length === 0)
                }
              >
                <FaPlus className="mr-2" /> Ajouter Dépense
              </button>
              <button
                onClick={() => setIsAddCategoryModalOpen(true)}
                className="w-full inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <FaPlus className="mr-2" /> Ajouter Catégorie
              </button>
              <button
                onClick={() => setIsManageCategoriesModalOpen(true)}
                className="w-full inline-flex items-center justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Gérer les Catégories
              </button>
            </div>
          </div>
        </div>
      </div>

      <AddCategoryForm
        isOpen={isAddCategoryModalOpen}
        onClose={() => setIsAddCategoryModalOpen(false)}
      />
      <ManageCategoriesModal
        isOpen={isManageCategoriesModalOpen}
        onClose={() => setIsManageCategoriesModalOpen(false)}
      />
      {categories && (
        <AddExpenseForm
          isOpen={isAddExpenseModalOpen}
          onClose={() => setIsAddExpenseModalOpen(false)}
          categories={categories}
          currentMonth={monthString}
        />
      )}
      {categories && (
        <BudgetModal
          isOpen={isBudgetModalOpen}
          onClose={() => setIsBudgetModalOpen(false)}
          categories={categories}
          currentMonth={monthString}
          initialBudget={budgetData?.budget ?? null}
          isDefault={budgetData?.isDefault ?? false}
        />
      )}
    </div>
  );
}
