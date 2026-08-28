"use client";

import {
  useEffect,
  useRef,
  useState,
  type ElementType,
  type FormEventHandler,
  type ReactNode,
} from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Trễ (ms) để các khối xuất hiện lần lượt */
  delay?: number;
  as?: ElementType;
  /** Chạy ngay khi tải trang, không cần cuộn tới */
  immediate?: boolean;
  id?: string;
  onSubmit?: FormEventHandler;
}

export function Reveal({
  children,
  className = "",
  delay = 0,
  as,
  immediate = false,
  id,
  onSubmit,
}: RevealProps) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (immediate) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    // Hiện ngay nếu phần tử đã nằm trong khung nhìn khi tải trang
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0 },
    );
    io.observe(el);
    // Dự phòng: nếu observer không kích hoạt (iframe, trình duyệt tiết kiệm),
    // vẫn hiển thị nội dung sau 1.2s
    const fallback = window.setTimeout(() => setVisible(true), 1200);
    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, [immediate]);


  return (
    <Tag
      ref={ref}
      id={id}
      onSubmit={onSubmit}
      className={`reveal ${visible ? "reveal-in" : ""} ${className}`}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
