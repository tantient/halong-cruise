"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { useLanguage } from "@/components/landing/use-language";
import { Reveal } from "@/components/landing/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { formUi } from "@/lib/i18n/ui-forms";
import { publicQueries, submitPublicLead, type PublicPage, type PublicPageBundle } from "@/lib/platform";

function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-11.419c-3.223 0-6.168 1.807-7.68 4.643l-.153.298-2.955.96.772-2.88C.589 9.406 0 11.382 0 13.5 0 19.299 4.701 24 10.5 24c1.631 0 3.192-.372 4.614-1.042l3.17 1.834-.86-3.17c1.63-1.765 2.576-4.07 2.576-6.622 0-5.799-4.701-10.5-10.5-10.5m-6.474 21.14-.422 1.548-1.625-1.006c-3.322-1.833-5.451-5.307-5.451-9.182 0-5.799 4.701-10.5 10.5-10.5 5.799 0 10.5 4.701 10.5 10.5 0 5.799-4.701 10.5-10.5 10.5-1.477 0-2.886-.305-4.17-.852z" />
    </svg>
  );
}

function str(page: PublicPage | null, key: string): string {
  const v = page?.text[key];
  return typeof v === "string" ? v : "";
}

/** Digits-only phone for `tel:` / chat deep links. */
function dial(value: string | null): string {
  if (!value) return "";
  const cleaned = value.replace(/[^\d+]/g, "");
  return cleaned.startsWith("+") ? cleaned : cleaned ? `+${cleaned}` : "";
}

