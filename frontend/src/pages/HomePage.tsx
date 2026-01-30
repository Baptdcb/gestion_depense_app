import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

import MonthSelector from "../components/utils/MonthSelector";
import YearSelector from "../components/utils/YearSelector";
import ExpenseList from "../components/Dashboard/Expenses/ExpenseList";
import AddCategoryForm from "../components/Dashboard/AddActions/AddCategoryForm";
import ManageCategoriesModal from "../components/Dashboard/AddActions/ManageCategoriesModal";
import AddExpenseForm from "../components/Dashboard/AddActions/AddExpenseForm"; // Import AddExpenseForm
import {
  getExpenses,
  getExpensesByYear,
  getMonthlySummary,
  getYearlySummary,
} from "../services/expenseApi";
import { getCategories } from "../services/categoryApi";
import { getBudget } from "../services/budgetApi";
import { FaPlus, FaChartPie, FaRedo } from "react-icons/fa";
import SummaryDisplay from "../components/Dashboard/Summary/SummaryDisplay";
import BudgetProgress from "../components/Dashboard/Budget/BudgetProgress";
import BudgetModal from "../components/Dashboard/Budget/BudgetModal";
import RecurringExpensesModal from "../components/AllMenu/RecurringExpensesModal";
import { fr } from "date-fns/locale/fr";
import { TbLayoutSidebar, TbLayoutSidebarFilled } from "react-icons/tb";

interface HomePageProps {
  selectedMonth: Date;
  setSelectedMonth: (date: Date) => void;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  viewMode: "month" | "year";
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export default function HomePage({
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  viewMode,
  isSidebarOpen,
  toggleSidebar,
}: HomePageProps) {
  // const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isManageCategoriesModalOpen, setIsManageCategoriesModalOpen] =
    useState(false);
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isRecurringModalOpen, setIsRecurringModalOpen] = useState(false);

  const monthString = format(selectedMonth, "yyyy-MM");
  const yearString = String(selectedYear);
  const currentPeriodKey = viewMode === "month" ? monthString : yearString;

  const {
    data: expenses,
    isLoading: isLoadingExpenses,
    error: expensesError,
  } = useQuery({
    queryKey: ["expenses", currentPeriodKey, viewMode],
    queryFn: () =>
      viewMode === "month"
        ? getExpenses(monthString)
        : getExpensesByYear(selectedYear),
  });

