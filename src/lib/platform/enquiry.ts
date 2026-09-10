/**
 * Conversion links (WhatsApp for now).
 *
 * Chronos has a separate PMS: the website never handles availability, rates or
 * payments. Every "request" style CTA opens the ship's configured chat channel
 * instead, and carries the context of the page the visitor came from so the
 * team knows which voyage / suite / offer is meant.
 *
 * Channel precedence follows the ship settings (`booking_url` → WhatsApp →
 * Zalo), so switching a ship to a real booking URL later needs no component
 * change. When that URL is a PMS deep link the prefilled message is skipped.
 */

import type { ShipSettings } from "./types";

const SUBJECT: Partial<Record<string, (subject: string) => string>> = {
  en: (s) => `Hello Chronos Cruise, I'm interested in the ${s}.`,
  vi: (s) => `Chronos Cruise xin chào, tôi muốn tìm hiểu về ${s}.`,
  ko: (s) => `안녕하세요, ${s}에 관심이 있습니다.`,
  ru: (s) => `Здравствуйте! Меня интересует ${s}.`,
  "zh-CN": (s) => `您好，我对${s}很感兴趣。`,
};

const GENERAL: Partial<Record<string, (ship: string) => string>> = {
  en: (ship) => `Hello ${ship}, I'm interested in planning a journey with you.`,
  vi: (ship) => `${ship} xin chào, tôi muốn lên kế hoạch cho một hành trình.`,
  ko: (ship) => `안녕하세요 ${ship}, 여행 계획을 상담하고 싶습니다.`,
  ru: (ship) => `Здравствуйте, ${ship}! Хочу спланировать путешествие.`,
  "zh-CN": (ship) => `您好 ${ship}，我想咨询行程安排。`,
};

/** Chat channels that accept a prefilled message through `?text=`. */
function supportsText(url: string): boolean {
  return /(^|\/\/)(wa\.me|api\.whatsapp\.com|zalo\.me)/i.test(url);
}

export interface EnquiryContext {
  /** Entity the visitor is looking at (voyage, suite, offer name). */
  subject?: string | null;
  /** Ship display name, used for the general message. */
  shipName?: string | null;
  language: string;
}

/**
 * Conversion URL for a CTA. `subject` is the real entity name from the
 * database — never invented copy.
 */
export function enquiryUrl(settings: ShipSettings, ctx: EnquiryContext): string {
  const base = settings.bookingUrl ?? settings.whatsapp ?? settings.zalo ?? "#";
  if (base === "#" || !supportsText(base)) return base;

  const subject = ctx.subject?.trim();
  const ship = ctx.shipName?.trim() || "Chronos Cruise";
  const message = subject
    ? (SUBJECT[ctx.language] ?? SUBJECT["en"]!)(subject)
    : (GENERAL[ctx.language] ?? GENERAL["en"]!)(ship);

  return `${base}${base.includes("?") ? "&" : "?"}text=${encodeURIComponent(message)}`;
}
