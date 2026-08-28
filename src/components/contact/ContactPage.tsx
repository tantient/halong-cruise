"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { useLanguage } from "@/components/landing/use-language";
import { Reveal } from "@/components/landing/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import heroAsset from "@/assets/gallery/chronos-exterior-01.webp";

const PHONE = "+84 902 000 000";
const PHONE_TEL = "+84902000000";
const ZALO_LINK = "https://zalo.me/84902000000";
const EMAIL = "booking@chronoscruise.com";
const MAP_EMBED =
  "https://www.openstreetmap.org/export/embed.html?bbox=107.0430%2C20.9420%2C107.0930%2C20.9720&layer=mapnik&marker=20.9570%2C107.0680";
const MAP_LINK = "https://www.openstreetmap.org/?mlat=20.9570&mlon=107.0680#map=15/20.9570/107.0680";

export function ContactPage() {
  const { lang, setLang, t } = useLanguage();
  const [values, setValues] = useState({ name: "", phone: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t.contact.success);
    setValues({ name: "", phone: "", email: "", subject: "", message: "" });
  };

  const set = (key: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const details = [
    { icon: Phone, label: t.contact.phone, value: PHONE, href: `tel:${PHONE_TEL}` },
    { icon: MessageCircle, label: t.contact.zalo, value: PHONE, href: ZALO_LINK },
    { icon: Mail, label: t.contact.email, value: EMAIL, href: `mailto:${EMAIL}` },
    { icon: MapPin, label: t.contact.address, value: t.contact.addressValue, href: MAP_LINK },
    { icon: Clock, label: t.contact.hours, value: t.contact.hoursValue },
  ];

  return (
    <div className="min-h-screen bg-chronos-ivory">
      <Header lang={lang} setLang={setLang} t={t} />

      <main>
        <section className="relative h-[52vh] min-h-[360px] w-full overflow-hidden">
          <img
            src={heroAsset}
            alt={lang === "vi" ? "Du thuyền Chronos Cruise trên vịnh Hạ Long" : "Chronos Cruise on Ha Long Bay"}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-chronos-ink/85 via-chronos-ink/30 to-chronos-ink/40" />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-7xl px-6 pb-14 lg:px-8">
              <p className="eyebrow mb-5 text-chronos-gold">{t.contact.label}</p>
              <h1 className="max-w-3xl text-4xl tracking-[0.02em] text-chronos-ivory sm:text-5xl">
                {t.contact.title}
              </h1>
              <p className="mt-4 max-w-xl text-chronos-ivory/85">{t.contact.subtitle}</p>
            </div>
          </div>
        </section>

        <div className="mx-auto grid max-w-7xl gap-14 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
          <Reveal className="space-y-8">
            <div className="space-y-6">
              {details.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex gap-4">
                  <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center border border-chronos-gold/40 text-chronos-gold">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-chronos-stone/70">{label}</p>
                    {href ? (
                      <a
                        href={href}
                        target={href.startsWith("http") ? "_blank" : undefined}
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
              <Button
                asChild
                className="btn-sheen rounded-none bg-chronos-gold px-7 text-xs font-semibold uppercase tracking-[0.18em] text-chronos-ink hover:bg-chronos-gold/90"
              >
                <a href={ZALO_LINK} target="_blank" rel="noopener noreferrer">
                  {t.contact.chatZalo}
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-none border-chronos-ink/20 px-7 text-xs font-semibold uppercase tracking-[0.18em] text-chronos-ink hover:bg-chronos-ink/5"
              >
                <a href={`tel:${PHONE_TEL}`}>{t.contact.call}</a>
              </Button>
            </div>

            <div>
              <h2 className="mb-4 text-xs uppercase tracking-[0.24em] text-chronos-stone/70">
                {t.contact.mapTitle}
              </h2>
              <div className="aspect-[4/3] w-full overflow-hidden border border-chronos-ink/10">
                <iframe
                  title={t.contact.mapTitle}
                  src={MAP_EMBED}
                  loading="lazy"
                  className="h-full w-full"
                  style={{ border: 0 }}
                />
              </div>
            </div>
          </Reveal>

          <Reveal
            as="form"
            onSubmit={handleSubmit}
            className="h-fit border border-chronos-ink/10 bg-chronos-ink/[0.02] p-7 sm:p-10"
          >
            <h2 className="mb-2 text-3xl tracking-[0.02em] text-chronos-ink">{t.contact.formTitle}</h2>
            <p className="mb-8 text-sm text-chronos-stone/85">{t.contact.formSubtitle}</p>

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
