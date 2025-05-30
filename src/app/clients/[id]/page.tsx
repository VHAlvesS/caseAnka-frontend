"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  ClientAllocationModal,
  AllocationFormData,
} from "@/components/ClientAllocationModal";
import { Pen, Trash2 } from "lucide-react";
import { useClientAllocations } from "@/hooks/use-client-allocations";
import { useDeleteAllocation } from "@/hooks/use-delete-allocation";

type Allocation = {
  id: number;
  asset: {
    id: number;
    name: string;
    price: number;
  };
  quantity: number;
  clientId: number;
};

export default function ClientDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const clientId = Number(id);
  const isMobile = useIsMobile();

  const deleteAllocation = useDeleteAllocation(clientId);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingAllocation, setEditingAllocation] = useState<
    (AllocationFormData & { id: number }) | null
  >(null);
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, isFetching } = useClientAllocations(
    clientId,
    page,
    10
  );

  const allocations = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  function handleCreate() {
    setEditingAllocation(null);
    setModalOpen(true);
  }

  function handleEdit(allocation: Allocation) {
    setEditingAllocation({
      id: allocation.id,
      assetId: String(allocation.asset.id),
      quantity: allocation.quantity,
    });
    setModalOpen(true);
  }

  function handleDelete(assetId: number) {
    deleteAllocation.mutate(assetId);
  }

  return (
    <div className="space-y-6 max-w-[768px] m-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Alocações do Cliente #{clientId}</h1>
        <Button onClick={handleCreate}>Novo Ativo</Button>
      </div>

      <ClientAllocationModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        defaultValues={editingAllocation ?? undefined}
      />

      {isLoading ? (
        <p className="text-center">Carregando...</p>
      ) : isError ? (
        <p className="text-center text-red-500">Erro ao carregar dados.</p>
      ) : allocations.length === 0 ? (
        <p className="text-center text-muted-foreground">
          Nenhuma alocação encontrada.
        </p>
      ) : (
        <>
          {!isMobile ? (
            <div className="hidden md:block rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ativo</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allocations.map((allocation) => (
                    <TableRow key={allocation.id}>
                      <TableCell>{allocation.asset.name}</TableCell>
                      <TableCell>
                        R$ {allocation.asset.price.toFixed(2)}
                      </TableCell>
                      <TableCell>{allocation.quantity}</TableCell>
                      <TableCell>
                        R${" "}
                        {(allocation.asset.price * allocation.quantity).toFixed(
                          2
                        )}
                      </TableCell>
                      <TableCell className="text-right flex justify-end gap-1">
                        <Button
                          variant="default"
                          className="bg-amber-500 hover:bg-amber-800"
                          size="sm"
                          onClick={() => handleEdit(allocation)}
                        >
                          <Pen size={16} />
                        </Button>
                        <Button
                          variant="destructive"
                          className="hover:bg-red-900"
                          size="sm"
                          onClick={() => handleDelete(allocation.asset.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="md:hidden space-y-4">
              {allocations.map((allocation) => (
                <div
                  key={allocation.id}
                  className="border rounded-lg p-4 shadow-sm bg-white dark:bg-zinc-900 space-y-2"
                >
                  <div className="flex justify-between">
                    <strong className="text-sm">{allocation.asset.name}</strong>
                    <div className="flex gap-1">
                      <Button
                        variant="default"
                        className="bg-amber-500 hover:bg-amber-800"
                        size="sm"
                        onClick={() => handleEdit(allocation)}
                      >
                        <Pen size={16} />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(allocation.asset.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Preço: R$ {allocation.asset.price.toFixed(2)}</p>
                    <p>Quantidade: {allocation.quantity}</p>
                    <p>
                      Total: R${" "}
                      {(allocation.asset.price * allocation.quantity).toFixed(
                        2
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-center pt-4 gap-2">
            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNumber = index + 1;
              const isActive = pageNumber === page;

              return (
                <Button
                  key={pageNumber}
                  variant={isActive ? "outline" : "ghost"}
                  size="sm"
                  onClick={() => setPage(pageNumber)}
                  disabled={isFetching && isActive}
                >
                  {pageNumber}
                </Button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
