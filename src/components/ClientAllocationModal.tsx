"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useCreateAllocation } from "@/hooks/use-create-allocation";
import { useUpdateAllocation } from "@/hooks/use-update-allocations";
import { api } from "@/lib/api";

const allocationSchema = z.object({
  assetId: z.string().min(1, "Selecione um ativo"),
  quantity: z.coerce
    .number({ invalid_type_error: "Informe um número válido" })
    .min(1, "Quantidade mínima é 1"),
});

export type AllocationFormData = z.infer<typeof allocationSchema>;

interface ClientAllocationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: AllocationFormData & { id: number };
}

interface Asset {
  id: number;
  name: string;
  price: number;
}

export function ClientAllocationModal({
  open,
  onOpenChange,
  defaultValues,
}: ClientAllocationModalProps) {
  const { id: clientId } = useParams<{ id: string }>();
  const numericClientId = Number(clientId);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<AllocationFormData>({
    resolver: zodResolver(allocationSchema),
    defaultValues: {
      assetId: "",
      quantity: 1,
    },
  });

  const assetId = watch("assetId");

  const { data: assets = [], isLoading: isLoadingAssets } = useQuery({
    queryKey: ["assets"],
    queryFn: async () => {
      const res = await api.get("/assets");
      return res.data;
    },
  });

  const selectedAsset = useMemo(
    () => assets.find((a: Asset) => a.id.toString() === assetId),
    [assetId, assets]
  );

  const createMutation = useCreateAllocation(numericClientId);
  const updateMutation = useUpdateAllocation(
    numericClientId,
    defaultValues ? Number(defaultValues.assetId) : 0
  );

  function onSubmit(data: AllocationFormData) {
    if (defaultValues) {
      updateMutation.mutate(
        { quantity: data.quantity },
        {
          onSuccess: () => {
            onOpenChange(false);
          },
        }
      );
    } else {
      createMutation.mutate(
        {
          assetId: Number(data.assetId),
          quantity: data.quantity,
        },
        {
          onSuccess: () => {
            onOpenChange(false);
          },
        }
      );
    }
  }

  useEffect(() => {
    if (open) {
      if (defaultValues) {
        reset(defaultValues);
      } else {
        reset({
          assetId: "",
          quantity: 1,
        });
      }
    }
  }, [open, defaultValues, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {defaultValues ? "Editar Alocação" : "Nova Alocação"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Ativo</Label>
            <Select
              value={assetId}
              onValueChange={(value) => setValue("assetId", value)}
              disabled={isLoadingAssets || !!defaultValues}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um ativo" />
              </SelectTrigger>
              <SelectContent>
                {assets.map((asset: Asset) => (
                  <SelectItem key={asset.id} value={String(asset.id)}>
                    {asset.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.assetId && (
              <p className="text-sm text-red-500">{errors.assetId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Preço</Label>
            <Input
              value={
                selectedAsset ? `R$ ${selectedAsset.price.toFixed(2)}` : ""
              }
              disabled
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantidade</Label>
            <Input
              id="quantity"
              type="number"
              min={1}
              {...register("quantity")}
            />
            {errors.quantity && (
              <p className="text-sm text-red-500">{errors.quantity.message}</p>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending
                ? defaultValues
                  ? "Salvando..."
                  : "Criando..."
                : defaultValues
                ? "Salvar"
                : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
