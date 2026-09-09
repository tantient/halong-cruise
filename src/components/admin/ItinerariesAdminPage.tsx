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
  bagList,
  bagText,
  langLabel,
  lines,
  otherLanguages,
  setBag,
  type TranslationBag,
} from "@/components/admin/content-fields";
import {
  CONTENT_STATUSES,
  deleteItineraryAdmin,
  deleteItineraryDayAdmin,
  getItineraryAdmin,
  listItinerariesAdmin,
  saveItineraryAdmin,
  saveItineraryDayAdmin,
} from "@/lib/cms/content.functions";

const num = (v: string) => (v.trim() === "" ? null : Number(v));
const str = (v: unknown) => (typeof v === "string" ? v : v == null ? "" : String(v));

type Highlights = { duration?: string; highlights?: string[]; includes?: string[]; excludes?: string[] };

export function ItinerariesAdminPage() {
  const scope = useShipScope();
  const queryClient = useQueryClient();
  const fetchList = useServerFn(listItinerariesAdmin);
  const remove = useServerFn(deleteItineraryAdmin);
  const [selected, setSelected] = useState<string | "new" | null>(null);

  const shipId = scope.shipId;
  const listQuery = useQuery({
    queryKey: ["cms", "itineraries", shipId],
    queryFn: () => fetchList({ data: { shipId: shipId! } }),
    enabled: !!shipId,
  });
  const invalidate = () => void queryClient.invalidateQueries({ queryKey: ["cms", "itineraries"] });

  const deleteMutation = useMutation({
    mutationFn: (itineraryId: string) => remove({ data: { shipId: shipId!, itineraryId } }),
    onSuccess: () => {
      toast.success("Đã xoá hải trình");
      setSelected(null);
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const items = listQuery.data?.itineraries ?? [];
  const langs = scope.ship ? otherLanguages(scope.ship.enabledLanguages, scope.ship.defaultLanguage) : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Hải trình</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Hành trình và lịch trình từng ngày. Chỉ hải trình “published” xuất hiện trên website.
          </p>
        </div>
        <Button disabled={!shipId} onClick={() => setSelected("new")}>
          Thêm hải trình
        </Button>
      </div>

      <ShipScopeBar ships={scope.ships} shipId={scope.shipId} onSelect={(id) => { scope.select(id); setSelected(null); }} />

      {listQuery.isPending && shipId ? <p className="text-sm text-muted-foreground">Đang tải…</p> : null}
      {listQuery.isError ? <p className="text-sm text-destructive">{(listQuery.error as Error).message}</p> : null}

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Tên</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Ngày/đêm</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Lịch trình</th>
              <th className="px-4 py-3">Thứ tự</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((i) => (
              <tr key={i.id}>
                <td className="px-4 py-3 font-medium">{i.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{i.slug}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {i.days ?? "—"}/{i.nights ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={i.status === "published" ? "live" : "draft"} />
                </td>
                <td className="px-4 py-3 text-muted-foreground">{i.dayCount} ngày</td>
                <td className="px-4 py-3 text-muted-foreground">{i.sort_order}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => setSelected(i.id)}>
                      Sửa
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (window.confirm(`Xoá hải trình “${i.name}”? Lịch trình từng ngày cũng bị xoá.`))
                          deleteMutation.mutate(i.id);
                      }}
                    >
                      Xoá
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && !listQuery.isPending ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  Chưa có hải trình nào.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {shipId && selected === "new" ? (
        <ItineraryForm
          key="new"
          shipId={shipId}
          languages={langs}
          itinerary={null}
          onClose={() => setSelected(null)}
          onSaved={(id) => {
            invalidate();
            setSelected(id);
          }}
        />
      ) : null}

      {shipId && selected && selected !== "new" ? (
        <ItineraryEditor
          key={selected}
          shipId={shipId}
          itineraryId={selected}
          languages={langs}
          onClose={() => setSelected(null)}
          onSaved={invalidate}
        />
      ) : null}
    </div>
  );
}

function ItineraryEditor({
  shipId,
  itineraryId,
  languages,
  onClose,
  onSaved,
}: {
  shipId: string;
  itineraryId: string;
  languages: string[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const fetchOne = useServerFn(getItineraryAdmin);
  const query = useQuery({
    queryKey: ["cms", "itinerary", itineraryId],
    queryFn: () => fetchOne({ data: { shipId, itineraryId } }),
  });

  if (query.isPending) return <p className="text-sm text-muted-foreground">Đang tải hải trình…</p>;
  if (query.isError) return <p className="text-sm text-destructive">{(query.error as Error).message}</p>;

  return (
    <div className="space-y-6">
      <ItineraryForm
        shipId={shipId}
        languages={languages}
        itinerary={query.data!.itinerary}
        onClose={onClose}
        onSaved={() => {
          onSaved();
          void query.refetch();
        }}
      />
      <Card title="Lịch trình từng ngày" description="Mỗi ngày có tiêu đề, mô tả, mốc thời gian và bữa ăn.">
        <DayList
          shipId={shipId}
          itineraryId={itineraryId}
          days={query.data!.days}
          languages={languages}
          onChanged={() => void query.refetch()}
        />
      </Card>
      <Card title="Ảnh của hải trình" description="Ảnh bìa và bộ ảnh lấy từ thư viện ảnh của tàu.">
        <AttachmentsEditor shipId={shipId} entityType="itinerary" entityId={itineraryId} />
      </Card>
    </div>
  );
}

function ItineraryForm({
  shipId,
  languages,
  itinerary,
  onClose,
  onSaved,
}: {
  shipId: string;
  languages: string[];
  itinerary: Record<string, unknown> | null;
  onClose: () => void;
  onSaved: (id: string) => void;
}) {
  const save = useServerFn(saveItineraryAdmin);
  const stored = (itinerary?.['highlights'] as Highlights | undefined) ?? {};
  const [form, setForm] = useState({
    slug: str(itinerary?.['slug']),
    name: str(itinerary?.['name']),
    days: str(itinerary?.['days']),
    nights: str(itinerary?.['nights']),
    departurePoint: str(itinerary?.['departure_point']),
    summary: str(itinerary?.['summary']),
    description: str(itinerary?.['description']),
    priceFrom: str(itinerary?.['price_from']),
    currency: str(itinerary?.['currency']),
    status: str(itinerary?.['status']) || "draft",
    sortOrder: str(itinerary?.['sort_order']) || "0",
    duration: stored.duration ?? "",
    highlights: (stored.highlights ?? []).join("\n"),
    includes: (stored.includes ?? []).join("\n"),
    excludes: (stored.excludes ?? []).join("\n"),
  });
  const [bag, setBagState] = useState<TranslationBag>(
    (itinerary?.['translations'] as TranslationBag | undefined) ?? {},
  );
  const set = (key: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [key]: v }));

  const mutation = useMutation({
    mutationFn: () =>
      save({
        data: {
          shipId,
          ...(itinerary ? { itineraryId: str(itinerary['id']) } : {}),
          slug: form.slug,
          name: form.name,
          days: num(form.days),
          nights: num(form.nights),
          departurePoint: form.departurePoint,
          summary: form.summary,
          description: form.description,
          priceFrom: num(form.priceFrom),
          currency: form.currency,
          status: form.status as "draft" | "published",
          sortOrder: Number(form.sortOrder) || 0,
          highlights: {
            duration: form.duration,
            highlights: lines(form.highlights),
            includes: lines(form.includes),
            excludes: lines(form.excludes),
          },
          translations: bag,
        },
      }),
    onSuccess: (result) => {
      toast.success("Đã lưu hải trình");
      onSaved(result.itineraryId);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Card title={itinerary ? `Sửa hải trình: ${str(itinerary['name'])}` : "Hải trình mới"}>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Tên (ngôn ngữ mặc định)" value={form.name} onChange={set("name")} required />
        <TextField label="Slug" value={form.slug} onChange={set("slug")} />
        <TextField label="Số ngày" value={form.days} onChange={set("days")} type="number" />
        <TextField label="Số đêm" value={form.nights} onChange={set("nights")} type="number" />
        <TextField label="Điểm khởi hành" value={form.departurePoint} onChange={set("departurePoint")} />
        <TextField label="Thời lượng hiển thị" value={form.duration} onChange={set("duration")} hint="ví dụ: 4 hours" />
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
      <AreaField label="Điểm nhấn (mỗi dòng một ý)" value={form.highlights} onChange={set("highlights")} />
      <AreaField label="Bao gồm (mỗi dòng một ý)" value={form.includes} onChange={set("includes")} />
      <AreaField label="Không bao gồm (mỗi dòng một ý)" value={form.excludes} onChange={set("excludes")} />

      {languages.map((lang) => (
        <div key={lang} className="rounded-md border border-border p-4">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Bản dịch — {langLabel(lang)}</p>
          <div className="mt-3 space-y-4">
            <TextField
              label="Tên"
              value={bagText(bag, lang, "name")}
              onChange={(v) => setBagState((b) => setBag(b, lang, "name", v))}
            />
            <TextField
              label="Điểm khởi hành"
              value={bagText(bag, lang, "departure_point")}
              onChange={(v) => setBagState((b) => setBag(b, lang, "departure_point", v))}
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
            <TextField
              label="Thời lượng hiển thị"
              value={bagText(bag, lang, "duration")}
              onChange={(v) => setBagState((b) => setBag(b, lang, "duration", v))}
            />
            {(["highlights", "includes", "excludes"] as const).map((key) => (
              <AreaField
                key={key}
                label={`${key} (mỗi dòng một ý)`}
                value={bagList(bag, lang, key)}
                onChange={(v) => setBagState((b) => setBag(b, lang, key, lines(v)))}
              />
            ))}
          </div>
        </div>
      ))}

      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onClose}>
          Đóng
        </Button>
        <Button size="sm" disabled={mutation.isPending} onClick={() => mutation.mutate()}>
          {mutation.isPending ? "Đang lưu…" : "Lưu hải trình"}
        </Button>
      </div>
    </Card>
  );
}

function DayList({
  shipId,
  itineraryId,
  days,
  languages,
  onChanged,
}: {
  shipId: string;
  itineraryId: string;
  days: Record<string, unknown>[];
  languages: string[];
  onChanged: () => void;
}) {
  const save = useServerFn(saveItineraryDayAdmin);
  const remove = useServerFn(deleteItineraryDayAdmin);

  const addMutation = useMutation({
    mutationFn: () =>
      save({
        data: {
          shipId,
          itineraryId,
          dayNumber: days.length + 1,
          title: "",
          description: "",
          timeline: [],
          meals: "",
          sortOrder: days.length,
          translations: {},
        },
      }),
    onSuccess: () => {
      toast.success("Đã thêm ngày");
      onChanged();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (dayId: string) => remove({ data: { shipId, dayId } }),
    onSuccess: () => {
      toast.success("Đã xoá ngày");
      onChanged();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-4">
      {days.length === 0 ? <p className="text-xs text-muted-foreground">Chưa có ngày nào.</p> : null}
      {days.map((d) => (
        <DayForm
          key={str(d['id'])}
          shipId={shipId}
          itineraryId={itineraryId}
          day={d}
          languages={languages}
          onChanged={onChanged}
          onDelete={() => {
            if (window.confirm("Xoá ngày này?")) deleteMutation.mutate(str(d['id']));
          }}
        />
      ))}
      <div className="flex justify-end">
        <Button size="sm" variant="outline" disabled={addMutation.isPending} onClick={() => addMutation.mutate()}>
          Thêm ngày
        </Button>
      </div>
    </div>
  );
}

function timelineText(value: unknown): string {
  if (!Array.isArray(value)) return "";
  return value
    .map((e) => {
      const entry = (e ?? {}) as Record<string, unknown>;
      const time = str(entry['time']);
      const label = str(entry['label']);
      return time ? `${time} | ${label}` : label;
    })
    .join("\n");
}

function parseTimeline(text: string) {
  return lines(text).map((line) => {
    const idx = line.indexOf("|");
    if (idx === -1) return { time: "", label: line };
    return { time: line.slice(0, idx).trim(), label: line.slice(idx + 1).trim() };
  });
}

function DayForm({
  shipId,
  itineraryId,
  day,
  languages,
  onChanged,
  onDelete,
}: {
  shipId: string;
  itineraryId: string;
  day: Record<string, unknown>;
  languages: string[];
  onChanged: () => void;
  onDelete: () => void;
}) {
  const save = useServerFn(saveItineraryDayAdmin);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    dayNumber: str(day['day_number']) || "1",
    title: str(day['title']),
    description: str(day['description']),
    meals: str(day['meals']),
    sortOrder: str(day['sort_order']) || "0",
    timeline: timelineText(day['timeline']),
  });
  const [bag, setBagState] = useState<TranslationBag>((day['translations'] as TranslationBag | undefined) ?? {});

  const mutation = useMutation({
    mutationFn: () =>
      save({
        data: {
          shipId,
          itineraryId,
          dayId: str(day['id']),
          dayNumber: Number(form.dayNumber) || 1,
          title: form.title,
          description: form.description,
          meals: form.meals,
          timeline: parseTimeline(form.timeline),
          sortOrder: Number(form.sortOrder) || 0,
          translations: bag,
        },
      }),
    onSuccess: () => {
      toast.success("Đã lưu ngày");
      onChanged();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="rounded-md border border-border p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium">
          Ngày {form.dayNumber}
          {form.title ? ` — ${form.title}` : ""}
        </p>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => setOpen((o) => !o)}>
            {open ? "Thu gọn" : "Sửa"}
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete}>
            Xoá
          </Button>
        </div>
      </div>

      {open ? (
        <div className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <TextField label="Ngày số" value={form.dayNumber} onChange={(v) => setForm({ ...form, dayNumber: v })} type="number" />
            <TextField label="Thứ tự" value={form.sortOrder} onChange={(v) => setForm({ ...form, sortOrder: v })} type="number" />
            <TextField label="Bữa ăn" value={form.meals} onChange={(v) => setForm({ ...form, meals: v })} />
          </div>
          <TextField label="Tiêu đề" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
          <AreaField label="Mô tả" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />
          <AreaField
            label="Mốc thời gian"
            hint="mỗi dòng: thời gian | nội dung"
            value={form.timeline}
            onChange={(v) => setForm({ ...form, timeline: v })}
            rows={6}
          />

          {languages.map((lang) => (
            <div key={lang} className="rounded-md border border-border p-3">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Bản dịch — {langLabel(lang)}</p>
              <div className="mt-3 space-y-3">
                <TextField
                  label="Tiêu đề"
                  value={bagText(bag, lang, "title")}
                  onChange={(v) => setBagState((b) => setBag(b, lang, "title", v))}
                />
                <AreaField
                  label="Mô tả"
                  value={bagText(bag, lang, "description")}
                  onChange={(v) => setBagState((b) => setBag(b, lang, "description", v))}
                />
                <TextField
                  label="Bữa ăn"
                  value={bagText(bag, lang, "meals")}
                  onChange={(v) => setBagState((b) => setBag(b, lang, "meals", v))}
                />
              </div>
            </div>
          ))}

          <div className="flex justify-end">
            <Button size="sm" disabled={mutation.isPending} onClick={() => mutation.mutate()}>
              Lưu ngày
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
