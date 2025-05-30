import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface Client {
  id: number;
  name: string;
  email: string;
  status: boolean;
}

export interface GetClientsResponse {
  data: Client[];
  meta: {
    page: number;
    perPage: number;
    total: number;
  };
}

export function useClients(page = 1, perPage = 10) {
  return useQuery<GetClientsResponse>({
    queryKey: ["clients", page, perPage],
    queryFn: async () => {
      const response = await api.get("/clients", {
        params: {
          page,
          perPage,
        },
      });
      return response.data;
    },
  });
}
