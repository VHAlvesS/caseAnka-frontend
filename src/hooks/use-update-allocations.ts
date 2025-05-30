import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface AllocationRequest {
  assetId: number;
  quantity: number;
}

export function useUpdateAllocation(clientId: number, assetId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { quantity: number }) => {
      const res = await api.put(
        `/clients/${clientId}/allocations/${assetId}`,
        data
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allocations", clientId] });
    },
  });
}
