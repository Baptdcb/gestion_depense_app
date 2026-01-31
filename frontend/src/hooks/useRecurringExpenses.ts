import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getRecurringExpenses,
  createRecurringExpense,
  updateRecurringExpense,
  deleteRecurringExpense,
} from "../services/recurringExpenseApi";
import type { NewRecurringExpense } from "../types";
import { useToast } from "./useToast";

export const useRecurringExpensesList = () => {
  return useQuery({
    queryKey: ["recurring-expenses"],
    queryFn: getRecurringExpenses,
  });
};

export const useCreateRecurringExpense = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (data: NewRecurringExpense) => createRecurringExpense(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["recurring-expenses"],
      });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
      toast.success("✓ Dépense récurrente créée avec succès");
    },
    onError: (error: Error) => {
      toast.error(`✗ Erreur: ${error.message}`);
    },
  });
};

export const useUpdateRecurringExpense = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<NewRecurringExpense>;
    }) => updateRecurringExpense(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["recurring-expenses"],
      });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
      toast.success("✓ Dépense récurrente mise à jour avec succès");
    },
    onError: (error: Error) => {
      toast.error(`✗ Erreur: ${error.message}`);
    },
  });
};

export const useDeleteRecurringExpense = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: deleteRecurringExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["recurring-expenses"],
      });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
      toast.success("✓ Dépense récurrente supprimée avec succès");
    },
    onError: (error: Error) => {
      toast.error(`✗ Erreur: ${error.message}`);
    },
  });
};
