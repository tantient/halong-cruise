"use client";

/**
 * Service menu of the resolved ship, loaded once in the root loader so every
 * page's header renders the tenant's own services (no static brand data).
 */

import { createContext, useContext, type ReactNode } from "react";

import type { ServiceNav, ServiceNavItem } from "@/lib/platform";

const ServiceNavContext = createContext<ServiceNav | null>(null);

export function ServiceNavProvider({ nav, children }: { nav: ServiceNav | null; children: ReactNode }) {
  return <ServiceNavContext.Provider value={nav}>{children}</ServiceNavContext.Provider>;
}

/** Menu items for a language, falling back to any available language. */
export function useServiceNav(language: string): ServiceNavItem[] {
  const nav = useContext(ServiceNavContext);
  if (!nav) return [];
  return nav.languages[language as keyof typeof nav.languages] ?? Object.values(nav.languages)[0] ?? [];
}
