"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Pen } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ClientFormModal, ClientFormData } from "@/components/ClientFormModal";
import { useClients, Client } from "@/hooks/use-clients";
import { useCreateClient } from "@/hooks/useCreateClient";
import { useUpdateClient } from "@/hooks/useUpdateClient";
import { useDeleteClient } from "@/hooks/useDeleteClient";

export default function ClientsPage() {
  const isMobile = useIsMobile();
  const router = useRouter();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, isFetching } = useClients(page, 10);

  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();

  const clients = data?.data || [];

  function handleCreate() {
    setEditingClient(null);
    setModalOpen(true);
  }

  function handleEdit(client: Client) {
    setEditingClient(client);
    setModalOpen(true);
  }

  function handleSubmit(data: ClientFormData) {
    const payload = {
      name: data.name,
      email: data.email,
      status: data.status ?? true,
    };

    if (editingClient) {
      updateClient.mutate(
        { ...editingClient, ...payload },
        {
          onSuccess: () => {
            setModalOpen(false);
            setEditingClient(null);
          },
        }
      );
    } else {
      createClient.mutate(payload, {
        onSuccess: () => {
          setModalOpen(false);
          setEditingClient(null);
        },
      });
    }
  }

  function handleDelete(id: number) {
    deleteClient.mutate(id);
  }

  return (
    <div className="space-y-6 max-w-[768px] m-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <Button onClick={handleCreate}>Novo Cliente</Button>
      </div>

      <ClientFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSubmit={handleSubmit}
        defaultValues={editingClient || undefined}
      />

      {isLoading ? (
        <p className="text-center">Carregando...</p>
      ) : isError ? (
        <p className="text-center text-red-500">Erro ao carregar dados.</p>
      ) : (
        <>
          {!isMobile ? (
            <div className="hidden md:block rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full ${
                            client.status
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {client.status ? "ativo" : "inativo"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/clients/${client.id}`}
                          className="font-medium hover:underline underline-offset-4 text-blue-600"
                        >
                          {client.name}
                        </Link>
                      </TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell className="text-right flex justify-end gap-1">
                        <Button
                          variant="default"
                          className="bg-amber-500 hover:bg-amber-800"
                          size="sm"
                          onClick={() => handleEdit(client)}
                        >
                          <Pen size={16} />
                        </Button>
                        <Button
                          variant="destructive"
                          className="hover:bg-red-900"
                          size="sm"
                          onClick={() => handleDelete(client.id)}
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
              {clients.map((client) => (
                <div
                  key={client.id}
                  className="border rounded-lg p-4 shadow-sm bg-white dark:bg-zinc-900 space-y-2"
                >
                  <div className="flex justify-between">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        client.status
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {client.status ? "ativo" : "inativo"}
                    </span>
                    <div className="flex gap-1">
                      <Button
                        variant="default"
                        className="bg-amber-500 hover:bg-amber-800"
                        size="sm"
                        onClick={() => handleEdit(client)}
                      >
                        <Pen size={16} />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(client.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold">
                      <Link
                        href={`/clients/${client.id}`}
                        className="hover:underline underline-offset-4 text-blue-600"
                      >
                        {client.name}
                      </Link>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {client.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-center pt-4 gap-2">
            {Array.from({
              length: data ? Math.ceil(data.meta.total / data.meta.perPage) : 1,
            }).map((_, index) => {
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
