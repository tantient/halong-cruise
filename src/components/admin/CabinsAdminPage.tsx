import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
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
  CONTENT_STATUSES,
  deleteCabinAdmin,
  deleteCabinDetailAdmin,
  getCabinAdmin,
  listCabinsAdmin,
  saveCabinAdmin,
  saveCabinDetailAdmin,
} from "@/lib/cms/content.functions";

const num = (v: string) => (v.trim() === "" ? null : Number(v));
const str = (v: unknown) => (typeof v === "string" ? v : v == null ? "" : String(v));

export function CabinsAdminPage() {
  const scope = useShipScope();
  const queryClient = useQueryClient();
  const fetchCabins = useServerFn(listCabinsAdmin);
  const remove = useServerFn(deleteCabinAdmin);
  const [selected, setSelected] = useState<string | "new" | null>(null);

  const shipId = scope.shipId;
  const listQuery = useQuery({
    queryKey: ["cms", "cabins", shipId],
    queryFn: () => fetchCabins({ data: { shipId: shipId! } }),
    enabled: !!shipId,
  });

  const invalidate = () => void queryClient.invalidateQueries({ queryKey: ["cms", "cabins"] });

  const deleteMutation = useMutation({
    mutationFn: (cabinId: string) => remove({ data: { shipId: shipId!, cabinId } }),
    onSuccess: () => {
      toast.success("Đã xoá phòng");
      setSelected(null);
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const cabins = listQuery.data?.cabins ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Phòng nghỉ</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Danh sách phòng của tàu đang chọn. Chỉ phòng “published” xuất hiện trên website.
          </p>
        </div>
        <Button disabled={!shipId} onClick={() => setSelected("new")}>
          Thêm phòng
        </Button>
      </div>

      <ShipScopeBar ships={scope.ships} shipId={scope.shipId} onSelect={(id) => { scope.select(id); setSelected(null); }} />

      {listQuery.isPending && shipId ? <p className="text-sm text-muted-foreground">Đang tải…</p> : null}
      {listQuery.isError ? (
        <p className="text-sm text-destructive">{(listQuery.error as Error).message}</p>
      ) : null}

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Tên</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Loại</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Thông số</th>
              <th className="px-4 py-3">Thứ tự</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {cabins.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.slug}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.category ?? "—"}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={c.status === "published" ? "live" : "draft"} />
                </td>
                <td className="px-4 py-3 text-muted-foreground">{c.detailCount}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.sort_order}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => setSelected(c.id)}>
                      Sửa
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (window.confirm(`Xoá phòng “${c.name}”? Thông số và ảnh gắn kèm cũng bị bỏ.`))
                          deleteMutation.mutate(c.id);
                      }}
                    >
                      Xoá
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {cabins.length === 0 && !listQuery.isPending ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  Chưa có phòng nào.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {shipId && selected === "new" ? (
        <CabinForm
          key="new"
          shipId={shipId}
          languages={scope.ship ? otherLanguages(scope.ship.enabledLanguages, scope.ship.defaultLanguage) : []}
          cabin={null}
          onClose={() => setSelected(null)}
          onSaved={(id) => {
            invalidate();
            setSelected(id);
          }}
        />
      ) : null}

      {shipId && selected && selected !== "new" ? (
        <CabinEditor
          key={selected}
          shipId={shipId}
          cabinId={selected}
          languages={scope.ship ? otherLanguages(scope.ship.enabledLanguages, scope.ship.defaultLanguage) : []}
          onClose={() => setSelected(null)}
          onSaved={invalidate}
        />
      ) : null}
    </div>
  );
}

