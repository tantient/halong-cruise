/** Stable public URL of the Chronos Cruise site (immutable project URL). */
export const SITE_URL = "https://project--136d6298-bd5e-486e-a143-b02705fbbca5.lovable.app";

export const SITE_NAME = "Chronos Cruise";

export const absoluteUrl = (path: string) =>
  path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

type PageSeoInput = {
  title: string;
  description: string;
  /** Route path, e.g. "/gallery" */
  path: string;
  /** Optional hero image (imported asset path or absolute URL). */
  image?: string | undefined;
  type?: "website" | "article" | "product";
};

/** Builds the per-route head() payload: meta tags + self-referencing canonical. */
export function pageSeo({ title, description, path, image, type = "website" }: PageSeoInput) {
  const url = absoluteUrl(path);
  const img = image ? absoluteUrl(image) : undefined;

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: type },
      { property: "og:url", content: url },
      { property: "og:site_name", content: SITE_NAME },
      ...(img
        ? [
            { property: "og:image", content: img },
            { property: "og:image:alt", content: title },
            { name: "twitter:image", content: img },
          ]
        : []),
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
