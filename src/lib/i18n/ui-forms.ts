/**
 * Generic UI feedback for public forms (lead + job application). Brand copy
 * lives in the database; only reusable interface words live here so every ship
 * on the platform shares them.
 */

import type { Lang } from "@/lib/translations";

export interface FormUi {
  /** Generic failure message shown when the submission could not be saved. */
  error: string;
  sending: string;
}

const EN: FormUi = {
  error: "Sorry, we could not send your message. Please try again.",
  sending: "Sending…",
};

const DICT: Partial<Record<string, FormUi>> = {
  en: EN,
  vi: {
    error: "Rất tiếc, chúng tôi chưa gửi được tin của bạn. Vui lòng thử lại.",
    sending: "Đang gửi…",
  },
  ko: {
    error: "죄송합니다. 메시지를 보내지 못했습니다. 다시 시도해 주세요.",
    sending: "전송 중…",
  },
  ru: {
    error: "Не удалось отправить сообщение. Пожалуйста, попробуйте снова.",
    sending: "Отправка…",
  },
  "zh-CN": {
    error: "抱歉，消息未能发送，请重试。",
    sending: "发送中…",
  },
};

export function formUi(language: Lang | string): FormUi {
  return DICT[language] ?? EN;
}

/** Generic gallery filter labels (category names come from the database). */
const GALLERY_ALL: Partial<Record<string, string>> = {
  en: "All",
  vi: "Tất cả",
  ko: "전체",
  ru: "Все",
  "zh-CN": "全部",
};

export function galleryAllLabel(language: Lang | string): string {
  return GALLERY_ALL[language] ?? GALLERY_ALL["en"]!;
}
