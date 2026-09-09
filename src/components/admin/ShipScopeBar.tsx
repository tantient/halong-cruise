import { SelectField } from "@/components/admin/admin-ui";

/** Ship selector shown above every content module. */
export function ShipScopeBar({
  ships,
  shipId,
  onSelect,
}: {
  ships: { id: string; name: string; displayName: string | null; slug: string }[];
  shipId: string | null;
  onSelect: (id: string) => void;
}) {
  if (ships.length === 0) return null;
  return (
    <div className="max-w-xs">
      <SelectField
        label="Tàu đang quản lý"
        value={shipId ?? ""}
        onChange={onSelect}
        options={ships.map((s) => ({ value: s.id, label: `${s.displayName ?? s.name} (${s.slug})` }))}
      />
    </div>
  );
}
