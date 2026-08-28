import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, MessageCircle } from "lucide-react";

import { ChronosLogo } from "./ChronosLogo";

interface FooterProps {
  t: {
    footer: { rights: string; tagline: string; quickLinks: string; contact: string[] };
    nav: {
      about: string;
      careers: string;
      itineraries: string;
      cabins: string;
      services: string;
      gallery: string;
      offers: string;
      contact: string;
    };
  };
}

const SOCIALS = [
  { label: "Facebook", href: "https://facebook.com/", Icon: Facebook },
  { label: "Instagram", href: "https://instagram.com/", Icon: Instagram },
  { label: "Zalo", href: "https://zalo.me/", Icon: MessageCircle },
];

export function Footer({ t }: FooterProps) {
  const quickLinks = [
    { label: t.nav.about, to: "/about" as const },
    { label: t.nav.careers, to: "/careers" as const },
    { label: t.nav.itineraries, to: "/itineraries" as const },
    { label: t.nav.cabins, to: "/cabins" as const },
    { label: t.nav.services, to: "/services/$serviceId" as const, params: { serviceId: "dining" } },
    { label: t.nav.gallery, to: "/gallery" as const },
    { label: t.nav.offers, to: "/offers" as const },
    { label: t.nav.contact, to: "/contact" as const },
  ];

  return (
    <footer className="border-t border-chronos-sand-300/20 bg-chronos-ivory">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-12 text-center">
          <ChronosLogo
            variant="stacked"
            showTagline={false}
            size="md"
            tone="auto"
            aria-label="Chronos Cruise"
          />


          <p className="text-xs uppercase tracking-[0.32em] text-chronos-sand-700">
            {t.footer.tagline}
          </p>


          <nav className="flex flex-wrap justify-center gap-x-12 gap-y-4 text-xs uppercase tracking-[0.2em] text-chronos-sand-700">
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                {...(link.params ? { params: link.params } : {})}
                className="transition-colors hover:text-chronos-sand-500"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex gap-6">
            {SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-chronos-sand-300/30 text-chronos-sand-700 transition-colors hover:border-chronos-sand-500 hover:text-chronos-sand-500"
              >
                <Icon className="h-4 w-4" strokeWidth={1.5} />
              </a>
            ))}
          </div>

          <div className="text-xs tracking-wide text-chronos-sand-700/60">
            {t.footer.rights}
          </div>
        </div>
      </div>
    </footer>
  );
}
