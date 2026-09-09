import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, Field, SelectField, TextField } from "@/components/admin/admin-ui";
import { ShipGeneralForm, type ShipGeneralValues } from "@/components/admin/ShipGeneralForm";
import {
  deleteShipDomain,
  getShipAdmin,
  saveShipBranding,
  saveShipDomain,
  saveShipSeo,
  saveShipSettings,
  updateShipAdmin,
} from "@/lib/cms/ships.functions";

const TABS = [
  { id: "general", label: "Tổng quát" },
  { id: "branding", label: "Thương hiệu" },
  { id: "settings", label: "Liên hệ" },
  { id: "domains", label: "Tên miền" },
  { id: "seo", label: "SEO" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const str = (v: unknown) => (typeof v === "string" ? v : v == null ? "" : String(v));
const record = (v: unknown) =>
  v && typeof v === "object" && !Array.isArray(v)
    ? (v as Record<string, Record<string, string>>)
    : {};

export function ShipEditor({ shipId }: { shipId: string }) {
  const queryClient = useQueryClient();
  const fetchShip = useServerFn(getShipAdmin);
  const [tab, setTab] = useState<TabId>("general");

  const shipQuery = useQuery({
    queryKey: ["cms", "ship", shipId],
    queryFn: () => fetchShip({ data: { shipId } }),
  });

  if (shipQuery.isPending) return <p className="text-sm text-muted-foreground">Đang tải…</p>;
  if (shipQuery.isError)
    return <p className="text-sm text-destructive">{(shipQuery.error as Error).message}</p>;

  const payload = shipQuery.data!;
  const invalidate = () => void queryClient.invalidateQueries({ queryKey: ["cms"] });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 border-b border-border pb-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-md px-3 py-1.5 text-sm ${
              tab === t.id ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "general" ? <GeneralTab shipId={shipId} ship={payload.ship} onSaved={invalidate} /> : null}
      {tab === "branding" ? (
        <BrandingTab shipId={shipId} branding={payload.branding} onSaved={invalidate} />
      ) : null}
      {tab === "settings" ? (
        <SettingsTab shipId={shipId} settings={payload.settings} onSaved={invalidate} />
      ) : null}
      {tab === "domains" ? (
        <DomainsTab shipId={shipId} domains={payload.domains} onSaved={invalidate} />
      ) : null}
      {tab === "seo" ? <SeoTab shipId={shipId} seo={payload.seo} onSaved={invalidate} /> : null}
    </div>
  );
}

function useSave<T>(fn: (input: { data: T }) => Promise<unknown>, onSaved: () => void) {
  return useMutation({
    mutationFn: (input: T) => fn({ data: input }),
    onSuccess: () => {
      toast.success("Đã lưu");
      onSaved();
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Lưu thất bại"),
  });
}

function GeneralTab({
  shipId,
  ship,
  onSaved,
}: {
  shipId: string;
  ship: Record<string, unknown>;
  onSaved: () => void;
}) {
  const save = useSave(useServerFn(updateShipAdmin), onSaved);
  const [values, setValues] = useState<ShipGeneralValues>(() => ({
    name: str(ship["name"]),
    displayName: str(ship["display_name"]),
    slug: str(ship["slug"]),
    tagline: str(ship["tagline"]),
    status: str(ship["status"]) || "draft",
    layout: str(ship["layout"]) || "heritage",
    defaultLanguage: str(ship["default_language"]) || "en",
    enabledLanguages: Array.isArray(ship["enabled_languages"])
      ? (ship["enabled_languages"] as string[])
      : ["en"],
    currency: str(ship["currency"]) || "USD",
    sortOrder: Number(ship["sort_order"] ?? 0),
    totalCabins: ship["total_cabins"] == null ? "" : String(ship["total_cabins"]),
    translations: record(ship["translations"]),
  }));

  return (
    <ShipGeneralForm
      values={values}
      onChange={setValues}
      submitting={save.isPending}
      submitLabel="Lưu thay đổi"
      onSubmit={() =>
        save.mutate({
          shipId,
          name: values.name,
          displayName: values.displayName,
          slug: values.slug,
          tagline: values.tagline,
          status: values.status,
          layout: values.layout,
          defaultLanguage: values.defaultLanguage,
          enabledLanguages: values.enabledLanguages,
          currency: values.currency,
          sortOrder: values.sortOrder,
          totalCabins: values.totalCabins === "" ? null : Number(values.totalCabins),
          translations: values.translations,
        } as never)
      }
    />
  );
}

const FONT_HINT = "Tên phông trong danh sách cho phép, ví dụ: Cormorant Garamond";

function BrandingTab({
  shipId,
  branding,
  onSaved,
}: {
  shipId: string;
  branding: Record<string, unknown> | null;
  onSaved: () => void;
}) {
  const save = useSave(useServerFn(saveShipBranding), onSaved);
  const [v, setV] = useState(() => ({
    logoLight: str(branding?.["logo_light"]),
    logoDark: str(branding?.["logo_dark"]),
    logoMark: str(branding?.["logo_mark"]),
    favicon: str(branding?.["favicon"]),
    primaryColor: str(branding?.["primary_color"]),
    secondaryColor: str(branding?.["secondary_color"]),
    accentColor: str(branding?.["accent_color"]),
    backgroundColor: str(branding?.["background_color"]),
    surfaceColor: str(branding?.["surface_color"]),
    textColor: str(branding?.["text_color"]),
    headingFont: str(branding?.["heading_font"]),
    bodyFont: str(branding?.["body_font"]),
  }));
  const set = (k: keyof typeof v) => (value: string) => setV({ ...v, [k]: value });

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        save.mutate({ shipId, ...v } as never);
      }}
    >
      <Card title="Logo & favicon" description="Đường dẫn ảnh trong thư viện media của tàu.">
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Logo sáng" value={v.logoLight} onChange={set("logoLight")} />
          <TextField label="Logo tối" value={v.logoDark} onChange={set("logoDark")} />
          <TextField label="Logo dạng dấu" value={v.logoMark} onChange={set("logoMark")} />
          <TextField label="Favicon" value={v.favicon} onChange={set("favicon")} />
        </div>
      </Card>
      <Card title="Bảng màu">
        <div className="grid gap-4 md:grid-cols-3">
          <TextField label="Màu chính" value={v.primaryColor} onChange={set("primaryColor")} />
          <TextField label="Màu phụ" value={v.secondaryColor} onChange={set("secondaryColor")} />
          <TextField label="Màu nhấn" value={v.accentColor} onChange={set("accentColor")} />
          <TextField label="Màu nền" value={v.backgroundColor} onChange={set("backgroundColor")} />
          <TextField label="Màu khối" value={v.surfaceColor} onChange={set("surfaceColor")} />
          <TextField label="Màu chữ" value={v.textColor} onChange={set("textColor")} />
        </div>
      </Card>
      <Card title="Phông chữ">
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Phông tiêu đề" value={v.headingFont} onChange={set("headingFont")} hint={FONT_HINT} />
          <TextField label="Phông nội dung" value={v.bodyFont} onChange={set("bodyFont")} hint={FONT_HINT} />
        </div>
      </Card>
      <Button type="submit" disabled={save.isPending}>
        {save.isPending ? "Đang lưu…" : "Lưu thương hiệu"}
      </Button>
    </form>
  );
}

