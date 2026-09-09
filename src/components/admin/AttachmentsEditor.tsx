import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { SelectField } from "@/components/admin/admin-ui";
import {
  attachMediaAdmin,
  detachMediaAdmin,
  listAttachmentsAdmin,
  listMediaAdmin,
  MEDIA_USAGES,
  updateAttachmentAdmin,
} from "@/lib/cms/media.functions";

type EntityType = "cabin" | "itinerary";

/** Attach / order / detach library images for one content record. */
export function AttachmentsEditor({
  shipId,
  entityType,
  entityId,
}: {
  shipId: string;
  entityType: EntityType;
  entityId: string;
}) {
  const queryClient = useQueryClient();
  const fetchAttachments = useServerFn(listAttachmentsAdmin);
  const fetchMedia = useServerFn(listMediaAdmin);
  const attach = useServerFn(attachMediaAdmin);
  const detach = useServerFn(detachMediaAdmin);
  const updateLink = useServerFn(updateAttachmentAdmin);

  const [usage, setUsage] = useState<string>("gallery");
  const [pick, setPick] = useState("");

  const attachmentsQuery = useQuery({
    queryKey: ["cms", "attachments", entityType, entityId],
    queryFn: () => fetchAttachments({ data: { shipId, entityType, entityId } }),
  });
  const mediaQuery = useQuery({
    queryKey: ["cms", "media", shipId],
    queryFn: () => fetchMedia({ data: { shipId } }),
  });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["cms", "attachments", entityType, entityId] });
  };

  const attachMutation = useMutation({
    mutationFn: (mediaId: string) =>
      attach({
        data: {
          shipId,
          mediaId,
          entityType,
          entityId,
          usage: usage as (typeof MEDIA_USAGES)[number],
          sortOrder: attachmentsQuery.data?.attachments.length ?? 0,
        },
      }),
    onSuccess: () => {
      toast.success("Đã gắn ảnh");
      setPick("");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const detachMutation = useMutation({
    mutationFn: (linkId: string) => detach({ data: { shipId, linkId } }),
    onSuccess: () => {
      toast.success("Đã bỏ ảnh");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const moveMutation = useMutation({
    mutationFn: (input: { linkId: string; usage: string; sortOrder: number }) =>
      updateLink({
        data: {
          shipId,
          linkId: input.linkId,
          usage: input.usage as (typeof MEDIA_USAGES)[number],
          sortOrder: input.sortOrder,
        },
      }),
    onSuccess: invalidate,
    onError: (e: Error) => toast.error(e.message),
  });

  const attachments = attachmentsQuery.data?.attachments ?? [];
  const library = mediaQuery.data?.items ?? [];

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-[160px_1fr_auto] sm:items-end">
        <SelectField
          label="Vai trò ảnh"
          value={usage}
          onChange={setUsage}
          options={MEDIA_USAGES.map((u) => ({ value: u, label: u }))}
        />
        <SelectField
          label="Chọn ảnh từ thư viện"
          value={pick}
          onChange={setPick}
          options={[
            { value: "", label: library.length ? "— chọn ảnh —" : "Thư viện chưa có ảnh" },
            ...library.map((m) => ({
              value: m.id,
              label: `${m.category}/${m.storagePath.split("/").pop()}`,
            })),
          ]}
        />
        <Button
          type="button"
          size="sm"
          disabled={!pick || attachMutation.isPending}
          onClick={() => attachMutation.mutate(pick)}
        >
          Gắn ảnh
        </Button>
      </div>

      {attachments.length === 0 ? (
        <p className="text-xs text-muted-foreground">Chưa gắn ảnh nào.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {attachments.map((a, index) => (
            <div key={a.linkId} className="overflow-hidden rounded-md border border-border">
              <img src={a.url} alt={a.alt ?? ""} loading="lazy" className="aspect-[4/3] w-full object-cover" />
              <div className="space-y-1 p-2">
                <p className="text-[11px] text-muted-foreground">
                  {a.usage} · #{a.sortOrder}
                </p>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={index === 0}
                    onClick={() =>
                      moveMutation.mutate({ linkId: a.linkId, usage: a.usage, sortOrder: Math.max(0, a.sortOrder - 1) })
                    }
                  >
                    ↑
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      moveMutation.mutate({ linkId: a.linkId, usage: a.usage, sortOrder: a.sortOrder + 1 })
                    }
                  >
                    ↓
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => detachMutation.mutate(a.linkId)}
                  >
                    Bỏ
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
