import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, SelectField, StatusBadge, TextField } from "@/components/admin/admin-ui";
import { AttachmentsEditor } from "@/components/admin/AttachmentsEditor";
import { ShipScopeBar } from "@/components/admin/ShipScopeBar";
import { useShipScope } from "@/components/admin/use-ship-scope";
import {
  AreaField,
  bagText,
  langLabel,
  otherLanguages,
  setBag,
  type TranslationBag,
} from "@/components/admin/content-fields";
import {
  deleteVenueAdmin,
  listVenuesAdmin,
  saveVenueAdmin,
  VENUE_STATUSES,
} from "@/lib/cms/venues.functions";

type VenueRow = {
  id: string;
  stable_key: string;
  category: string;
  parent_key: string | null;
  functional_name: string;
  commercial_name: string | null;
  location: string | null;
  area_sqm: number | null;
  capacity: number | null;
  capacity_unit: string;
  spec_note: string | null;
  function_text: string | null;
  access_type: string | null;
  summary: string | null;
  description: string | null;
  show_public: boolean;
  show_area: boolean;
  show_capacity: boolean;
  status: string;
  sort_order: number;
  translations: unknown;
};

const num = (v: string) => (v.trim() === "" ? null : Number(v));
const str = (v: unknown) => (typeof v === "string" ? v : v == null ? "" : String(v));

/**
 * Venues are the real named places aboard a ship. Only the presentation fields
 * are editable here; the stable key keeps links and photos attached through a
 * commercial rename, and the three visibility switches decide what the public
 * site is allowed to state.
 */
