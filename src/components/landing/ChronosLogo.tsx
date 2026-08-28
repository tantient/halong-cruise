import stackedSrc from "@/assets/logo/chronos-stacked.svg?raw";
import markSrc from "@/assets/logo/chronos-mark.svg?raw";
import wordmarkSrc from "@/assets/logo/chronos-wordmark.svg?raw";

type LogoVariant = "inline" | "stacked";
type LogoSize = "sm" | "md" | "lg";
/**
 * auto    = theo chế độ sáng/tối (mực trên nền sáng, ngà trên nền tối)
 * onLight = ép màu mực (dùng trên nền sáng cố định)
 * onDark  = ép màu ngà (dùng trên ảnh/nền tối cố định)
 * gold    = màu vàng thương hiệu
 * inherit = kế thừa currentColor của phần tử cha
 */
type LogoTone = "auto" | "onLight" | "onDark" | "gold" | "inherit";

const TONE_CLASSES: Record<LogoTone, string> = {
  auto: "text-chronos-sand-900 dark:text-chronos-ivory",
  onLight: "text-chronos-sand-900",
  onDark: "text-chronos-ivory drop-shadow-[0_1px_6px_rgba(0,0,0,0.35)]",
  gold: "text-chronos-gold-ink dark:text-chronos-gold",
  inherit: "",
};

interface ChronosLogoProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string;
  /** stacked = khối trên, chữ dưới | inline = khối bên trái, chữ bên phải */
  variant?: LogoVariant;
  showTagline?: boolean;
  /** Kích thước chuẩn, tự co giãn theo breakpoint. Bỏ qua nếu tự truyền class h-* */
  size?: LogoSize;
  /** Cách logo lấy màu để luôn tương phản với nền */
  tone?: LogoTone;
}

/** Chiều cao chuẩn (mobile → desktop) cho từng biến thể. */
const SIZE_CLASSES: Record<LogoVariant, Record<LogoSize, string>> = {
  inline: {
    sm: "h-6 sm:h-7",
    md: "h-7 sm:h-8 lg:h-9",
    lg: "h-9 sm:h-10 lg:h-12",
  },
  stacked: {
    sm: "h-14 sm:h-16",
    md: "h-16 sm:h-20 lg:h-24",
    lg: "h-20 sm:h-24 lg:h-28",
  },
};

/**
 * Bỏ khai báo XML, ép SVG co theo chiều cao phần tử cha.
 * `viewBox` tuỳ chọn dùng để cắt phần tagline (biến thể "plain"),
 * nhờ đó chỉ cần một file cho cả hai biến thể.
 */
function prepare(raw: string, viewBox?: string): string {
  let out = raw
    .replace(/<\?xml[^>]*\?>/i, "")
    .replace(
      /<svg\b/i,
      '<svg preserveAspectRatio="xMidYMid meet" height="100%" width="auto" focusable="false" aria-hidden="true"',
    )
    .trim();
  if (viewBox) out = out.replace(/viewBox="[^"]*"/i, `viewBox="${viewBox}"`);
  return out;
}

const SVG = {
  stacked: prepare(stackedSrc),
  stackedPlain: prepare(stackedSrc, "90 151 920 575"),
  mark: prepare(markSrc),
  wordmark: prepare(wordmarkSrc),
  wordmarkPlain: prepare(wordmarkSrc, "69 109 920 104"),
};

/** Wrapper cho SVG nội tuyến: giữ nét ở mọi kích thước, ăn màu currentColor. */
function InlineSvg({ markup, className }: { markup: string; className?: string }) {
  return (
    <span
      className={`block shrink-0 [&>svg]:block [&>svg]:h-full [&>svg]:w-auto ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}

export function ChronosLogo({
  className,
  variant = "inline",
  showTagline = true,
  size = "md",
  tone = "auto",
  ...rest
}: ChronosLogoProps) {
  const hasCustomHeight = /(^|\s)(h-|max-h-)/.test(className ?? "");
  const hasCustomColor = /(^|\s)text-/.test(className ?? "");
  const sizeClass = hasCustomHeight ? "" : SIZE_CLASSES[variant][size];
  const toneClass = hasCustomColor ? "" : TONE_CLASSES[tone];
  const base = `inline-flex max-w-full shrink-0 select-none items-center align-middle transition-colors duration-300 ${sizeClass} ${toneClass}`;

  if (variant === "stacked") {
    return (
      <span
        className={`${base} justify-center ${className ?? ""}`}
        role="img"
        {...rest}
      >
        <InlineSvg
          markup={showTagline ? SVG.stacked : SVG.stackedPlain}
          className="h-full"
        />
      </span>
    );
  }

  return (
    <span
      className={`${base} gap-[0.45em] ${className ?? ""}`}
      role="img"
      {...rest}
    >
      <InlineSvg markup={SVG.mark} className="h-full" />
      <InlineSvg
        markup={showTagline ? SVG.wordmark : SVG.wordmarkPlain}
        className="h-[62%]"
      />
    </span>
  );
}
