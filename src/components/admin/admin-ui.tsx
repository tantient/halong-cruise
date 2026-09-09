import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/** Shared field primitives for the admin CMS forms. */

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <Label className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</Label>
      {children}
      {hint ? <span className="block text-xs text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

export function TextField({
  label,
  value,
  onChange,
  hint,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string | undefined;
  type?: string | undefined;
  required?: boolean | undefined;
  placeholder?: string | undefined;
}) {
  return (
    <Field label={label} hint={hint}>
      <Input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  hint?: string | undefined;
}) {
  return (
    <Field label={label} hint={hint}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function Card({ title, description, children }: { title: string; description?: string | undefined; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <h2 className="text-sm font-semibold">{title}</h2>
      {description ? <p className="mt-1 text-xs text-muted-foreground">{description}</p> : null}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "live"
      ? "bg-emerald-500/10 text-emerald-600"
      : status === "staging"
        ? "bg-amber-500/10 text-amber-600"
        : status === "disabled"
          ? "bg-destructive/10 text-destructive"
          : "bg-muted text-muted-foreground";
  return (
    <span className={`inline-flex rounded px-2 py-0.5 text-[11px] uppercase tracking-wider ${tone}`}>
      {status}
    </span>
  );
}
