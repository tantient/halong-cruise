import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { analyseSeoInsights, type SeoInsightResult } from "@/lib/cms/seo-insights.functions";

const PRIORITY: Record<string, string> = { high: "Ưu tiên cao", medium: "Trung bình", low: "Thấp" };

export function SeoInsightsPage() {
  const run = useServerFn(analyseSeoInsights);
  const [query, setQuery] = useState("");
  const [days, setDays] = useState(28);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SeoInsightResult | null>(null);

  async function submit(siteUrl?: string) {
    setLoading(true);
    try {
      setResult(await run({ data: { query, days, siteUrl } }));
    } catch (e) {
      setResult({ status: "error", message: e instanceof Error ? e.message : "Lỗi" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Phân tích SEO</h1>
        <p className="text-muted-foreground">
          Nhập từ khoá khách hay tìm trên Google. Hệ thống lấy số liệu từ Google Search Console và AI đề xuất cách cải thiện thứ hạng cho từng trang.
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4 pt-6 md:flex-row md:items-end">
          <div className="flex-1 space-y-2">
            <Label htmlFor="seo-q">Từ khoá tìm kiếm (để trống = tất cả)</Label>
            <Input id="seo-q" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="vd: ha long cruise" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seo-d">Số ngày gần nhất</Label>
            <Input id="seo-d" type="number" min={7} max={90} value={days} onChange={(e) => setDays(Number(e.target.value) || 28)} className="w-32" />
          </div>
          <Button onClick={() => submit()} disabled={loading}>
            {loading ? "Đang phân tích…" : "Phân tích"}
          </Button>
        </CardContent>
      </Card>

      {result?.status === "error" && (
        <Card><CardContent className="pt-6 text-destructive">{result.message}</CardContent></Card>
      )}

      {result?.status === "selection_required" && (
        <Card>
          <CardHeader><CardTitle>Chọn trang Search Console</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {result.candidates.map((c) => (
              <Button key={c} variant="outline" onClick={() => submit(c)} disabled={loading}>{c}</Button>
            ))}
          </CardContent>
        </Card>
      )}

      {result?.status === "ok" && (
        <>
          <Card>
            <CardHeader><CardTitle>Nhận định chung</CardTitle></CardHeader>
            <CardContent className="whitespace-pre-line">{result.overview}</CardContent>
          </Card>

          {result.pages.map((p) => (
            <Card key={p.page}>
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <CardTitle className="break-all text-base">{p.page}</CardTitle>
                <Badge variant={p.priority === "high" ? "destructive" : "secondary"}>{PRIORITY[p.priority]}</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <p>{p.summary}</p>
                <ul className="list-disc space-y-1 pl-5">
                  {p.actions.map((a, i) => <li key={i}>{a}</li>)}
                </ul>
              </CardContent>
            </Card>
          ))}

          {result.rows.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Số liệu Google ({result.rows.length} dòng)</CardTitle></CardHeader>
              <CardContent className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-muted-foreground">
                    <tr><th className="p-2">Từ khoá</th><th className="p-2">Trang</th><th className="p-2">Lượt bấm</th><th className="p-2">Lượt hiển thị</th><th className="p-2">Tỉ lệ bấm</th><th className="p-2">Vị trí TB</th></tr>
                  </thead>
                  <tbody>
                    {result.rows.map((r, i) => (
                      <tr key={i} className="border-t border-border">
                        <td className="p-2">{r.query}</td>
                        <td className="break-all p-2">{r.page}</td>
                        <td className="p-2">{r.clicks}</td>
                        <td className="p-2">{r.impressions}</td>
                        <td className="p-2">{(r.ctr * 100).toFixed(1)}%</td>
                        <td className="p-2">{r.position.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
