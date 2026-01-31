import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBudget, saveBudget } from "../services/budgetApi";
import type { NewBudget } from "../types";
import { useToast } from "./useToast";

export const useBudgetData = (month: string) => {
  return useQuery({
    queryKey: ["budget", month],
    queryFn: () => getBudget(month),
  });
};

export const useCreateBudget = (month: string) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (data: NewBudget) => saveBudget(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget", month] });
      queryClient.invalidateQueries({ queryKey: ["expenses", month] });
      toast.success("✓ Budget créé avec succès");
    },
    onError: (error: Error) => {
      toast.error(`✗ Erreur: ${error.message}`);
    },
  });
};

export const useUpdateBudget = (month: string) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ data }: { id: number; data: NewBudget }) => saveBudget(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget", month] });
      queryClient.invalidateQueries({ queryKey: ["expenses", month] });
      toast.success("✓ Budget mis à jour avec succès");
    },
    onError: (error: Error) => {
      toast.error(`✗ Erreur: ${error.message}`);
    },
  });
};
