"use client";

import { MessageCircle, Mail, MapPin, Clock } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { useLanguage } from "@/components/landing/use-language";
import { Reveal } from "@/components/landing/Reveal";
import { Button } from "@/components/ui/button";
import { publicQueries, type PublicCareersBundle, type PublicPage } from "@/lib/platform";

function str(page: PublicPage | null, key: string): string {
  const v = page?.text[key];
  return typeof v === "string" ? v : "";
}

/** Heritage careers template — positions, copy and contacts from the database. */
export function CareersPage({ bundle }: { bundle: PublicCareersBundle }) {
  const { uiLang: lang, setLang, t, href } = useLanguage();
  const tc = t.careers;
  const { data } = useSuspenseQuery({ ...publicQueries.careersBundle(href("/careers")), initialData: bundle });
  const b = data ?? bundle;

  const perLang = b.languages[lang] ?? b.languages[b.ship.defaultLanguage] ?? Object.values(b.languages)[0]!;
  const { jobs, page } = perLang;
  const settings = b.ship.settings;
  const hero = page?.media.cover ?? null;
  const emailLink = settings.recruitEmail
    ? `mailto:${settings.recruitEmail}?subject=${encodeURIComponent(page?.title ?? "Application")}`
    : null;

  return (
    <div className="min-h-screen bg-chronos-ivory">
      <Header lang={lang} setLang={setLang} t={t} />

      <main>
        <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
          {hero ? (
            <img
              src={hero.url}
              alt={str(page, "hero_alt") || hero.alt || b.ship.ship.displayName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-chronos-ink/80" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-chronos-ink/85 via-chronos-ink/30 to-chronos-ink/40" />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-7xl px-6 pb-16 lg:px-8">
              <p className="eyebrow mb-5 text-chronos-gold">{str(page, "eyebrow")}</p>
              <h1 className="max-w-3xl text-4xl tracking-[0.02em] text-chronos-ivory sm:text-5xl">
                {page?.title ?? ""}
              </h1>
              <p className="mt-4 max-w-xl text-chronos-ivory/85">{page?.intro ?? ""}</p>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <Reveal className="mb-16 text-center">
            <p className="eyebrow mb-3 text-chronos-gold">{str(page, "openings_label")}</p>
            <h2 className="mb-4 text-3xl tracking-[0.02em] text-chronos-ink">{str(page, "openings_title")}</h2>
            <p className="mx-auto max-w-2xl text-chronos-stone/85">{str(page, "openings_subtitle")}</p>
          </Reveal>

          <div className="grid gap-8 md:grid-cols-2">
            {jobs.map((job) => (
              <Reveal key={job.id}>
                <div className="rounded-sm border border-border bg-card p-8 shadow-sm transition-shadow hover:shadow-md">
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    {job.department ? (
                      <span className="rounded-sm bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        {job.department}
                      </span>
                    ) : null}
                    {job.employmentType ? (
                      <span className="text-[12px] text-muted-foreground">{job.employmentType}</span>
                    ) : null}
                  </div>
                  <h3 className="mb-3 text-2xl tracking-[0.02em] text-card-foreground">{job.title}</h3>
                  {job.description ? <p className="text-chronos-stone/85">{job.description}</p> : null}
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-20 rounded-sm border border-border bg-card p-8 lg:p-12">
            <div className="grid gap-10 lg:grid-cols-2">
              <div>
                <p className="eyebrow mb-3 text-chronos-gold">{str(page, "cta_label")}</p>
                <h2 className="mb-4 text-3xl tracking-[0.02em] text-card-foreground">{str(page, "cta_title")}</h2>
                <p className="mb-8 text-chronos-stone/85">{str(page, "cta_subtitle")}</p>
                <div className="flex flex-wrap gap-3">
                  {settings.zalo ? (
                    <Button
                      asChild
                      className="btn-sheen rounded-none bg-chronos-gold px-6 text-xs font-semibold uppercase tracking-[0.18em] text-chronos-ink hover:bg-chronos-gold/90"
                    >
                      <a href={settings.zalo} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        {tc.contactZalo}
                      </a>
                    </Button>
                  ) : null}
                  {emailLink ? (
                    <Button
                      asChild
                      variant="outline"
                      className="rounded-none border-chronos-ink/15 px-6 text-xs font-semibold uppercase tracking-[0.18em] text-card-foreground hover:bg-chronos-ink/5"
                    >
                      <a href={emailLink}>
                        <Mail className="mr-2 h-4 w-4" />
                        {tc.sendEmail}
                      </a>
                    </Button>
                  ) : null}
                </div>
              </div>
              <div className="space-y-6 border-t border-border pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-card-foreground">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-card-foreground/80">
                      {tc.processLabel}
                    </p>
                    <p className="mt-1 text-chronos-stone/85">{str(page, "process_text")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-card-foreground">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-card-foreground/80">
                      {tc.locationLabel}
                    </p>
                    <p className="mt-1 text-chronos-stone/85">
                      {str(page, "location_text") || settings.address || ""}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </main>

      <Footer t={t} />
    </div>
  );
}
