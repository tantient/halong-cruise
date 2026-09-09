import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, Field, TextField } from "@/components/admin/admin-ui";
import { ShipScopeBar } from "@/components/admin/ShipScopeBar";
import { useShipScope } from "@/components/admin/use-ship-scope";
import {
  deleteMediaAdmin,
  listMediaAdmin,
  updateMediaAdmin,
  type AdminMediaItem,
} from "@/lib/cms/media.functions";
import { uploadMediaAdmin } from "@/lib/cms/media.functions";

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Không đọc được tệp"));
    reader.onload = () => {
      const result = String(reader.result ?? "");
      resolve(result.slice(result.indexOf(",") + 1));
    };
    reader.readAsDataURL(file);
  });
}

export function MediaLibraryPage() {
  const scope = useShipScope();
  const queryClient = useQueryClient();
  const fetchMedia = useServerFn(listMediaAdmin);
  const upload = useServerFn(uploadMediaAdmin);
  const remove = useServerFn(deleteMediaAdmin);

  const [category, setCategory] = useState("gallery");
  const [filter, setFilter] = useState("");
  const [editing, setEditing] = useState<AdminMediaItem | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const shipId = scope.shipId;
  const mediaQuery = useQuery({
    queryKey: ["cms", "media", shipId],
    queryFn: () => fetchMedia({ data: { shipId: shipId! } }),
    enabled: !!shipId,
  });

  const invalidate = () => void queryClient.invalidateQueries({ queryKey: ["cms", "media"] });

  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      for (const file of files) {
        await upload({
          data: {
            shipId: shipId!,
            category,
            fileName: file.name,
            mimeType: file.type || "image/webp",
            contentBase64: await toBase64(file),
          },
        });
      }
      return files.length;
    },
    onSuccess: (count) => {
      toast.success(`Đã tải lên ${count} ảnh`);
      if (fileInput.current) fileInput.current.value = "";
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (mediaId: string) => remove({ data: { shipId: shipId!, mediaId } }),
    onSuccess: () => {
      toast.success("Đã xoá ảnh");
      setEditing(null);
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const items = (mediaQuery.data?.items ?? []).filter((i) => {
    const q = filter.trim().toLowerCase();
    if (!q) return true;
    return `${i.category} ${i.storagePath} ${i.alt ?? ""}`.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Thư viện ảnh</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ảnh được lưu theo từng tàu và dùng lại cho phòng nghỉ, hải trình và các trang.
        </p>
      </div>

      <ShipScopeBar ships={scope.ships} shipId={scope.shipId} onSelect={scope.select} />
      {scope.error ? <p className="text-sm text-destructive">{scope.error.message}</p> : null}

      <Card title="Tải ảnh lên" description="Chọn nhóm ảnh rồi chọn một hoặc nhiều tệp.">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Nhóm ảnh" value={category} onChange={setCategory} hint="ví dụ: gallery, cabin, exterior" />
          <Field label="Tệp ảnh">
            <Input
              ref={fileInput}
              type="file"
              accept="image/*"
              multiple
              disabled={!shipId || uploadMutation.isPending}
              onChange={(e) => {
                const files = Array.from(e.target.files ?? []);
                console.log("[cms] picked files", files.length, "ship", shipId);
                if (files.length > 0) uploadMutation.mutate(files);
              }}
            />
          </Field>
        </div>
        {uploadMutation.isPending ? <p className="text-xs text-muted-foreground">Đang tải lên…</p> : null}
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="max-w-xs flex-1">
          <TextField label="Tìm ảnh" value={filter} onChange={setFilter} placeholder="tên tệp, nhóm, mô tả" />
        </div>
        <p className="text-sm text-muted-foreground">{items.length} ảnh</p>
      </div>

      {mediaQuery.isPending && shipId ? <p className="text-sm text-muted-foreground">Đang tải…</p> : null}
      {mediaQuery.isError ? (
        <p className="text-sm text-destructive">{(mediaQuery.error as Error).message}</p>
      ) : null}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setEditing(item)}
            className="group overflow-hidden rounded-lg border border-border bg-card text-left"
          >
            <img
              src={item.url}
              alt={item.alt ?? ""}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover transition-transform group-hover:scale-[1.02]"
            />
            <div className="space-y-0.5 p-2">
              <p className="truncate text-xs font-medium">{item.storagePath.split("/").pop()}</p>
              <p className="text-[11px] text-muted-foreground">
                {item.category} · dùng {item.usedBy} nơi
              </p>
            </div>
          </button>
        ))}
      </div>

      {editing ? (
        <MediaEditDialog
          key={editing.id}
          item={editing}
          onClose={() => setEditing(null)}
          onSaved={invalidate}
          onDelete={() => deleteMutation.mutate(editing.id)}
          deleting={deleteMutation.isPending}
        />
      ) : null}
    </div>
  );
}

function MediaEditDialog({
  item,
  onClose,
  onSaved,
  onDelete,
  deleting,
}: {
  item: AdminMediaItem;
  onClose: () => void;
  onSaved: () => void;
  onDelete: () => void;
  deleting: boolean;
}) {
  const save = useServerFn(updateMediaAdmin);
  const [alt, setAlt] = useState(item.alt ?? "");
  const [caption, setCaption] = useState(item.caption ?? "");
  const [category, setCategory] = useState(item.category);
  const [sortOrder, setSortOrder] = useState(String(item.sortOrder));

  const mutation = useMutation({
    mutationFn: () =>
      save({
        data: {
          shipId: item.shipId,
          mediaId: item.id,
          alt,
          caption,
          category,
          sortOrder: Number(sortOrder) || 0,
          isFeatured: item.isFeatured,
          translations: item.translations,
        },
      }),
    onSuccess: () => {
      toast.success("Đã lưu ảnh");
      onSaved();
      onClose();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-border bg-card p-5">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-sm font-semibold">Chi tiết ảnh</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Đóng
          </Button>
        </div>
        <img src={item.url} alt={item.alt ?? ""} className="mt-4 max-h-64 w-full rounded-md object-contain" />
        <p className="mt-2 break-all text-xs text-muted-foreground">{item.storagePath}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <TextField label="Mô tả ảnh (alt)" value={alt} onChange={setAlt} />
          <TextField label="Chú thích" value={caption} onChange={setCaption} />
          <TextField label="Nhóm ảnh" value={category} onChange={setCategory} />
          <TextField label="Thứ tự" value={sortOrder} onChange={setSortOrder} type="number" />
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled={deleting}
            onClick={() => {
              const message =
                item.usedBy > 0
                  ? `Ảnh này đang dùng ở ${item.usedBy} nơi. Xoá sẽ bỏ khỏi các nơi đó. Tiếp tục?`
                  : "Xoá ảnh này?";
              if (window.confirm(message)) onDelete();
            }}
          >
            Xoá ảnh
          </Button>
          <Button size="sm" disabled={mutation.isPending} onClick={() => mutation.mutate()}>
            {mutation.isPending ? "Đang lưu…" : "Lưu"}
          </Button>
        </div>
      </div>
    </div>
  );
}