export function VenuesAdminPage() {
  const scope = useShipScope();
  const queryClient = useQueryClient();
  const fetchVenues = useServerFn(listVenuesAdmin);
  const remove = useServerFn(deleteVenueAdmin);
  const [selected, setSelected] = useState<string | "new" | null>(null);

  const shipId = scope.shipId;
  const listQuery = useQuery({
    queryKey: ["cms", "venues", shipId],
    queryFn: () => fetchVenues({ data: { shipId: shipId! } }),
    enabled: !!shipId,
  });

  const invalidate = () => void queryClient.invalidateQueries({ queryKey: ["cms", "venues"] });

  const deleteMutation = useMutation({
    mutationFn: (venueId: string) => remove({ data: { shipId: shipId!, venueId } }),
    onSuccess: () => {
      toast.success("Đã xoá địa điểm");
      setSelected(null);
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const venues = (listQuery.data?.venues ?? []) as VenueRow[];
  const editing = selected && selected !== "new" ? venues.find((v) => v.id === selected) ?? null : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Địa điểm trên tàu</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Nhà hàng, bar, hồ bơi, spa, phòng chức năng… Chỉ địa điểm “published” và được bật hiển
            thị mới xuất hiện trên website.
          </p>
        </div>
        <Button disabled={!shipId} onClick={() => setSelected("new")}>
          Thêm địa điểm
        </Button>
      </div>

      <ShipScopeBar
        ships={scope.ships}
        shipId={scope.shipId}
        onSelect={(id) => {
          scope.select(id);
          setSelected(null);
        }}
      />

      {listQuery.isPending && shipId ? <p className="text-sm text-muted-foreground">Đang tải…</p> : null}
      {listQuery.isError ? (
        <p className="text-sm text-destructive">{(listQuery.error as Error).message}</p>
      ) : null}

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Tên</th>
              <th className="px-4 py-3">Mã</th>
              <th className="px-4 py-3">Nhóm</th>
              <th className="px-4 py-3">Vị trí</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Hiển thị</th>
              <th className="px-4 py-3">Thứ tự</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {venues.map((v) => (
              <tr key={v.id}>
                <td className="px-4 py-3 font-medium">{v.commercial_name ?? v.functional_name}</td>
                <td className="px-4 py-3 text-muted-foreground">{v.stable_key}</td>
                <td className="px-4 py-3 text-muted-foreground">{v.category}</td>
                <td className="px-4 py-3 text-muted-foreground">{v.location ?? "—"}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={v.status === "published" ? "live" : "draft"} />
                </td>
                <td className="px-4 py-3 text-muted-foreground">{v.show_public ? "Có" : "Ẩn"}</td>
                <td className="px-4 py-3 text-muted-foreground">{v.sort_order}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => setSelected(v.id)}>
                      Sửa
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Xoá “${v.commercial_name ?? v.functional_name}”? Ảnh gắn kèm cũng bị bỏ.`,
                          )
                        )
                          deleteMutation.mutate(v.id);
                      }}
                    >
                      Xoá
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {!listQuery.isPending && venues.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-muted-foreground">
                  Chưa có địa điểm nào cho tàu này.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {shipId && selected ? (
        <VenueForm
          key={editing?.id ?? "new"}
          shipId={shipId}
          enabledLanguages={scope.ship?.enabledLanguages ?? ["en"]}
          defaultLanguage={scope.ship?.defaultLanguage ?? "en"}
          venue={editing}
          onDone={() => {
            setSelected(null);
            invalidate();
          }}
          onCancel={() => setSelected(null)}
        />
      ) : null}
    </div>
  );
}

function VenueForm({
  shipId,
  venue,
  enabledLanguages,
  defaultLanguage,
  onDone,
  onCancel,
}: {
  shipId: string;
  venue: VenueRow | null;
  enabledLanguages: string[];
  defaultLanguage: string;
  onDone: () => void;
  onCancel: () => void;
}) {
  const save = useServerFn(saveVenueAdmin);
  const others = useMemo(
    () => otherLanguages(enabledLanguages, defaultLanguage),
    [enabledLanguages, defaultLanguage],
  );

  const [stableKey, setStableKey] = useState(venue?.stable_key ?? "");
  const [category, setCategory] = useState(venue?.category ?? "");
  const [parentKey, setParentKey] = useState(venue?.parent_key ?? "");
  const [functionalName, setFunctionalName] = useState(venue?.functional_name ?? "");
  const [commercialName, setCommercialName] = useState(str(venue?.commercial_name));
  const [location, setLocation] = useState(str(venue?.location));
  const [areaSqm, setAreaSqm] = useState(venue?.area_sqm == null ? "" : String(venue.area_sqm));
  const [capacity, setCapacity] = useState(venue?.capacity == null ? "" : String(venue.capacity));
  const [capacityUnit, setCapacityUnit] = useState(venue?.capacity_unit ?? "guests");
  const [specNote, setSpecNote] = useState(str(venue?.spec_note));
  const [functionText, setFunctionText] = useState(str(venue?.function_text));
  const [accessType, setAccessType] = useState(str(venue?.access_type));
  const [summary, setSummary] = useState(str(venue?.summary));
  const [description, setDescription] = useState(str(venue?.description));
  const [showPublic, setShowPublic] = useState(venue?.show_public ?? true);
  const [showArea, setShowArea] = useState(venue?.show_area ?? false);
  const [showCapacity, setShowCapacity] = useState(venue?.show_capacity ?? false);
  const [status, setStatus] = useState(venue?.status === "draft" ? "draft" : "published");
  const [sortOrder, setSortOrder] = useState(String(venue?.sort_order ?? 0));
  const [bag, setBagState] = useState<TranslationBag>(
    (venue?.translations as TranslationBag) ?? ({} as TranslationBag),
  );

  const mutation = useMutation({
    mutationFn: () =>
      save({
        data: {
          shipId,
          ...(venue ? { venueId: venue.id } : {}),
          stableKey,
          category,
          parentKey,
          functionalName,
          commercialName,
          location,
          areaSqm: num(areaSqm),
          capacity: capacity.trim() === "" ? null : Math.trunc(Number(capacity)),
          capacityUnit,
          specNote,
          functionText,
          accessType,
          summary,
          description,
          showPublic,
          showArea,
          showCapacity,
          status: status as (typeof VENUE_STATUSES)[number],
          sortOrder: Number(sortOrder) || 0,
          translations: bag as Record<string, Record<string, string>>,
        },
      }),
    onSuccess: () => {
      toast.success("Đã lưu địa điểm");
      onDone();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate();
      }}
    >
      <Card
        title={venue ? `Sửa: ${venue.commercial_name ?? venue.functional_name}` : "Địa điểm mới"}
        description="Mã địa điểm là danh tính cố định — đổi tên thương mại không làm mất ảnh hay đường dẫn."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Mã địa điểm" value={stableKey} onChange={setStableKey} required />
          <TextField
            label="Nhóm trải nghiệm"
            value={category}
            onChange={setCategory}
            hint="Trùng với slug của nhóm, ví dụ dining, bars-lounges, pool."
            required
          />
          <TextField label="Tên chức năng" value={functionalName} onChange={setFunctionalName} required />
          <TextField label="Tên thương mại" value={commercialName} onChange={setCommercialName} />
          <TextField label="Vị trí" value={location} onChange={setLocation} />
          <TextField label="Nằm trong địa điểm (mã)" value={parentKey} onChange={setParentKey} />
          <TextField label="Diện tích (m²)" value={areaSqm} onChange={setAreaSqm} type="number" />
          <TextField label="Sức chứa" value={capacity} onChange={setCapacity} type="number" />
          <TextField label="Đơn vị sức chứa" value={capacityUnit} onChange={setCapacityUnit} />
          <TextField label="Ghi chú thông số" value={specNote} onChange={setSpecNote} />
          <TextField label="Chức năng" value={functionText} onChange={setFunctionText} />
          <TextField label="Hình thức sử dụng" value={accessType} onChange={setAccessType} />
          <SelectField
            label="Trạng thái"
            value={status}
            onChange={setStatus}
            options={VENUE_STATUSES.map((s) => ({ value: s, label: s }))}
          />
          <TextField label="Thứ tự" value={sortOrder} onChange={setSortOrder} type="number" />
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <AreaField label="Mô tả ngắn" value={summary} onChange={setSummary} rows={3} />
          <AreaField label="Mô tả chi tiết" value={description} onChange={setDescription} rows={3} />
        </div>

        <div className="mt-4 flex flex-wrap gap-6">
          <Toggle label="Hiện trên website" checked={showPublic} onChange={setShowPublic} />
          <Toggle label="Công bố diện tích" checked={showArea} onChange={setShowArea} />
          <Toggle label="Công bố sức chứa" checked={showCapacity} onChange={setShowCapacity} />
        </div>
      </Card>

      {others.map((lang) => (
        <Card key={lang} title={`Bản dịch — ${langLabel(lang)}`}>
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              label="Tên thương mại"
              value={bagText(bag, lang, "commercial_name")}
              onChange={(v) => setBagState(setBag(bag, lang, "commercial_name", v))}
            />
            <TextField
              label="Tên chức năng"
              value={bagText(bag, lang, "functional_name")}
              onChange={(v) => setBagState(setBag(bag, lang, "functional_name", v))}
            />
            <TextField
              label="Vị trí"
              value={bagText(bag, lang, "location")}
              onChange={(v) => setBagState(setBag(bag, lang, "location", v))}
            />
            <TextField
              label="Chức năng"
              value={bagText(bag, lang, "function_text")}
              onChange={(v) => setBagState(setBag(bag, lang, "function_text", v))}
            />
            <TextField
              label="Hình thức sử dụng"
              value={bagText(bag, lang, "access_type")}
              onChange={(v) => setBagState(setBag(bag, lang, "access_type", v))}
            />
            <TextField
              label="Ghi chú thông số"
              value={bagText(bag, lang, "spec_note")}
              onChange={(v) => setBagState(setBag(bag, lang, "spec_note", v))}
            />
            <AreaField
              label="Mô tả ngắn"
              value={bagText(bag, lang, "summary")}
              onChange={(v) => setBagState(setBag(bag, lang, "summary", v))}
              rows={3}
            />
            <AreaField
              label="Mô tả chi tiết"
              value={bagText(bag, lang, "description")}
              onChange={(v) => setBagState(setBag(bag, lang, "description", v))}
              rows={3}
            />
          </div>
        </Card>
      ))}

      {venue ? (
        <Card title="Ảnh" description="Ảnh cover và thư viện của địa điểm này.">
          <AttachmentsEditor shipId={shipId} entityType="venue" entityId={venue.id} />
        </Card>
      ) : null}

      <div className="flex gap-3">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Đang lưu…" : "Lưu"}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Huỷ
        </Button>
      </div>
    </form>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-border"
      />
      {label}
    </label>
  );
}
