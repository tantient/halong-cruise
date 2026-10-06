"use client";

/**
 * Branded Leaflet map for the Contact page — styled to the Chronos palette
 * (warm ivory tiles, gold pin, squared controls). Leaflet is browser-only, so
 * it is imported lazily inside an effect; the component renders a quiet
 * placeholder until the map mounts.
 *
 * Coordinates are parsed from the ship's saved Google Maps embed URL, so the
 * pin follows whatever location the admin saves in Ship Editor. When no
 * coordinates can be parsed, `null` is reported and the caller falls back to
 * the plain embed iframe.
 */
import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";

const GOLD = "#b3893b";
const IVORY = "#f7f2e7";

export function parseEmbedCoords(embed: string): { lat: number; lng: number } | null {
  const at = embed.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (at?.[1] && at[2]) return { lat: parseFloat(at[1]), lng: parseFloat(at[2]) };
  const dims = embed.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/);
  if (dims?.[1] && dims[2]) return { lat: parseFloat(dims[1]), lng: parseFloat(dims[2]) };
  const q = embed.match(/[?&]q=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (q?.[1] && q[2]) return { lat: parseFloat(q[1]), lng: parseFloat(q[2]) };
  return null;
}

const PIN_HTML = `
<svg width="36" height="47" viewBox="0 0 34 44" style="display:block;filter:drop-shadow(0 5px 9px rgba(24,22,14,.38))" aria-hidden="true">
  <path d="M17 0C7.6 0 0 7.6 0 17c0 11.6 17 27 17 27s17-15.4 17-27C34 7.6 26.4 0 17 0z" fill="${GOLD}"/>
  <circle cx="17" cy="16.6" r="6.4" fill="${IVORY}"/>
  <circle cx="17" cy="16.6" r="2.6" fill="${GOLD}"/>
</svg>`;

const POPUP_HTML = (title: string, address: string) => `
<div style="text-align:center;min-width:190px;padding:4px 2px">
  <div style="font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:${GOLD};font-weight:600">${title}</div>
  <div style="font-size:13px;line-height:1.5;color:#26241c;margin-top:5px;white-space:pre-line">${address}</div>
</div>`;

export function ChronosMap({
  embed,
  title,
  address,
}: {
  embed: string;
  title: string;
  address: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const coords = parseEmbedCoords(embed);
    const host = hostRef.current;
    if (!coords || !host) {
      if (!coords) setFailed(true);
      return;
    }

    let map: import("leaflet").Map | null = null;
    let cancelled = false;

    (async () => {
      const L = await import("leaflet");
      if (cancelled || !hostRef.current) return;

      map = L.map(hostRef.current, {
        center: [coords.lat, coords.lng],
        zoom: 16,
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: true,
      });

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      L.marker([coords.lat, coords.lng], {
        icon: L.divIcon({ className: "chronos-map-pin", html: PIN_HTML, iconSize: [36, 47], iconAnchor: [18, 47] }),
        title,
      })
        .addTo(map)
        .bindPopup(POPUP_HTML(title, address), { closeButton: true, offset: [0, -6] })
        .openPopup();
    })().catch(() => setFailed(true));

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [embed, title, address]);

  if (failed) return null;

  return (
    <div
      ref={hostRef}
      aria-label={title}
      className="h-full w-full bg-chronos-ivory"
    />
  );
}