/** Heritage contact template — details, map and copy from the database. */
export function ContactPage({ bundle }: { bundle: PublicPageBundle }) {
  const { uiLang: lang, setLang, t, href } = useLanguage();
  const { data } = useSuspenseQuery({
    ...publicQueries.pageBundle(href("/contact"), "contact"),
    initialData: bundle,
  });
  const b = data ?? bundle;
  const page = (b.languages[lang] ?? b.languages[b.ship.defaultLanguage] ?? Object.values(b.languages)[0])?.page ?? null;

  const settings = b.ship.settings;
  const fu = formUi(lang);
  const sendLead = useServerFn(submitPublicLead);
  const [values, setValues] = useState({ name: "", phone: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      // The server resolves the ship from the hostname; no tenant id is sent.
      const res = await sendLead({ data: { type: "contact", pathname: href("/contact"), ...values } });
      if (res.ok) {
        toast.success(t.contact.success);
        setValues({ name: "", phone: "", email: "", subject: "", message: "" });
      } else {
        toast.error(fu.error);
      }
    } catch {
      toast.error(fu.error);
    } finally {
      setSending(false);
    }
  };

  const set = (key: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const phoneDisplay = settings.hotlineDisplay ?? settings.hotline;
  const phoneTel = dial(settings.hotline ?? settings.hotlineDisplay);
  const hero = page?.media.cover ?? null;
  const mapEmbed = str(page, "map_embed");

  const details = [
    phoneDisplay
      ? { icon: Phone, label: t.contact.phone, value: phoneDisplay, href: phoneTel ? `tel:${phoneTel}` : null }
      : null,
    settings.email
      ? { icon: Mail, label: t.contact.email, value: settings.email, href: `mailto:${settings.email}` }
      : null,
    settings.address
      ? { icon: MapPin, label: t.contact.address, value: settings.address, href: settings.googleMaps ?? null }
      : null,
    str(page, "hours_value")
      ? { icon: Clock, label: t.contact.hours, value: str(page, "hours_value"), href: null }
      : null,
  ].filter((d): d is { icon: typeof Phone; label: string; value: string; href: string | null } => d !== null);

  return (
    <div className="min-h-screen bg-chronos-ivory">
      <Header lang={lang} setLang={setLang} t={t} />

      <main>
        <section className="relative h-[52vh] min-h-[360px] w-full overflow-hidden">
          {hero ? (
            <img
              src={hero.url}
              alt={str(page, "hero_alt") || hero.alt || b.ship.ship.displayName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-chronos-ink/80" />
          )}
          <div className="hero-local-scrim absolute inset-0" />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-7xl px-6 pb-14 lg:px-8">
              <p className="eyebrow mb-5 text-chronos-gold">{str(page, "eyebrow")}</p>
              <h1 className="max-w-3xl text-4xl tracking-[0.02em] text-chronos-ivory sm:text-5xl">
                {page?.title ?? ""}
              </h1>
              <p className="mt-4 max-w-xl text-chronos-ivory/85">{str(page, "subtitle") || page?.intro || ""}</p>
            </div>
          </div>
        </section>

        <div className="mx-auto grid max-w-7xl gap-14 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
          <Reveal className="space-y-8">
            <div className="space-y-6">
              {details.map(({ icon: Icon, label, value, href: link }) => (
                <div key={label} className="flex gap-4">
                  <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center border border-chronos-gold/40 text-chronos-gold">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-chronos-stone/70">{label}</p>
                    {link ? (
                      <a
                        href={link}
                        target={link.startsWith("http") ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="text-chronos-ink transition-colors hover:text-chronos-gold"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-chronos-ink">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              {settings.whatsapp ? (
                <Button
                  asChild
                  className="btn-sheen rounded-none bg-chronos-gold px-7 text-xs font-semibold uppercase tracking-[0.18em] text-chronos-ink hover:bg-chronos-gold/90"
                >
                  <a href={settings.whatsapp} target="_blank" rel="noopener noreferrer">
                    <WhatsAppIcon className="mr-2 h-4 w-4" />
                    {t.contact.chatWhatsApp}
                  </a>
                </Button>
              ) : null}
              {phoneTel ? (
                <Button
                  asChild
                  variant="outline"
                  className="rounded-none border-chronos-ink/20 px-7 text-xs font-semibold uppercase tracking-[0.18em] text-chronos-ink hover:bg-chronos-ink/5"
                >
                  <a href={`tel:${phoneTel}`}>{t.contact.call}</a>
                </Button>
              ) : null}
            </div>

            {mapEmbed ? (
              <div>
                <h2 className="mb-4 text-xs uppercase tracking-[0.24em] text-chronos-stone/70">{t.contact.mapTitle}</h2>
                <div className="aspect-[4/3] w-full overflow-hidden border border-chronos-ink/10">
                  <iframe
                    title={t.contact.mapTitle}
                    src={mapEmbed}
                    loading="lazy"
                    className="h-full w-full"
                    style={{ border: 0 }}
                  />
                </div>
              </div>
            ) : null}
          </Reveal>

          <Reveal
            as="form"
            onSubmit={handleSubmit}
            className="h-fit border border-chronos-ink/10 bg-chronos-ink/[0.02] p-7 sm:p-10"
          >
            <h2 className="mb-2 text-3xl tracking-[0.02em] text-chronos-ink">
              {str(page, "form_title") || t.contact.formTitle}
            </h2>
            <p className="mb-8 text-sm text-chronos-stone/85">
              {str(page, "form_subtitle") || t.contact.formSubtitle}
            </p>

            <div className="grid gap-7 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="c-name" className="text-xs uppercase tracking-[0.24em] text-chronos-stone/70">
                  {t.contact.name}
                </Label>
                <Input id="c-name" value={values.name} onChange={set("name")} required className="field-underline border-chronos-ink/20 focus:border-chronos-gold" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-phone" className="text-xs uppercase tracking-[0.24em] text-chronos-stone/70">
                  {t.contact.phoneField}
                </Label>
                <Input id="c-phone" type="tel" value={values.phone} onChange={set("phone")} required className="field-underline border-chronos-ink/20 focus:border-chronos-gold" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-email" className="text-xs uppercase tracking-[0.24em] text-chronos-stone/70">
                  {t.contact.email}
                </Label>
                <Input id="c-email" type="email" value={values.email} onChange={set("email")} className="field-underline border-chronos-ink/20 focus:border-chronos-gold" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-subject" className="text-xs uppercase tracking-[0.24em] text-chronos-stone/70">
                  {t.contact.subject}
                </Label>
                <Input id="c-subject" value={values.subject} onChange={set("subject")} className="field-underline border-chronos-ink/20 focus:border-chronos-gold" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="c-message" className="text-xs uppercase tracking-[0.24em] text-chronos-stone/70">
                  {t.contact.message}
                </Label>
                <Textarea id="c-message" rows={5} value={values.message} onChange={set("message")} required className="field-underline border-chronos-ink/20 focus:border-chronos-gold" />
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={sending}
              className="btn-sheen mt-10 w-full rounded-none bg-chronos-gold text-xs font-semibold uppercase tracking-[0.2em] text-chronos-ink hover:bg-chronos-gold/90"
            >
              {t.contact.submit}
            </Button>
          </Reveal>
        </div>
      </main>

      <Footer t={t} />
    </div>
  );
}
