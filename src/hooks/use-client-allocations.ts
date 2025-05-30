import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface Allocation {
  id: number;
  asset: {
    id: number;
    name: string;
    price: number;
  };
  quantity: number;
  clientId: number;
}

interface GetAllocationsResponse {
  data: Allocation[];
  meta: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

export function useClientAllocations(clientId: number, page = 1, perPage = 10) {
  return useQuery<GetAllocationsResponse>({
    queryKey: ["allocations", clientId, page, perPage],
    queryFn: async () => {
      const res = await api.get(`/clients/${clientId}/allocations`, {
        params: { page, perPage },
      });
      return res.data;
    },
  });
}
