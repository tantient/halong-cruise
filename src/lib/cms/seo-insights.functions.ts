/**
 * Admin SEO insights: reads Google Search Console performance for a search
 * query and asks the Lovable AI Gateway for per-page ranking recommendations.
 * Runs only on explicit admin action; never on public page requests.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireAdmin } from "./admin-auth";

const GSC = "https://connector-gateway.lovable.dev/google_search_console";
const AI_URL = "https://ai.gateway.lovable.dev/v1/responses";
const TARGET = "https://chronoscruise.com/";

export interface SeoRow {
  query: string;
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}
export interface PageAdvice {
  page: string;
  summary: string;
  priority: "high" | "medium" | "low";
  actions: string[];
}
export type SeoInsightResult =
  | { status: "selection_required"; candidates: string[] }
  | { status: "error"; message: string }
  | {
      status: "ok";
      siteUrl: string;
      rows: SeoRow[];
      overview: string;
      pages: PageAdvice[];
    };

function gscHeaders() {
  const lovable = process.env["LOVABLE_API_KEY"];
  const conn = process.env["GOOGLE_SEARCH_CONSOLE_API_KEY"];
  if (!lovable || !conn) throw new Error("Chưa kết nối Google Search Console.");
  return { Authorization: `Bearer ${lovable}`, "X-Connection-Api-Key": conn };
}

function covers(siteUrl: string, target: URL) {
  if (siteUrl.startsWith("sc-domain:")) {
    const d = siteUrl.slice(10).toLowerCase();
    const h = target.hostname.toLowerCase();
    return h === d || h.endsWith(`.${d}`);
  }
  try {
    return target.href.startsWith(new URL(siteUrl).href);
  } catch {
    return false;
  }
}

async function resolveSite(selected?: string) {
  const res = await fetch(`${GSC}/webmasters/v3/sites`, { headers: gscHeaders() });
  if (!res.ok) throw new Error(`Không đọc được danh sách trang Search Console [${res.status}]: ${await res.text()}`);
  const { siteEntry = [] } = (await res.json()) as { siteEntry?: { siteUrl: string; permissionLevel?: string }[] };
  const target = new URL(TARGET);
  const matches = siteEntry.filter((e) => e.permissionLevel !== "siteUnverifiedUser" && covers(e.siteUrl, target));
  if (selected) {
    const hit = matches.find((m) => m.siteUrl === selected);
    if (!hit) throw new Error("Trang Search Console đã chọn không còn được xác minh.");
    return { status: "selected" as const, siteUrl: hit.siteUrl };
  }
  if (matches.length === 0) throw new Error("Chưa có trang Search Console đã xác minh cho chronoscruise.com.");
  if (matches.length === 1) return { status: "selected" as const, siteUrl: matches[0]!.siteUrl };
  return { status: "selection_required" as const, candidates: matches.map((m) => m.siteUrl) };
}

function isoDay(offset: number) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - offset);
  return d.toISOString().slice(0, 10);
}

async function querySearch(siteUrl: string, query: string, days: number): Promise<SeoRow[]> {
  const body: Record<string, unknown> = {
    startDate: isoDay(days + 2),
    endDate: isoDay(2),
    dimensions: ["query", "page"],
    rowLimit: 100,
  };
  if (query) {
    body.dimensionFilterGroups = [{ filters: [{ dimension: "query", operator: "contains", expression: query }] }];
  }
  const res = await fetch(`${GSC}/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`, {
    method: "POST",
    headers: { ...gscHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (res.status === 403) throw new Error("Tài khoản Google đã kết nối không có quyền xem trang này.");
  if (!res.ok) throw new Error(`Search Console báo lỗi [${res.status}]: ${await res.text()}`);
  const data = (await res.json()) as {
    rows?: { keys: string[]; clicks: number; impressions: number; ctr: number; position: number }[];
  };
  return (data.rows ?? []).map((r) => ({
    query: r.keys[0] ?? "",
    page: r.keys[1] ?? "",
    clicks: r.clicks,
    impressions: r.impressions,
    ctr: r.ctr,
    position: r.position,
  }));
}

const adviceSchema = {
  type: "object",
  additionalProperties: false,
  required: ["overview", "pages"],
  properties: {
    overview: { type: "string" },
    pages: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["page", "summary", "priority", "actions"],
        properties: {
          page: { type: "string" },
          summary: { type: "string" },
          priority: { type: "string", enum: ["high", "medium", "low"] },
          actions: { type: "array", items: { type: "string" } },
        },
      },
    },
  },
};

async function analyse(query: string, rows: SeoRow[]) {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("Thiếu khoá AI.");
  const table = rows
    .slice(0, 80)
    .map((r) => `${r.query} | ${r.page} | clicks ${r.clicks} | impr ${r.impressions} | ctr ${(r.ctr * 100).toFixed(1)}% | pos ${r.position.toFixed(1)}`)
    .join("\n");
  const res = await fetch(AI_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Lovable-API-Key": key,
      "X-Lovable-AIG-SDK": "fetch",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-6-astra",
      stream: true,
      store: false,
      reasoning: { effort: "low" },
      instructions:
        "Bạn là chuyên gia SEO cho website du thuyền hạng sang Chronos Cruise (vịnh Lan Hạ / Hạ Long). Phân tích dữ liệu Google Search Console và đề xuất cải thiện thứ hạng cụ thể cho TỪNG trang (tiêu đề, mô tả, nội dung, liên kết nội bộ, từ khoá). Viết tiếng Việt dễ hiểu, không thuật ngữ khó. Chỉ dựa trên dữ liệu được cung cấp, không bịa số liệu.",
      input: `Truy vấn quan tâm: ${query || "(tất cả)"}\nDữ liệu (query | page | clicks | impressions | ctr | position):\n${table}`,
      text: { format: { type: "json_schema", name: "seo_advice", strict: true, schema: adviceSchema } },
    }),
  });
  if (!res.ok || !res.body) {
    const t = await res.text();
    let msg = t;
    try {
      msg = (JSON.parse(t) as { message?: string; error?: { message?: string } }).message ?? JSON.parse(t).error?.message ?? t;
    } catch {}
    if (res.status === 402) throw new Error(`Hết credit AI: ${msg}`);
    if (res.status === 429) throw new Error("AI đang quá tải, thử lại sau ít phút.");
    throw new Error(`AI báo lỗi [${res.status}]: ${msg}`);
  }
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = "";
  let out = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    let i;
    while ((i = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, i).trim();
      buf = buf.slice(i + 1);
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        const ev = JSON.parse(payload) as { type?: string; delta?: string; response?: { error?: { message?: string } } };
        if (ev.type === "response.output_text.delta" && ev.delta) out += ev.delta;
        if (ev.type === "response.failed") throw new Error(ev.response?.error?.message ?? "AI không trả lời được.");
      } catch (e) {
        if (e instanceof Error && !(e instanceof SyntaxError)) throw e;
      }
    }
  }
  if (!out) throw new Error("AI không trả về nội dung.");
  return JSON.parse(out) as { overview: string; pages: PageAdvice[] };
}

export const analyseSeoInsights = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator(
    z.object({
      query: z.string().trim().max(200),
      days: z.number().int().min(7).max(90),
      siteUrl: z.string().max(300).optional(),
    }),
  )
  .handler(async ({ data }): Promise<SeoInsightResult> => {
    try {
      const site = await resolveSite(data.siteUrl);
      if (site.status === "selection_required") return site;
      const rows = await querySearch(site.siteUrl, data.query, data.days);
      if (rows.length === 0) {
        return {
          status: "ok",
          siteUrl: site.siteUrl,
          rows,
          overview:
            "Google chưa có dữ liệu tìm kiếm cho truy vấn này trong khoảng thời gian đã chọn. Trang mới khai báo thường cần vài ngày đến vài tuần mới có số liệu.",
          pages: [],
        };
      }
      const advice = await analyse(data.query, rows);
      return { status: "ok", siteUrl: site.siteUrl, rows, ...advice };
    } catch (e) {
      return { status: "error", message: e instanceof Error ? e.message : "Lỗi không xác định" };
    }
  });