function SettingsTab({
  shipId,
  settings,
  onSaved,
}: {
  shipId: string;
  settings: Record<string, unknown> | null;
  onSaved: () => void;
}) {
  const save = useSave(useServerFn(saveShipSettings), onSaved);
  const [v, setV] = useState(() => ({
    hotline: str(settings?.["hotline"]),
    hotlineDisplay: str(settings?.["hotline_display"]),
    whatsapp: str(settings?.["whatsapp"]),
    zalo: str(settings?.["zalo"]),
    email: str(settings?.["email"]),
    recruitEmail: str(settings?.["recruit_email"]),
    recruitZalo: str(settings?.["recruit_zalo"]),
    facebook: str(settings?.["facebook"]),
    instagram: str(settings?.["instagram"]),
    tiktok: str(settings?.["tiktok"]),
    tripadvisor: str(settings?.["tripadvisor"]),
    youtube: str(settings?.["youtube"]),
    googleMaps: str(settings?.["google_maps"]),
    bookingUrl: str(settings?.["booking_url"]),
    checkinPoint: str(settings?.["checkin_point"]),
    address: str(settings?.["address"]),
  }));
  const translations = record(settings?.["translations"]);
  const set = (k: keyof typeof v) => (value: string) => setV({ ...v, [k]: value });

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        save.mutate({ shipId, ...v, translations } as never);
      }}
    >
      <Card title="Liên hệ">
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Hotline" value={v.hotline} onChange={set("hotline")} />
          <TextField label="Hotline hiển thị" value={v.hotlineDisplay} onChange={set("hotlineDisplay")} />
          <TextField label="WhatsApp" value={v.whatsapp} onChange={set("whatsapp")} />
          <TextField label="Zalo" value={v.zalo} onChange={set("zalo")} />
          <TextField label="Email" value={v.email} onChange={set("email")} />
          <TextField label="Email tuyển dụng" value={v.recruitEmail} onChange={set("recruitEmail")} />
          <TextField label="Zalo tuyển dụng" value={v.recruitZalo} onChange={set("recruitZalo")} />
        </div>
      </Card>
      <Card title="Mạng xã hội">
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Facebook" value={v.facebook} onChange={set("facebook")} />
          <TextField label="Instagram" value={v.instagram} onChange={set("instagram")} />
          <TextField label="TikTok" value={v.tiktok} onChange={set("tiktok")} />
          <TextField label="TripAdvisor" value={v.tripadvisor} onChange={set("tripadvisor")} />
          <TextField label="YouTube" value={v.youtube} onChange={set("youtube")} />
          <TextField label="Google Maps" value={v.googleMaps} onChange={set("googleMaps")} />
        </div>
      </Card>
      <Card title="Khác">
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Đường dẫn đặt phòng" value={v.bookingUrl} onChange={set("bookingUrl")} />
          <TextField label="Điểm check-in" value={v.checkinPoint} onChange={set("checkinPoint")} />
          <TextField label="Địa chỉ" value={v.address} onChange={set("address")} />
        </div>
      </Card>
      <Button type="submit" disabled={save.isPending}>
        {save.isPending ? "Đang lưu…" : "Lưu liên hệ"}
      </Button>
    </form>
  );
}

