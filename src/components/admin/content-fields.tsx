import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/admin/admin-ui";
import { LANGUAGE_LABELS, type LanguageCode } from "@/lib/i18n/languages";

export function AreaField({
  label,
  value,
  onChange,
  hint,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string | undefined;
  rows?: number | undefined;
}) {
  return (
    <Field label={label} hint={hint}>
      <Textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />
    </Field>
  );
}

export function langLabel(code: string): string {
  const entry = (LANGUAGE_LABELS as Record<string, unknown>)[code];
  if (typeof entry === "string") return entry;
  if (entry && typeof entry === "object") {
    const native = (entry as Record<string, unknown>)['native'] ?? (entry as Record<string, unknown>)['label'];
    if (typeof native === "string") return native;
  }
  return code;
}

export type TranslationBag = Record<string, Record<string, string | string[]>>;

export function bagText(bag: TranslationBag, lang: string, key: string): string {
  const v = bag[lang]?.[key];
  return typeof v === "string" ? v : "";
}

export function bagList(bag: TranslationBag, lang: string, key: string): string {
  const v = bag[lang]?.[key];
  return Array.isArray(v) ? v.join("\n") : "";
}

export function setBag(
  bag: TranslationBag,
  lang: string,
  key: string,
  value: string | string[],
): TranslationBag {
  return { ...bag, [lang]: { ...(bag[lang] ?? {}), [key]: value } };
}

/** Languages of the ship other than its default — the ones needing translation. */
export function otherLanguages(enabled: string[], defaultLanguage: string): LanguageCode[] {
  return enabled.filter((l) => l !== defaultLanguage) as LanguageCode[];
}

export const lines = (text: string) =>
  text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
