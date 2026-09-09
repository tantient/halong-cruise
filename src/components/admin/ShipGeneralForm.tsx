import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, Field, SelectField, TextField } from "@/components/admin/admin-ui";
import { SUPPORTED_LANGUAGES, LANGUAGE_LABELS } from "@/lib/i18n/languages";
import {
  IMPLEMENTED_LAYOUTS,
  SHIP_LAYOUT_VALUES,
  SHIP_STATUS_VALUES,
} from "@/lib/cms/ships.functions";

export interface ShipGeneralValues {
  name: string;
  displayName: string;
  slug: string;
  tagline: string;
  status: string;
  layout: string;
  defaultLanguage: string;
  enabledLanguages: string[];
  currency: string;
  sortOrder: number;
  totalCabins: string;
  translations: Record<string, Record<string, string>>;
}

export const emptyShipValues: ShipGeneralValues = {
  name: "",
  displayName: "",
  slug: "",
  tagline: "",
  status: "draft",
  layout: "heritage",
  defaultLanguage: "en",
  enabledLanguages: ["en"],
  currency: "USD",
  sortOrder: 0,
  totalCabins: "",
  translations: {},
};

const LABELS = LANGUAGE_LABELS as Record<string, { native: string; english: string } | undefined>;
const langLabel = (code: string) => {
  const entry = LABELS[code];
  return entry ? `${entry.english} (${entry.native})` : code;
};

const statusOptions = SHIP_STATUS_VALUES.map((s) => ({ value: s, label: s }));
const layoutOptions = SHIP_LAYOUT_VALUES.map((l) => ({
  value: l,
  label: IMPLEMENTED_LAYOUTS.includes(l) ? `${l} (đã có)` : `${l} (chưa dựng)`,
}));

export function ShipGeneralForm({
  values,
  onChange,
  onSubmit,
  submitting,
  submitLabel,
  error,
}: {
  values: ShipGeneralValues;
  onChange: (v: ShipGeneralValues) => void;
  onSubmit: () => void;
  submitting: boolean;
  submitLabel: string;
  error?: string | null | undefined;
}) {
  const [langTab, setLangTab] = useState<string | null>(null);
  const set = <K extends keyof ShipGeneralValues>(key: K, value: ShipGeneralValues[K]) =>
    onChange({ ...values, [key]: value });

  const toggleLanguage = (code: string) => {
    const next = values.enabledLanguages.includes(code)
      ? values.enabledLanguages.filter((c) => c !== code)
      : [...values.enabledLanguages, code];
    onChange({
      ...values,
      enabledLanguages: next.length > 0 ? next : [values.defaultLanguage],
    });
  };

  const otherLanguages = values.enabledLanguages.filter((c) => c !== values.defaultLanguage);
  const activeTab = langTab && otherLanguages.includes(langTab) ? langTab : (otherLanguages[0] ?? null);
  const translationFor = (lang: string, key: string) => values.translations[lang]?.[key] ?? "";
  const setTranslation = (lang: string, key: string, value: string) =>
    onChange({
      ...values,
      translations: {
        ...values.translations,
        [lang]: { ...(values.translations[lang] ?? {}), [key]: value },
      },
    });

  const languageWarning = !values.enabledLanguages.includes(values.defaultLanguage);
  const layoutWarning = !IMPLEMENTED_LAYOUTS.includes(values.layout);

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <Card title="Nhận diện">
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Tên tàu" value={values.name} onChange={(v) => set("name", v)} required />
          <TextField
            label="Tên hiển thị"
            value={values.displayName}
            onChange={(v) => set("displayName", v)}
          />
          <TextField
            label="Slug"
            value={values.slug}
            onChange={(v) => set("slug", v.toLowerCase())}
            hint="Chữ thường, số và dấu gạch ngang"
            required
          />
          <TextField label="Tagline" value={values.tagline} onChange={(v) => set("tagline", v)} />
        </div>
      </Card>

      <Card title="Trạng thái & mẫu bố cục">
        <div className="grid gap-4 md:grid-cols-2">
          <SelectField
            label="Trạng thái"
            value={values.status}
            onChange={(v) => set("status", v)}
            options={statusOptions}
            hint="Chỉ tàu live được mở công khai"
          />
          <SelectField
            label="Mẫu bố cục"
            value={values.layout}
            onChange={(v) => set("layout", v)}
            options={layoutOptions}
          />
        </div>
        {layoutWarning ? (
          <p className="text-xs text-amber-600">
            Mẫu này chưa được dựng. Bạn vẫn lưu được cấu hình, nhưng đừng đặt tàu ở trạng thái live
            cho tới khi mẫu hoàn thành.
          </p>
        ) : null}
      </Card>

      <Card title="Ngôn ngữ">
        <Field label="Ngôn ngữ đã bật">
          <div className="flex flex-wrap gap-3">
            {SUPPORTED_LANGUAGES.map((code) => (
              <label key={code} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={values.enabledLanguages.includes(code)}
                  onChange={() => toggleLanguage(code)}
                />
                {langLabel(code)}
              </label>
            ))}
          </div>
        </Field>
        <SelectField
          label="Ngôn ngữ mặc định"
          value={values.defaultLanguage}
          onChange={(v) => set("defaultLanguage", v)}
          options={values.enabledLanguages.map((c) => ({ value: c, label: langLabel(c) }))}
          hint="Ngôn ngữ mặc định không có tiền tố trong đường dẫn"
        />
        {languageWarning ? (
          <p className="text-xs text-destructive">
            Ngôn ngữ mặc định phải nằm trong danh sách ngôn ngữ đã bật.
          </p>
        ) : null}
      </Card>

      {activeTab ? (
        <Card title="Bản dịch" description="Trường để trống sẽ dùng nội dung ngôn ngữ mặc định.">
          <div className="flex flex-wrap gap-2">
            {otherLanguages.map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLangTab(code)}
                className={`rounded-md px-3 py-1 text-xs ${
                  activeTab === code ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                }`}
              >
                {langLabel(code)}
              </button>
            ))}
          </div>
          <TextField
            label="Tên hiển thị"
            value={translationFor(activeTab, "display_name")}
            onChange={(v) => setTranslation(activeTab, "display_name", v)}
          />
          <TextField
            label="Tagline"
            value={translationFor(activeTab, "tagline")}
            onChange={(v) => setTranslation(activeTab, "tagline", v)}
          />
        </Card>
      ) : null}

      <Card title="Thông tin chung">
        <div className="grid gap-4 md:grid-cols-3">
          <TextField label="Tiền tệ" value={values.currency} onChange={(v) => set("currency", v)} required />
          <Field label="Thứ tự">
            <Input
              type="number"
              min={0}
              value={values.sortOrder}
              onChange={(e) => set("sortOrder", Number(e.target.value) || 0)}
            />
          </Field>
          <TextField
            label="Tổng số phòng"
            type="number"
            value={values.totalCabins}
            onChange={(v) => set("totalCabins", v)}
          />
        </div>
      </Card>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" disabled={submitting || languageWarning}>
        {submitting ? "Đang lưu…" : submitLabel}
      </Button>
    </form>
  );
}
