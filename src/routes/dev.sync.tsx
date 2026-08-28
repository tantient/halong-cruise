import { createFileRoute } from "@tanstack/react-router";
import { GitBranch, GitCommit, RefreshCw, User } from "lucide-react";
import { formatDateTime, gitSyncInfo, timeAgo } from "@/lib/git-sync-info";

export const Route = createFileRoute("/dev/sync")({
  component: SyncStatusPage,
  head: () => ({
    meta: [
      { title: "Trạng thái sync GitHub | Chronos Cruise" },
      {
        name: "description",
        content:
          "Trang nội bộ hiển thị commit cuối cùng đã được đẩy và thời điểm đồng bộ gần nhất của website Chronos Cruise.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Trạng thái sync GitHub | Chronos Cruise" },
      {
        property: "og:description",
        content: "Commit cuối cùng và thời điểm đồng bộ gần nhất của Chronos Cruise.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function Row({
  icon,
  label,
  value,
  mono,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 border-b border-border/60 py-3 last:border-0">
      <span className="mt-0.5 text-muted-foreground">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className={`break-words text-sm text-foreground ${mono ? "font-mono" : ""}`}>{value}</p>
      </div>
    </div>
  );
}

function SyncStatusPage() {
  const info = gitSyncInfo;

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-semibold text-foreground">Trạng thái sync GitHub</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Thông tin được ghi lại tại thời điểm build. Mỗi lần code được đồng bộ và build lại, các giá
        trị dưới đây sẽ cập nhật theo.
      </p>

      <section className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground">Commit cuối cùng đã đẩy</h2>
        <div className="mt-2">
          <Row icon={<GitCommit size={16} />} label="Nội dung commit" value={info.subject} />
          <Row icon={<GitCommit size={16} />} label="Mã commit" value={info.sha} mono />
          <Row icon={<GitBranch size={16} />} label="Nhánh" value={info.branch} mono />
          <Row icon={<User size={16} />} label="Tác giả" value={info.author} />
          <Row
            icon={<RefreshCw size={16} />}
            label="Thời điểm commit"
            value={`${formatDateTime(info.committedAt)} (${timeAgo(info.committedAt)})`}
          />
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground">Đồng bộ gần nhất</h2>
        <div className="mt-2">
          <Row
            icon={<RefreshCw size={16} />}
            label="Build / sync gần nhất"
            value={`${formatDateTime(info.buildTime)} (${timeAgo(info.buildTime)})`}
          />
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Trạng thái kết nối GitHub (repo, quyền truy cập) được quản lý trong Lovable editor tại
          Settings → Git.
        </p>
      </section>
    </main>
  );
}
