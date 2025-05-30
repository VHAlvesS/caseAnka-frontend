import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useDeleteAllocation(clientId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assetId: number) => {
      await api.delete(`/clients/${clientId}/allocations/${assetId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allocations", clientId] });
    },
  });
}
