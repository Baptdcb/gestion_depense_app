import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../services/queryClient";
import { deleteCategory } from "../services/categoryApi";

export const useDeleteCategory = () => {
  return useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
  });
};
