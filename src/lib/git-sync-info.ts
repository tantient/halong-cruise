export type GitSyncInfo = {
  sha: string;
  shortSha: string;
  subject: string;
  author: string;
  committedAt: string;
  branch: string;
  buildTime: string;
};

declare const __GIT_SYNC_INFO__: GitSyncInfo;

const fallback: GitSyncInfo = {
  sha: "unknown",
  shortSha: "unknown",
  subject: "unknown",
  author: "unknown",
  committedAt: "",
  branch: "unknown",
  buildTime: "",
};

export const gitSyncInfo: GitSyncInfo =
  typeof __GIT_SYNC_INFO__ !== "undefined" ? __GIT_SYNC_INFO__ : fallback;

export function formatDateTime(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(d);
}

export function timeAgo(iso: string): string {
  if (!iso) return "—";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "—";
  const mins = Math.max(0, Math.round((Date.now() - then) / 60000));
  if (mins < 1) return "vừa xong";
  if (mins < 60) return `${mins} phút trước`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} giờ trước`;
  return `${Math.round(hours / 24)} ngày trước`;
}
