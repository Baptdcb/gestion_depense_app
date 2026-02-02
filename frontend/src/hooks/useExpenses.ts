import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getExpenses,
  getExpensesByYear,
  getMonthlySummary,
  getYearlySummary,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../services/expenseApi";
import type { NewExpense } from "../types";
import { useToast } from "./useToast";

export const useExpensesList = (
  month: string,
  viewMode: "month" | "year",
  selectedYear?: number,
) => {
  const queryKey = viewMode === "month" ? [month] : [selectedYear];

  return useQuery({
    queryKey: ["expenses", ...queryKey, viewMode],
    queryFn: () =>
      viewMode === "month"
        ? getExpenses(month)
        : getExpensesByYear(selectedYear!),
  });
};

export const useExpensesSummary = (
  month: string,
  viewMode: "month" | "year",
  selectedYear?: number,
) => {
  const queryKey = viewMode === "month" ? [month] : [selectedYear];

  return useQuery({
    queryKey: ["summary", ...queryKey, viewMode],
    queryFn: () =>
      viewMode === "month"
        ? getMonthlySummary(month)
        : getYearlySummary(selectedYear!),
  });
};

export const useCreateExpense = (
  currentPeriodKey: string,
  viewMode: "month" | "year",
) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (newExpense: NewExpense) => createExpense(newExpense),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["expenses", currentPeriodKey, viewMode],
      });
      queryClient.invalidateQueries({
        queryKey: ["summary", currentPeriodKey, viewMode],
      });
      toast.success("✓ Dépense ajoutée avec succès");
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } },
    ) => {
      const message = error.response?.data?.message || error.message;
      toast.error(`✗ Erreur: ${message}`);
    },
  });
};

export const useUpdateExpense = (
  currentPeriodKey: string,
  viewMode: "month" | "year",
) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<NewExpense>;
    }) => updateExpense(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["expenses", currentPeriodKey, viewMode],
      });
      queryClient.invalidateQueries({
        queryKey: ["summary", currentPeriodKey, viewMode],
      });
      toast.success("✓ Dépense mise à jour avec succès");
    },
    onError: (error: Error) => {
      toast.error(`✗ Erreur: ${error.message}`);
    },
  });
};

export const useDeleteExpense = (
  currentPeriodKey: string,
  viewMode: "month" | "year",
) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["expenses", currentPeriodKey, viewMode],
      });
      queryClient.invalidateQueries({
        queryKey: ["summary", currentPeriodKey, viewMode],
      });
      toast.success("✓ Dépense supprimée avec succès");
    },
    onError: (error: Error) => {
      toast.error(`✗ Erreur: ${error.message}`);
    },
  });
};
