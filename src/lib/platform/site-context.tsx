"use client";

/**
 * Resolved tenant (ship) for the current request, provided once by the root
 * route so shared chrome (header, footer) reads branding, contact details and
 * social links from the database instead of hardcoded brand constants.
 */

import { createContext, useContext, type ReactNode } from "react";

import type { ShipContext } from "./types";

const SiteContext = createContext<ShipContext | null>(null);

export function SiteProvider({ site, children }: { site: ShipContext | null; children: ReactNode }) {
  return <SiteContext.Provider value={site}>{children}</SiteContext.Provider>;
}

/** Resolved ship context, or null when the host belongs to no live ship. */
export function useSite(): ShipContext | null {
  return useContext(SiteContext);
}
