import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";

import {
  ShipGeneralForm,
  emptyShipValues,
  type ShipGeneralValues,
} from "@/components/admin/ShipGeneralForm";
import { createShipAdmin } from "@/lib/cms/ships.functions";

export function ShipCreatePage() {
  const navigate = useNavigate();
  const create = useServerFn(createShipAdmin);
  const [values, setValues] = useState<ShipGeneralValues>(emptyShipValues);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (input: ShipGeneralValues) =>
      create({
        data: {
          name: input.name,
          displayName: input.displayName,
          slug: input.slug,
          tagline: input.tagline,
          status: input.status,
          layout: input.layout,
          defaultLanguage: input.defaultLanguage,
          enabledLanguages: input.enabledLanguages,
          currency: input.currency,
          sortOrder: input.sortOrder,
          totalCabins: input.totalCabins === "" ? null : Number(input.totalCabins),
          translations: input.translations,
        },
      } as never),
    onSuccess: (result: { shipId: string }) => {
      toast.success("Đã tạo tàu mới");
      navigate({ to: "/admin/ships/$shipId", params: { shipId: result.shipId } });
    },
    onError: (err) => setError(err instanceof Error ? err.message : "Tạo tàu thất bại"),
  });

  return (
    <div className="space-y-6">
      <div>
        <Link to="/admin/ships" className="text-xs text-muted-foreground hover:underline">
          ← Danh sách tàu
        </Link>
        <h1 className="mt-2 text-xl font-semibold">Tạo tàu mới</h1>
      </div>
      <ShipGeneralForm
        values={values}
        onChange={(v) => {
          setError(null);
          setValues(v);
        }}
        onSubmit={() => mutation.mutate(values)}
        submitting={mutation.isPending}
        submitLabel="Tạo tàu"
        error={error}
      />
    </div>
  );
}
