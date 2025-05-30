import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface AllocationRequest {
  assetId: number;
  quantity: number;
}

export function useCreateAllocation(clientId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AllocationRequest) => {
      const res = await api.post(`/clients/${clientId}/allocations`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allocations", clientId] });
    },
  });
}