interface DomainRow {
  id: string;
  domain: string;
  is_primary: boolean;
  is_active: boolean;
  redirect_to: string | null;
}

function DomainsTab({
  shipId,
  domains,
  onSaved,
}: {
  shipId: string;
  domains: DomainRow[];
  onSaved: () => void;
}) {
  const save = useSave(useServerFn(saveShipDomain), onSaved);
  const remove = useSave(useServerFn(deleteShipDomain), onSaved);
  const [draft, setDraft] = useState({ domain: "", isPrimary: false, isActive: true, redirectTo: "" });

  return (
    <div className="space-y-6">
      <Card title="Tên miền của tàu" description="Mỗi tàu chỉ có một tên miền chính.">
        {domains.length === 0 ? (
          <p className="text-sm text-muted-foreground">Chưa có tên miền nào.</p>
        ) : (
          <ul className="divide-y divide-border">
            {domains.map((d) => (
              <li key={d.id} className="flex flex-wrap items-center gap-3 py-3">
                <span className="font-medium">{d.domain}</span>
                {d.is_primary ? (
                  <span className="rounded bg-primary/10 px-2 py-0.5 text-[11px] text-primary">chính</span>
                ) : null}
                <span className="text-xs text-muted-foreground">
                  {d.is_active ? "đang bật" : "đang tắt"}
                  {d.redirect_to ? ` · chuyển tới ${d.redirect_to}` : ""}
                </span>
                <div className="ml-auto flex gap-2">
                  {!d.is_primary ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        save.mutate({
                          shipId,
                          domainId: d.id,
                          domain: d.domain,
                          isPrimary: true,
                          isActive: true,
                          redirectTo: d.redirect_to ?? "",
                        } as never)
                      }
                    >
                      Đặt làm chính
                    </Button>
                  ) : null}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      save.mutate({
                        shipId,
                        domainId: d.id,
                        domain: d.domain,
                        isPrimary: d.is_primary,
                        isActive: !d.is_active,
                        redirectTo: d.redirect_to ?? "",
                      } as never)
                    }
                  >
                    {d.is_active ? "Tắt" : "Bật"}
                  </Button>
                  {!d.is_primary ? (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (!window.confirm(`Xoá tên miền ${d.domain}?`)) return;
                        remove.mutate({ shipId, domainId: d.id } as never);
                      }}
                    >
                      Xoá
                    </Button>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card title="Thêm tên miền">
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (draft.isPrimary && domains.some((d) => d.is_primary)) {
              if (!window.confirm("Tên miền chính hiện tại sẽ bị thay thế. Tiếp tục?")) return;
            }
            save.mutate({ shipId, ...draft } as never);
            setDraft({ domain: "", isPrimary: false, isActive: true, redirectTo: "" });
          }}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              label="Tên miền"
              value={draft.domain}
              onChange={(v) => setDraft({ ...draft, domain: v.toLowerCase() })}
              placeholder="example.com"
              required
            />
            <TextField
              label="Chuyển hướng tới (tuỳ chọn)"
              value={draft.redirectTo}
              onChange={(v) => setDraft({ ...draft, redirectTo: v })}
            />
          </div>
          <div className="flex gap-6 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={draft.isActive}
                onChange={(e) => setDraft({ ...draft, isActive: e.target.checked })}
              />
              Đang bật
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={draft.isPrimary}
                onChange={(e) => setDraft({ ...draft, isPrimary: e.target.checked })}
              />
              Tên miền chính
            </label>
          </div>
          <Button type="submit" disabled={save.isPending}>
            Thêm tên miền
          </Button>
        </form>
      </Card>
    </div>
  );
}

