import { LocalLink } from "@/lib/i18n/language-context";
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

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.521-.075-.149-.669-1.612-.916-2.202-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.521.074-.794.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.134 1.588 5.94L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const SOCIALS = [
  { label: "Facebook", href: "https://www.facebook.com/chronoscruise/", Icon: Facebook },
  { label: "Instagram", href: "https://www.instagram.com/chronos.cruise/", Icon: Instagram },
  { label: "Zalo", href: "https://zalo.me/84902952356", Icon: MessageCircle },
  { label: "WhatsApp", href: "https://wa.me/84902952356", Icon: WhatsAppIcon },
];

export function Footer({ t }: FooterProps) {
  const quickLinks: { label: string; to: string; params?: Record<string, string> }[] = [
    { label: t.nav.offers, to: "/offers" },
    { label: t.nav.about, to: "/about" },
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
              <LocalLink
                key={link.label}
                path={link.to}
                className="transition-colors hover:text-chronos-sand-500"
              >
                {link.label}
              </LocalLink>
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
