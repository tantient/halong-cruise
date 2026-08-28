"use client";

import { Anchor, ChefHat, ConciergeBell, Heart, Leaf, ShieldCheck, Waves, type LucideIcon } from "lucide-react";

import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { useLanguage } from "@/components/landing/use-language";
import { Reveal } from "@/components/landing/Reveal";
import exteriorImg from "@/assets/gallery/chronos-exterior-01.webp";
import lobbyImg from "@/assets/gallery/chronos-public-lobby-01.webp";
import diningImg from "@/assets/gallery/chronos-dining-panorama-01.webp";

const featureIcons: LucideIcon[] = [Waves, ChefHat, ConciergeBell, Anchor];
const valueIcons: LucideIcon[] = [Heart, ShieldCheck, Leaf, Anchor];

export function AboutPage() {
  const { lang, setLang, t } = useLanguage();
  const vi = lang === "vi";

  const features = t.about.features;
  const values = t.about.values.items;

  return (
    <div className="min-h-screen bg-chronos-ivory">
      <Header lang={lang} setLang={setLang} t={t} />

      <main>
        <section className="relative h-[65vh] min-h-[420px] w-full overflow-hidden">
          <img
            src={exteriorImg}
            alt={vi ? "Du thuyền Chronos trên vịnh Hạ Long" : "Chronos Cruise on Ha Long Bay"}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-chronos-ink/85 via-chronos-ink/30 to-chronos-ink/40" />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-7xl px-6 pb-16 lg:px-8">
              <p className="eyebrow mb-5 text-chronos-gold">{t.about.label}</p>
              <h1 className="max-w-3xl text-4xl tracking-[0.02em] text-chronos-ivory sm:text-5xl lg:text-6xl">
                {t.about.title}
              </h1>
            </div>
          </div>
        </section>

        <section className="relative py-28 lg:py-36">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
              <Reveal>
                <p className="mb-6 text-lg leading-relaxed text-chronos-stone/90">
                  {t.about.body}
                </p>
              </Reveal>

              <div className="grid gap-5 sm:grid-cols-2">
                {features.map((feature, idx) => {
                  const Icon = featureIcons[idx % featureIcons.length]!;
                  return (
                    <Reveal key={feature.title} delay={120 * idx}>
                      <div className="group h-full border border-chronos-ink/10 bg-chronos-warm/25 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-chronos-gold/60 hover:bg-chronos-ivory">
                        <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-full border border-chronos-gold/50 transition-colors duration-500 group-hover:border-chronos-gold">
                          <Icon className="h-5 w-5 text-chronos-gold" strokeWidth={1.25} />
                        </span>
                        <h3 className="mb-2 text-xl tracking-[0.02em] text-chronos-ink">
                          {feature.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-chronos-stone/80">
                          {feature.desc}
                        </p>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mx-auto mt-28 h-px max-w-7xl bg-gradient-to-r from-transparent via-chronos-gold/45 to-transparent" />
        </section>

        <section className="bg-chronos-warm/20 py-28 lg:py-36">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <Reveal className="mb-14 max-w-2xl">
              <p className="eyebrow mb-6 text-chronos-gold">{t.about.values.label}</p>
              <h2 className="mb-4 text-4xl tracking-[0.02em] text-chronos-ink sm:text-5xl">
                {t.about.values.title}
              </h2>
            </Reveal>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((v, idx) => {
                const Icon = valueIcons[idx % valueIcons.length]!;
                return (
                  <Reveal key={v.title} delay={120 * idx}>
                    <div className="h-full border-t border-chronos-gold/40 pt-6">
                      <Icon className="mb-4 h-6 w-6 text-chronos-gold" strokeWidth={1.25} />
                      <h3 className="mb-2 text-xl tracking-[0.02em] text-chronos-ink">{v.title}</h3>
                      <p className="text-sm leading-relaxed text-chronos-stone/80">{v.desc}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-28 lg:py-36">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <Reveal>
                <div className="grid gap-5">
                  <img
                    src={lobbyImg}
                    alt={vi ? "Sảnh đón Chronos" : "Chronos lobby"}
                    loading="lazy"
                    className="aspect-[16/10] w-full rounded-sm object-cover"
                  />
                  <img
                    src={diningImg}
                    alt={vi ? "Nhà hàng Panorama" : "Panorama Restaurant"}
                    loading="lazy"
                    className="aspect-[16/10] w-full rounded-sm object-cover"
                  />
                </div>
              </Reveal>
              <Reveal delay={160}>
                <p className="eyebrow mb-6 text-chronos-gold">{vi ? "TẦM NHÌN" : "VISION"}</p>
                <h2 className="mb-6 text-4xl tracking-[0.02em] text-chronos-ink sm:text-5xl">
                  {vi
                    ? "Nơi mỗi chuyến đi là một tác phẩm"
                    : "Where every voyage becomes a work of art"}
                </h2>
                <p className="text-lg leading-relaxed text-chronos-stone/90">
                  {vi
                    ? "Chronos không chỉ là một chuyến du ngoạn. Chúng tôi kết hợp kiến trúc tinh tế, dịch vụ chu đáo và cảnh quan kỳ vĩ để tạo nên những kỷ niệm khó quên giữa lòng di sản thiên nhiên thế giới."
                    : "Chronos is more than a sightseeing trip. We blend refined architecture, thoughtful service and a spectacular landscape to create unforgettable memories in the heart of a UNESCO natural wonder."}
                </p>
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      <Footer t={t} />
    </div>
  );
}
