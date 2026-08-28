"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";

import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { useLanguage } from "@/components/landing/use-language";
import { Reveal } from "@/components/landing/Reveal";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  cabinTypes,
  TOTAL_CABINS,
  AREA_LABEL_VI,
  AREA_LABEL_EN,
  AREA_NOTE_VI,
  AREA_NOTE_EN,
  type CabinType,
} from "./cabins-data";

const QUOTE_LINK = "https://zalo.me/";


export function CabinsPage() {
  const { lang, setLang, t } = useLanguage();
  const vi = lang === "vi";
  const vipCabins = cabinTypes.filter((c) => c.vip);
  const [compareCabin, setCompareCabin] = useState<CabinType | null>(null);


  return (
    <div className="min-h-screen bg-chronos-ivory">
      <Header lang={lang} setLang={setLang} t={t} />

      <main>
        <section className="relative h-[70vh] min-h-[460px] w-full overflow-hidden">
          <img
            src={cabinTypes[0]!.hero}
            alt={vi ? "Phòng nghỉ trên Chronos Cruise" : "Cabins aboard Chronos Cruise"}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-chronos-ink/85 via-chronos-ink/30 to-chronos-ink/40" />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-7xl px-6 pb-16 lg:px-8">
              <p className="eyebrow mb-5 text-chronos-gold">{vi ? "PHÒNG NGHỈ" : "CABINS"}</p>
              <h1 className="max-w-3xl text-4xl tracking-[0.02em] text-chronos-ivory sm:text-5xl">
                {vi ? "Giấc ngủ giữa lòng vịnh" : "Sleep in the heart of the bay"}
              </h1>
              <p className="mt-4 max-w-xl text-chronos-ivory/85">
                {vi
                  ? `${TOTAL_CABINS} phòng nghỉ hướng biển, mỗi hạng phòng là một cách cảm nhận khác nhau về Hạ Long.`
                  : `${TOTAL_CABINS} sea-facing cabins, each category offering its own way of experiencing Ha Long.`}
              </p>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <Reveal className="mb-14 max-w-2xl">
            <p className="eyebrow mb-5 text-chronos-gold">{vi ? "HẠNG PHÒNG" : "CABIN CATEGORIES"}</p>
            <h2 className="mb-4 text-3xl tracking-[0.02em] text-chronos-ink sm:text-4xl">
              {vi ? `Các hạng phòng, ${TOTAL_CABINS} lựa chọn` : `Cabin categories, ${TOTAL_CABINS} cabins`}
            </h2>
            <p className="text-chronos-stone/85">
              {vi
                ? "Tất cả các phòng đều hướng biển, sử dụng 1 giường đôi hoặc 2 giường đơn tuỳ yêu cầu của khách."
                : "Every cabin faces the sea and can be arranged with one double bed or two twin beds on request."}
            </p>
          </Reveal>

          <div className="grid gap-8 md:grid-cols-2">
            {cabinTypes.map((cabin, index) => (
              <Reveal key={cabin.id} delay={80 * index}>
                <article className="flex h-full flex-col overflow-hidden rounded-sm border border-chronos-ink/10 bg-card">
                  <Link
                    to="/cabins/$cabinId"
                    params={{ cabinId: cabin.id }}
                    className="group block overflow-hidden"
                  >
                    <img
                      src={cabin.hero}
                      alt={vi ? cabin.nameVi : cabin.nameEn}
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
                    />
                  </Link>

                  <div className="flex flex-1 flex-col p-7">
                    {cabin.code ? (
                      <p className="mb-2 text-xs uppercase tracking-[0.24em] text-chronos-gold">
                        {cabin.code}
                      </p>
                    ) : null}
                    <h3 className="mb-3 text-2xl tracking-[0.02em] text-card-foreground">
                      {vi ? cabin.nameVi : cabin.nameEn}
                    </h3>
                    <p className="mb-6 text-sm leading-relaxed text-chronos-stone/85">
                      {vi ? cabin.descVi : cabin.descEn}
                    </p>

                    <dl className="mb-6 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-chronos-ink/10 py-5">
                      <Spec
                        label={
                          cabin.vip
                            ? vi
                              ? AREA_LABEL_VI
                              : AREA_LABEL_EN
                            : vi
                              ? "Diện tích"
                              : "Area"
                        }
                        value={
                          cabin.vip
                            ? vi
                              ? `${cabin.area} tổng diện tích riêng`
                              : `${cabin.area} Total Private Area`
                            : cabin.area
                        }
                      />
                      <Spec
                        label={vi ? "Số phòng" : "Cabins"}
                        value={
                          vi ? `${cabin.roomCount} phòng` : `${cabin.roomCount} cabins`
                        }
                      />
                      <Spec
                        label={vi ? "Giường" : "Bed"}
                        value={vi ? cabin.bedVi : cabin.bedEn}
                        wide
                      />
                      <Spec
                        label={vi ? "Sức chứa tối đa" : "Max occupancy"}
                        value={
                          vi ? `${cabin.maxGuests} khách` : `${cabin.maxGuests} guests`
                        }
                        wide
                      />
                    </dl>

                    {cabin.vip ? (
                      <p className="-mt-3 mb-6 text-xs leading-relaxed text-chronos-stone/70">
                        {vi ? AREA_NOTE_VI : AREA_NOTE_EN}
                      </p>
                    ) : null}

                    <div className="mt-auto flex flex-wrap items-center gap-3">
                      <Button
                        asChild
                        className="btn-sheen rounded-none bg-chronos-gold px-5 text-xs font-semibold uppercase tracking-[0.18em] text-chronos-ink hover:bg-chronos-gold/90"
                      >
                        <a href={QUOTE_LINK} target="_blank" rel="noopener noreferrer">
                          {vi ? "Liên hệ báo giá" : "Request a quote"}
                        </a>
                      </Button>
                      <Link
                        to="/cabins/$cabinId"
                        params={{ cabinId: cabin.id }}
                        className="border-b border-chronos-gold pb-1 text-xs font-semibold uppercase tracking-[0.18em] text-card-foreground hover:text-chronos-gold"
                      >
                        {vi ? "Xem chi tiết" : "View details"}
                      </Link>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setCompareCabin(cabin)}
                        className="rounded-none border-chronos-gold/50 text-xs font-semibold uppercase tracking-[0.18em] text-card-foreground hover:border-chronos-gold hover:bg-chronos-gold/10 hover:text-chronos-gold"
                      >
                        {vi ? "So sánh chi tiết" : "Compare details"}
                      </Button>
                    </div>

                  </div>
                </article>
              </Reveal>
            ))}
          </div>


          <Reveal className="mt-16">
            <p className="eyebrow mb-5 text-chronos-gold">{vi ? "BẢNG SO SÁNH SUITE" : "SUITE COMPARISON"}</p>

            {/* Desktop / tablet: table keeps the requested column structure */}
            <div className="hidden overflow-x-auto rounded-sm border border-chronos-ink/10 sm:block">
              <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-chronos-ink/[0.04] text-xs uppercase tracking-[0.2em] text-chronos-stone/70">
                    <th className="sticky left-0 z-10 bg-chronos-ink/[0.04] px-5 py-4 font-medium shadow-[2px_0_6px_-2px_rgba(0,0,0,0.08)]">
                      {vi ? "Hạng phòng" : "Cabin type"}
                    </th>
                    <th className="px-5 py-4 font-medium">{vi ? AREA_LABEL_VI : AREA_LABEL_EN}</th>
                    <th className="px-5 py-4 font-medium">{vi ? "Giường" : "Bed"}</th>
                    <th className="px-5 py-4 font-medium">{vi ? "Sân riêng" : "Private terrace"}</th>
                    <th className="px-5 py-4 font-medium">{vi ? "Hồ sục ngoài trời" : "Outdoor whirlpool"}</th>
                  </tr>
                </thead>
                <tbody>
                  {vipCabins.map((c) => (
                    <tr key={c.id} className="border-t border-chronos-ink/10 text-chronos-ink">
                      <td className="sticky left-0 z-10 bg-chronos-ivory px-5 py-4 shadow-[2px_0_6px_-2px_rgba(0,0,0,0.08)]">
                        {c.code}
                      </td>
                      <td className="px-5 py-4">{c.area}</td>
                      <td className="px-5 py-4">King</td>
                      <td className="px-5 py-4">{vi ? "Có" : "Included"}</td>
                      <td className="px-5 py-4">{vi ? "Có" : "Included"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile: same 5 data points, no overflow, card layout */}
            <div className="space-y-4 sm:hidden">
              {vipCabins.map((c) => (
                <article
                  key={c.id}
                  className="rounded-sm border border-chronos-ink/10 bg-card p-5"
                >
                  <p className="mb-1 text-xs uppercase tracking-[0.2em] text-chronos-stone/70">
                    {vi ? "Hạng phòng" : "Cabin type"}
                  </p>
                  <p className="mb-4 text-sm font-medium text-card-foreground">{c.code}</p>
                  <dl className="space-y-3 text-xs">
                    <div className="flex items-start justify-between gap-4 border-b border-chronos-ink/10 pb-3">
                      <dt className="text-chronos-stone/70">{vi ? AREA_LABEL_VI : AREA_LABEL_EN}</dt>
                      <dd className="font-medium text-card-foreground">{c.area}</dd>
                    </div>
                    <div className="flex items-start justify-between gap-4 border-b border-chronos-ink/10 pb-3">
                      <dt className="text-chronos-stone/70">{vi ? "Giường" : "Bed"}</dt>
                      <dd className="font-medium text-card-foreground">King</dd>
                    </div>
                    <div className="flex items-start justify-between gap-4 border-b border-chronos-ink/10 pb-3">
                      <dt className="text-chronos-stone/70">{vi ? "Sân riêng" : "Private terrace"}</dt>
                      <dd className="font-medium text-card-foreground">{vi ? "Có" : "Included"}</dd>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <dt className="text-chronos-stone/70">{vi ? "Hồ sục ngoài trời" : "Outdoor whirlpool"}</dt>
                      <dd className="font-medium text-card-foreground">{vi ? "Có" : "Included"}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>

            <p className="mt-4 text-xs leading-relaxed text-chronos-stone/70">
              {vi ? AREA_NOTE_VI : AREA_NOTE_EN}
            </p>
          </Reveal>

          <Reveal className="mt-8 rounded-sm border border-chronos-gold/30 bg-chronos-gold/5 p-6">
            <p className="text-sm leading-relaxed text-chronos-stone/85">
              {vi
                ? "Junior Suite loại A và loại B có sức chứa khác nhau. Số khách tối đa của từng phòng cụ thể sẽ được xác nhận khi bạn chọn phòng, không áp dụng chung một con số cho cả nhóm Junior Suite."
                : "Junior Suite type A and type B have different maximum occupancies. The exact figure is confirmed per individual cabin at the time of selection rather than applied to the Junior Suite group as a whole."}
            </p>
          </Reveal>

          <Reveal className="mt-24 border-t border-chronos-ink/10 pt-16 text-center">
            <h2 className="mb-4 text-3xl tracking-[0.02em] text-chronos-ink">
              {vi ? "Chọn phòng phù hợp với bạn" : "Find the cabin that fits you"}
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-chronos-stone/85">
              {vi
                ? "Để lại thông tin, đội ngũ Chronos sẽ tư vấn hạng phòng và báo giá trong 24 giờ."
                : "Leave your details and our team will advise on cabins and pricing within 24 hours."}
            </p>
            <Button
              asChild
              className="btn-sheen rounded-none bg-chronos-gold px-8 text-xs font-semibold uppercase tracking-[0.18em] text-chronos-ink hover:bg-chronos-gold/90"
            >
              <a href={QUOTE_LINK} target="_blank" rel="noopener noreferrer">
                {vi ? "Liên hệ báo giá" : "Request a quote"}
              </a>
            </Button>
          </Reveal>
        </div>
      </main>

      <Footer t={t} />

      <CabinCompareDialog
        cabin={compareCabin}
        open={!!compareCabin}
        onClose={() => setCompareCabin(null)}
        vi={vi}
      />
    </div>
  );
}

function CabinCompareDialog({
  cabin,
  open,
  onClose,
  vi,
}: {
  cabin: CabinType | null;
  open: boolean;
  onClose: () => void;
  vi: boolean;
}) {
  // Giữ lại dữ liệu phòng cuối cùng để dialog có animation đóng mượt
  const [shown, setShown] = useState<CabinType | null>(cabin);
  const [loading, setLoading] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    if (cabin) {
      setShown(cabin);
      setImgLoaded(false);
      setLoading(true);
      const t = setTimeout(() => setLoading(false), 420);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [cabin]);

  if (!shown) return null;

  const rows = [
    { label: vi ? "Hạng phòng" : "Cabin type", value: vi ? shown.nameVi : shown.nameEn },
    ...(shown.code ? [{ label: vi ? "Mã kỹ thuật" : "Technical code", value: shown.code }] : []),
    {
      label: shown.vip ? (vi ? AREA_LABEL_VI : AREA_LABEL_EN) : vi ? "Diện tích" : "Area",
      value: shown.vip
        ? vi
          ? `${shown.area} tổng diện tích riêng`
          : `${shown.area} Total Private Area`
        : shown.area,
    },
    { label: vi ? "Giường" : "Bed", value: vi ? shown.bedVi : shown.bedEn },
    {
      label: vi ? "Sức chứa tối đa" : "Max occupancy",
      value: vi ? `${shown.maxGuests} khách` : `${shown.maxGuests} guests`,
    },
    { label: vi ? "Số phòng" : "Cabins", value: vi ? `${shown.roomCount} phòng` : `${shown.roomCount} cabins` },
    { label: vi ? "Tầm nhìn" : "View", value: shown.view },
    ...(shown.vip
      ? [
          { label: vi ? "Sân riêng" : "Private terrace", value: vi ? "Có" : "Included" },
          { label: vi ? "Hồ sục ngoài trời" : "Outdoor whirlpool", value: vi ? "Có" : "Included" },
        ]
      : []),
  ];

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto rounded-sm border-chronos-ink/10 bg-card p-0 duration-300 sm:max-w-lg">
        <div className="relative h-40 w-full overflow-hidden bg-chronos-ink/10 sm:h-48">
          {!imgLoaded ? <Skeleton className="absolute inset-0 h-full w-full rounded-none" /> : null}
          <img
            src={shown.hero}
            alt={vi ? shown.nameVi : shown.nameEn}
            onLoad={() => setImgLoaded(true)}
            className={cn(
              "h-full w-full object-cover transition-all duration-500",
              imgLoaded ? "scale-100 opacity-100 blur-0" : "scale-105 opacity-0 blur-sm",
            )}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-chronos-ink/80 via-chronos-ink/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-5">
            {shown.code ? (
              <p className="mb-1 text-xs uppercase tracking-[0.24em] text-chronos-gold">{shown.code}</p>
            ) : null}
            <p className="text-xl text-chronos-ivory">{vi ? shown.nameVi : shown.nameEn}</p>
          </div>
        </div>

        <div className="px-5 pb-6 pt-2">
          <DialogHeader className="mb-3">
            <DialogTitle className="text-left text-lg tracking-[0.02em] text-card-foreground">
              {vi ? "So sánh chi tiết" : "Compare details"}
            </DialogTitle>
            <DialogDescription className="text-left text-xs text-muted-foreground">
              {loading
                ? vi
                  ? "Đang tải dữ liệu so sánh…"
                  : "Loading comparison data…"
                : vi
                  ? "Thông tin nhanh về hạng phòng này."
                  : "Quick overview for this cabin category."}
            </DialogDescription>
          </DialogHeader>

          {loading ? (
            <div
              aria-busy="true"
              aria-live="polite"
              className="divide-y divide-chronos-ink/10 border-y border-chronos-ink/10"
            >
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between gap-4 py-3">
                  <Skeleton className="h-3 w-24 rounded-sm" />
                  <Skeleton className="h-3 w-28 rounded-sm" />
                </div>
              ))}
            </div>
          ) : (
            <dl className="animate-in fade-in slide-in-from-bottom-1 divide-y divide-chronos-ink/10 border-y border-chronos-ink/10 text-sm duration-300">
              {rows.map((r) => (
                <div key={r.label} className="flex items-baseline justify-between gap-4 py-3">
                  <dt className="text-xs uppercase tracking-[0.2em] text-chronos-stone/70">{r.label}</dt>
                  <dd className="text-right text-card-foreground">{r.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {shown.vip && !loading ? (
            <p className="animate-in fade-in mt-3 text-xs leading-relaxed text-chronos-stone/70 duration-300">
              {vi ? AREA_NOTE_VI : AREA_NOTE_EN}
            </p>
          ) : null}

          <div className="mt-5 flex flex-wrap gap-3">
            <Button
              asChild
              disabled={loading}
              className="btn-sheen flex-1 rounded-none bg-chronos-gold text-xs font-semibold uppercase tracking-[0.18em] text-chronos-ink transition-opacity hover:bg-chronos-gold/90"
            >
              <a href={QUOTE_LINK} target="_blank" rel="noopener noreferrer">
                {vi ? "Liên hệ báo giá" : "Request a quote"}
              </a>
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-none border-chronos-ink/20 text-xs font-semibold uppercase tracking-[0.18em] text-card-foreground hover:bg-chronos-ink/5"
            >
              {vi ? "Đóng" : "Close"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


function Spec({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={wide ? "col-span-2 sm:col-span-1" : ""}>
      <dt className="text-xs uppercase tracking-[0.24em] text-chronos-stone/70">{label}</dt>
      <dd className="mt-1 text-sm text-card-foreground">{value}</dd>
    </div>
  );
}