function SeoTab({
  shipId,
  seo,
  onSaved,
}: {
  shipId: string;
  seo: Record<string, unknown> | null;
  onSaved: () => void;
}) {
  const save = useSave(useServerFn(saveShipSeo), onSaved);
  const [v, setV] = useState(() => ({
    siteName: str(seo?.["site_name"]),
    titleTemplate: str(seo?.["title_template"]),
    defaultTitle: str(seo?.["default_title"]),
    defaultDescription: str(seo?.["default_description"]),
    ogImage: str(seo?.["og_image"]),
    schemaType: str(seo?.["schema_type"]) || "Organization",
    schemaName: str(seo?.["schema_name"]),
    twitterHandle: str(seo?.["twitter_handle"]),
  }));
  const translations = record(seo?.["translations"]);
  const set = (k: keyof typeof v) => (value: string) => setV({ ...v, [k]: value });

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        save.mutate({ shipId, ...v, translations } as never);
      }}
    >
      <Card title="SEO mặc định của tàu" description="Mỗi trang nội dung có thể ghi đè sau này.">
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Tên website" value={v.siteName} onChange={set("siteName")} />
          <TextField
            label="Mẫu tiêu đề"
            value={v.titleTemplate}
            onChange={set("titleTemplate")}
            hint="Ví dụ: %s | Tên website"
          />
          <TextField label="Tiêu đề mặc định" value={v.defaultTitle} onChange={set("defaultTitle")} />
          <TextField label="Ảnh OG" value={v.ogImage} onChange={set("ogImage")} />
          <SelectField
            label="Loại dữ liệu có cấu trúc"
            value={v.schemaType}
            onChange={set("schemaType")}
            options={["Organization", "Hotel", "TouristTrip", "LocalBusiness"].map((s) => ({
              value: s,
              label: s,
            }))}
          />
          <TextField label="Tên trong dữ liệu có cấu trúc" value={v.schemaName} onChange={set("schemaName")} />
          <TextField label="Twitter handle" value={v.twitterHandle} onChange={set("twitterHandle")} />
        </div>
        <Field label="Mô tả mặc định">
          <textarea
            value={v.defaultDescription}
            onChange={(e) => setV({ ...v, defaultDescription: e.target.value })}
            rows={3}
            className="w-full rounded-md border border-input bg-background p-3 text-sm"
          />
        </Field>
      </Card>
      <Button type="submit" disabled={save.isPending}>
        {save.isPending ? "Đang lưu…" : "Lưu SEO"}
      </Button>
    </form>
  );
}

/** Keeps forms in sync if the query refetches while a tab is open. */
export function useResetOnChange(dep: unknown, reset: () => void) {
  useEffect(reset, [dep, reset]);
}