  const { data: summary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ["summary", currentPeriodKey, viewMode],
    queryFn: () =>
      viewMode === "month"
        ? getMonthlySummary(monthString)
        : getYearlySummary(selectedYear),
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
    enabled: viewMode === "month",
  });

  const total =
    summary?.reduce((acc, item) => acc + (Number(item.total) || 0), 0) ?? 0;
  const expenseCount = expenses?.length ?? 0;

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
    return (
      <ExpenseList
        expenses={expenses || []}
        categories={categories || []}
        currentPeriodKey={currentPeriodKey}
        viewMode={viewMode}
      />
    );
  };

  const renderPieChart = () => {
    if (!summary || summary.length === 0 || total === 0) return null;

    let cumulativePercent = 0;
    const slices = summary.map((item) => {
      const percent = (Number(item.total) / total) * 100;
      const startPercent = cumulativePercent;
      cumulativePercent += percent;
      return {
        category: item.categorie.nom,
        color: item.categorie.couleur,
        percent,
        startPercent,
      };
    });

    return (
      <svg viewBox="0 0 36 36" className="w-full h-full">
        <circle
          cx="18"
          cy="18"
          r="15.9155"
          fill="transparent"
          stroke="#1a1a1a"
          strokeWidth="3.8"
        />
        {slices.map((slice, idx) => {
          const angle = (slice.startPercent * 3.6).toFixed(2);
          const dashLength = ((slice.percent / 100) * 100).toFixed(2);
          return (
            <circle
              key={idx}
              cx="18"
              cy="18"
              r="15.9155"
              fill="transparent"
              stroke={slice.color}
              strokeWidth="3.8"
              strokeDasharray={`${dashLength} ${100 - Number(dashLength)}`}
              strokeDashoffset="25"
              transform={`rotate(${angle} 18 18)`}
            />
          );
        })}
      </svg>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="w-full">
          <div className="flex items-center gap-4 mb-2">
            <button
              onClick={toggleSidebar}
              className="p-2 text-linear-accent hover:bg-white/10 rounded-lg transition-colors"
              aria-label={isSidebarOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {isSidebarOpen ? (
                <TbLayoutSidebarFilled size={28} />
              ) : (
                <TbLayoutSidebar size={28} />
              )}
            </button>
            <h2 className="text-3xl font-semibold text-white">Dashboard</h2>
          </div>
          <p className="text-linear-text-secondary">
            Visualisez et gérez vos finances avec précision.
          </p>
        </div>
        {viewMode === "month" ? (
          <MonthSelector
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
          />
        ) : (
          <YearSelector
            selectedYear={selectedYear}
            onChange={setSelectedYear}
            minYear={2020}
            maxYear={new Date().getFullYear()}
          />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Budget Section - High Visibility Bento Box */}
        {viewMode === "month" && (
          <div className="md:col-span-4 bento-card relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <FaChartPie size={80} className="text-linear-accent" />
            </div>
            <div className="flex justify-between items-center mb-6 relative z-10">
              <h2 className="text-lg font-medium text-white/90">
                Suivi Budget
              </h2>
              <button
                onClick={() => setIsBudgetModalOpen(true)}
                className="glass-pill text-xs font-medium text-linear-accent hover:text-white"
              >
                Configurer
              </button>
            </div>
            <div className="relative z-10">
              <BudgetProgress
                budget={budgetData?.budget ?? null}
                summary={summary || []}
                totalSpent={total}
              />
            </div>
          </div>
        )}

        {/* Répartition Section */}
        <div
          className={
            viewMode === "month"
              ? "md:col-span-8 bento-card"
              : "md:col-span-12 bento-card"
          }
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-white/90">
              Répartition par catégorie
            </h2>
            <div className="flex items-center gap-3 text-sm text-white/70">
              <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                {expenseCount} dépense{expenseCount > 1 ? "s" : ""}
              </span>
              <div className="w-20 h-20">{renderPieChart()}</div>
            </div>
          </div>
          <SummaryDisplay
            summary={summary || []}
            isLoading={isLoadingSummary}
            total={total}
          />
        </div>

        {/* Expenses List Section - Main Content */}
        <div className="md:col-span-8 bento-card min-h-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-white/90">
              Transactions{" "}
              <span className="text-sm text-linear-text-secondary ml-2">
                {viewMode === "month"
                  ? format(selectedMonth, "MMMM yyyy", { locale: fr })
                  : selectedYear}
              </span>
            </h2>
          </div>
          <div className="overflow-hidden">{renderContent()}</div>
        </div>

        {/* Actions & Stats Card */}
        <div className="md:col-span-4 flex flex-col gap-6">
          <div className="bento-card">
            <h2 className="text-lg font-medium mb-6 text-white/90">
              Actions rapides
            </h2>
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => setIsAddExpenseModalOpen(true)}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-linear-accent/10 border border-linear-accent/20 text-linear-accent hover:bg-linear-accent/20 transition-all group"
                disabled={
                  isLoadingCategories ||
                  categoriesError != null ||
                  (categories && categories.length === 0)
                }
              >
                <div className="flex items-center">
                  <div className="bg-linear-accent text-white p-2 rounded-lg mr-3 shadow-lg shadow-linear-accent/20">
                    <FaPlus size={14} />
                  </div>
                  <span className="font-medium text-white/90">
                    Nouvelle dépense
                  </span>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-1">
                  →
                </div>
              </button>

              <button
                onClick={() => setIsRecurringModalOpen(true)}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 transition-all group"
              >
                <div className="flex items-center">
                  <div className="bg-white/10 text-white p-2 rounded-lg mr-3">
                    <FaRedo size={14} />
                  </div>
                  <span className="font-medium">Dépenses récurrentes</span>
                </div>
              </button>

              <button
                onClick={() => setIsAddCategoryModalOpen(true)}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 transition-all group"
              >
                <div className="flex items-center">
                  <div className="bg-white/10 text-white p-2 rounded-lg mr-3">
                    <FaPlus size={14} />
                  </div>
                  <span className="font-medium">Créer une catégorie</span>
                </div>
              </button>

              <button
                onClick={() => setIsManageCategoriesModalOpen(true)}
                className="w-full text-center py-3 text-sm text-linear-text-secondary hover:text-white transition-colors border-t border-white/5 mt-2"
              >
                Gérer les catégories
              </button>
            </div>
          </div>

          <div className="bento-card grow bg-linear-to-br from-linear-surface to-linear-accent/5">
            <h2 className="text-sm font-medium text-linear-text-secondary  tracking-wider mb-2">
              Télécharger le rapport mensuel
            </h2>
            <p className="text-white/70 text-sm leading-relaxed italic"></p>
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
      <RecurringExpensesModal
        isOpen={isRecurringModalOpen}
        onClose={() => setIsRecurringModalOpen(false)}
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
