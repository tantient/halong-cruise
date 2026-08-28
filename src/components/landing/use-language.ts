"use client";

import { useEffect, useState } from "react";
import { getT, type Lang } from "@/lib/translations";

const STORAGE_KEY = "chronos-lang";

export function useLanguage() {
  const [lang, setLangState] = useState<Lang>("vi");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (saved === "vi" || saved === "en") {
      setLangState(saved);
    }
  }, []);

  const setLang = (next: Lang) => {
    setLangState(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, next);
    }
  };

  return { lang, setLang, t: getT(lang) };
}