function CabinEditor({
  shipId,
  cabinId,
  languages,
  onClose,
  onSaved,
}: {
  shipId: string;
  cabinId: string;
  languages: string[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const fetchCabin = useServerFn(getCabinAdmin);
  const query = useQuery({
    queryKey: ["cms", "cabin", cabinId],
    queryFn: () => fetchCabin({ data: { shipId, cabinId } }),
  });

  if (query.isPending) return <p className="text-sm text-muted-foreground">Đang tải phòng…</p>;
  if (query.isError) return <p className="text-sm text-destructive">{(query.error as Error).message}</p>;

  return (
    <div className="space-y-6">
      <CabinForm
        shipId={shipId}
        languages={languages}
        cabin={query.data!.cabin}
        onClose={onClose}
        onSaved={() => {
          onSaved();
          void query.refetch();
        }}
      />
      <Card title="Thông số & tiện nghi" description="Từng dòng thông tin hiển thị trong trang phòng.">
        <CabinDetails shipId={shipId} cabinId={cabinId} details={query.data!.details} languages={languages} onChanged={() => void query.refetch()} />
      </Card>
      <Card title="Ảnh của phòng" description="Ảnh bìa và bộ ảnh lấy từ thư viện ảnh của tàu.">
        <AttachmentsEditor shipId={shipId} entityType="cabin" entityId={cabinId} />
      </Card>
    </div>
  );
}

function CabinForm({
  shipId,
  languages,
  cabin,
  onClose,
  onSaved,
}: {
  shipId: string;
  languages: string[];
  cabin: Record<string, unknown> | null;
  onClose: () => void;
  onSaved: (cabinId: string) => void;
}) {
  const save = useServerFn(saveCabinAdmin);
  const [form, setForm] = useState({
    slug: str(cabin?.['slug']),
    name: str(cabin?.['name']),
    category: str(cabin?.['category']),
    sizeSqm: str(cabin?.['size_sqm']),
    maxGuests: str(cabin?.['max_guests']),
    bedConfig: str(cabin?.['bed_config']),
    viewType: str(cabin?.['view_type']),
    deck: str(cabin?.['deck']),
    summary: str(cabin?.['summary']),
    description: str(cabin?.['description']),
    priceFrom: str(cabin?.['price_from']),
    currency: str(cabin?.['currency']),
    status: str(cabin?.['status']) || "draft",
    sortOrder: str(cabin?.['sort_order']) || "0",
  });
  const [bag, setBagState] = useState<TranslationBag>(
    (cabin?.['translations'] as TranslationBag | undefined) ?? {},
  );

  const set = (key: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [key]: v }));

  const mutation = useMutation({
    mutationFn: () =>
      save({
        data: {
          shipId,
          ...(cabin ? { cabinId: str(cabin['id']) } : {}),
          slug: form.slug,
          name: form.name,
          category: form.category,
          sizeSqm: num(form.sizeSqm),
          maxGuests: num(form.maxGuests),
          bedConfig: form.bedConfig,
          viewType: form.viewType,
          deck: form.deck,
          summary: form.summary,
          description: form.description,
          priceFrom: num(form.priceFrom),
          currency: form.currency,
          status: form.status as "draft" | "published",
          sortOrder: Number(form.sortOrder) || 0,
          translations: bag,
        },
      }),
    onSuccess: (result) => {
      toast.success("Đã lưu phòng");
      onSaved(result.cabinId);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Card title={cabin ? `Sửa phòng: ${str(cabin['name'])}` : "Phòng mới"}>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Tên (ngôn ngữ mặc định)" value={form.name} onChange={set("name")} required />
        <TextField label="Slug" value={form.slug} onChange={set("slug")} hint="dùng trong địa chỉ trang" />
        <TextField label="Loại phòng" value={form.category} onChange={set("category")} />
        <TextField label="Tầng / deck" value={form.deck} onChange={set("deck")} />
        <TextField label="Diện tích (m²)" value={form.sizeSqm} onChange={set("sizeSqm")} type="number" />
        <TextField label="Số khách tối đa" value={form.maxGuests} onChange={set("maxGuests")} type="number" />
        <TextField label="Giường" value={form.bedConfig} onChange={set("bedConfig")} />
        <TextField label="Tầm nhìn" value={form.viewType} onChange={set("viewType")} />
        <TextField label="Giá từ" value={form.priceFrom} onChange={set("priceFrom")} type="number" />
        <TextField label="Tiền tệ" value={form.currency} onChange={set("currency")} />
        <SelectField
          label="Trạng thái"
          value={form.status}
          onChange={set("status")}
          options={CONTENT_STATUSES.map((s) => ({ value: s, label: s }))}
        />
        <TextField label="Thứ tự" value={form.sortOrder} onChange={set("sortOrder")} type="number" />
      </div>
      <AreaField label="Mô tả ngắn" value={form.summary} onChange={set("summary")} />
      <AreaField label="Mô tả chi tiết" value={form.description} onChange={set("description")} rows={6} />

      {languages.map((lang) => (
        <div key={lang} className="rounded-md border border-border p-4">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Bản dịch — {langLabel(lang)}
          </p>
          <div className="mt-3 space-y-4">
            <TextField
              label="Tên"
              value={bagText(bag, lang, "name")}
              onChange={(v) => setBagState((b) => setBag(b, lang, "name", v))}
            />
            <TextField
              label="Loại phòng"
              value={bagText(bag, lang, "category")}
              onChange={(v) => setBagState((b) => setBag(b, lang, "category", v))}
            />
            <AreaField
              label="Mô tả ngắn"
              value={bagText(bag, lang, "summary")}
              onChange={(v) => setBagState((b) => setBag(b, lang, "summary", v))}
            />
            <AreaField
              label="Mô tả chi tiết"
              value={bagText(bag, lang, "description")}
              onChange={(v) => setBagState((b) => setBag(b, lang, "description", v))}
              rows={5}
            />
          </div>
        </div>
      ))}

      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onClose}>
          Đóng
        </Button>
        <Button size="sm" disabled={mutation.isPending} onClick={() => mutation.mutate()}>
          {mutation.isPending ? "Đang lưu…" : "Lưu phòng"}
        </Button>
      </div>
    </Card>
  );
}

function CabinDetails({
  shipId,
  cabinId,
  details,
  languages,
  onChanged,
}: {
  shipId: string;
  cabinId: string;
  details: Record<string, unknown>[];
  languages: string[];
  onChanged: () => void;
}) {
  const save = useServerFn(saveCabinDetailAdmin);
  const remove = useServerFn(deleteCabinDetailAdmin);
  const [draft, setDraft] = useState({ groupName: "", label: "", value: "", contentType: "amenity", sortOrder: "0" });

  const addMutation = useMutation({
    mutationFn: () =>
      save({
        data: {
          shipId,
          cabinId,
          groupName: draft.groupName,
          label: draft.label,
          value: draft.value,
          contentType: draft.contentType,
          sortOrder: Number(draft.sortOrder) || 0,
          translations: {},
        },
      }),
    onSuccess: () => {
      toast.success("Đã thêm dòng thông số");
      setDraft({ groupName: "", label: "", value: "", contentType: draft.contentType, sortOrder: "0" });
      onChanged();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (detailId: string) => remove({ data: { shipId, detailId } }),
    onSuccess: () => {
      toast.success("Đã xoá dòng");
      onChanged();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-md border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-3 py-2">Nhóm</th>
              <th className="px-3 py-2">Nhãn</th>
              <th className="px-3 py-2">Giá trị</th>
              <th className="px-3 py-2">Kiểu</th>
              <th className="px-3 py-2">Thứ tự</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {details.map((d) => (
              <DetailRow
                key={str(d['id'])}
                shipId={shipId}
                cabinId={cabinId}
                detail={d}
                languages={languages}
                onChanged={onChanged}
                onDelete={() => deleteMutation.mutate(str(d['id']))}
              />
            ))}
            {details.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center text-muted-foreground">
                  Chưa có thông số.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 sm:grid-cols-5">
        <TextField label="Nhóm" value={draft.groupName} onChange={(v) => setDraft({ ...draft, groupName: v })} />
        <TextField label="Nhãn" value={draft.label} onChange={(v) => setDraft({ ...draft, label: v })} />
        <TextField label="Giá trị" value={draft.value} onChange={(v) => setDraft({ ...draft, value: v })} />
        <TextField label="Kiểu" value={draft.contentType} onChange={(v) => setDraft({ ...draft, contentType: v })} />
        <TextField label="Thứ tự" value={draft.sortOrder} onChange={(v) => setDraft({ ...draft, sortOrder: v })} type="number" />
      </div>
      <div className="flex justify-end">
        <Button size="sm" disabled={!draft.label || addMutation.isPending} onClick={() => addMutation.mutate()}>
          Thêm dòng
        </Button>
      </div>
    </div>
  );
}

function DetailRow({
  shipId,
  cabinId,
  detail,
  languages,
  onChanged,
  onDelete,
}: {
  shipId: string;
  cabinId: string;
  detail: Record<string, unknown>;
  languages: string[];
  onChanged: () => void;
  onDelete: () => void;
}) {
  const save = useServerFn(saveCabinDetailAdmin);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    groupName: str(detail['group_name']),
    label: str(detail['label']),
    value: str(detail['value']),
    contentType: str(detail['content_type']),
    sortOrder: str(detail['sort_order']),
  });
  const [bag, setBagState] = useState<TranslationBag>(
    (detail['translations'] as TranslationBag | undefined) ?? {},
  );

  const mutation = useMutation({
    mutationFn: () =>
      save({
        data: {
          shipId,
          cabinId,
          detailId: str(detail['id']),
          groupName: form.groupName,
          label: form.label,
          value: form.value,
          contentType: form.contentType,
          sortOrder: Number(form.sortOrder) || 0,
          translations: bag,
        },
      }),
    onSuccess: () => {
      toast.success("Đã lưu dòng");
      setOpen(false);
      onChanged();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <>
      <tr>
        <td className="px-3 py-2 text-muted-foreground">{form.groupName || "—"}</td>
        <td className="px-3 py-2">{form.label}</td>
        <td className="px-3 py-2 text-muted-foreground">{form.value || "—"}</td>
        <td className="px-3 py-2 text-muted-foreground">{form.contentType}</td>
        <td className="px-3 py-2 text-muted-foreground">{form.sortOrder}</td>
        <td className="px-3 py-2">
          <div className="flex justify-end gap-1">
            <Button variant="ghost" size="sm" onClick={() => setOpen((o) => !o)}>
              {open ? "Thu gọn" : "Sửa"}
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete}>
              Xoá
            </Button>
          </div>
        </td>
      </tr>
      {open ? (
        <tr>
          <td colSpan={6} className="bg-muted/30 px-3 py-4">
            <div className="grid gap-3 sm:grid-cols-5">
              <TextField label="Nhóm" value={form.groupName} onChange={(v) => setForm({ ...form, groupName: v })} />
              <TextField label="Nhãn" value={form.label} onChange={(v) => setForm({ ...form, label: v })} />
              <TextField label="Giá trị" value={form.value} onChange={(v) => setForm({ ...form, value: v })} />
              <TextField label="Kiểu" value={form.contentType} onChange={(v) => setForm({ ...form, contentType: v })} />
              <TextField label="Thứ tự" value={form.sortOrder} onChange={(v) => setForm({ ...form, sortOrder: v })} type="number" />
            </div>
            {languages.map((lang) => (
              <div key={lang} className="mt-3 grid gap-3 sm:grid-cols-2">
                <TextField
                  label={`Nhãn (${langLabel(lang)})`}
                  value={bagText(bag, lang, "label")}
                  onChange={(v) => setBagState((b) => setBag(b, lang, "label", v))}
                />
                <TextField
                  label={`Giá trị (${langLabel(lang)})`}
                  value={bagText(bag, lang, "value")}
                  onChange={(v) => setBagState((b) => setBag(b, lang, "value", v))}
                />
              </div>
            ))}
            <div className="mt-3 flex justify-end">
              <Button size="sm" disabled={mutation.isPending} onClick={() => mutation.mutate()}>
                Lưu dòng
              </Button>
            </div>
          </td>
        </tr>
      ) : null}
    </>
  );
}
