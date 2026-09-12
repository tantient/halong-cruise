import { useRouterState } from "@tanstack/react-router";

import { useLanguage } from "@/lib/i18n/language-context";
import { enquiryUrl, useSite } from "@/lib/platform";

/** Official WhatsApp glyph. */
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.966 1.164-.198.199-.396.223-.693.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.174-.297-.019-.458.13-.606.134-.133.347-.397.52-.595.174-.198.232-.34.347-.567.116-.226.058-.425-.028-.594-.086-.17-.664-1.6-.91-2.19-.24-.575-.484-.492-.664-.5l-.564-.01c-.198 0-.52.075-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.073.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.29.173-1.413-.074-.124-.272-.198-.57-.347Z" />
      <path d="M20.52 3.449A11.86 11.86 0 0 0 12.05 0C5.495 0 .16 5.334.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.304-1.654a11.86 11.86 0 0 0 5.741 1.463h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.423-8.467ZM12.05 21.786h-.004a9.86 9.86 0 0 1-5.024-1.375l-.36-.214-3.74.981.999-3.648-.235-.374a9.83 9.83 0 0 1-1.51-5.264c.002-5.45 4.437-9.884 9.888-9.884a9.82 9.82 0 0 1 6.987 2.898 9.82 9.82 0 0 1 2.892 6.994c-.003 5.45-4.438 9.886-9.893 9.886Z" />
    </svg>
  );
}

/**
 * Global quick-contact shortcut: opens the ship's verified WhatsApp channel
 * with the same prefilled message the CTAs use. Hidden on admin/auth routes
 * and when the ship has no WhatsApp channel configured.
 */
export function FloatingWhatsApp() {
  const site = useSite();
  const { lang, t } = useLanguage();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isPrivate = /^\/(admin|auth)(\/|$)/.test(pathname);
  const whatsapp = site?.settings.whatsapp ?? null;
  if (isPrivate || !whatsapp) return null;

  const href = enquiryUrl(
    { ...site!.settings, bookingUrl: null, whatsapp },
    { shipName: site!.ship.displayName, language: lang },
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.contact.chatWhatsApp}
      className="fixed right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:right-7 sm:h-14 sm:w-14"
      style={{
        bottom: "calc(1rem + env(safe-area-inset-bottom, 0px))",
        right: "calc(1rem + env(safe-area-inset-right, 0px))",
      }}
    >
      <WhatsAppIcon className="h-6 w-6 sm:h-7 sm:w-7" />
    </a>
  );
}
