/* Base HTML document with full technical SEO head. */
import { site } from "../data/site.js";
import { websiteSchema, organizationSchema } from "../lib/seo.js";

const abs = (p) => (p && p.startsWith("http") ? p : site.domain + (p || "/"));
const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function jsonLd(obj) {
  return `<script type="application/ld+json">${JSON.stringify(obj)}</script>`;
}

/**
 * layout({ title, description, canonical, ogType, schemas[], bodyClass, head, content, header, footer })
 */
export function layout(opts) {
  const {
    title,
    description,
    canonical,
    ogType = "website",
    ogImage = "/assets/img/og-default.svg",
    schemas = [],
    bodyClass = "",
    content = "",
    header = "",
    footer = "",
    noindex = false,
  } = opts;

  const allSchemas = [websiteSchema(), organizationSchema(), ...schemas];
  const v = process.env.ASSET_V || "1"; /* cache-busting for CSS/JS */

  return `<!doctype html>
<html lang="${site.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${noindex ? '<meta name="robots" content="noindex, nofollow">' : '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">'}
<link rel="canonical" href="${abs(canonical)}">
<meta name="author" content="${esc(site.legalName)}">
<meta name="geo.region" content="UA-32"><meta name="geo.placename" content="Київ">

<!-- Open Graph -->
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:locale" content="${site.locale}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${abs(canonical)}">
<meta property="og:image" content="${abs(ogImage)}">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${abs(ogImage)}">

<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/img/favicon.svg">
<meta name="theme-color" content="#0B1A33">

<link rel="preload" href="/assets/fonts/montserrat-cyrillic-800-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/inter-cyrillic-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/styles.css?v=${v}">
${allSchemas.map(jsonLd).join("\n")}
</head>
<body class="${bodyClass}">
<div class="scroll-progress" aria-hidden="true"><span data-scroll-progress></span></div>
<a href="#main" class="visually-hidden">Перейти до основного змісту</a>
${header}
<main id="main">
${content}
</main>
${footer}
<script src="/assets/js/main.js?v=${v}" defer></script>
</body>
</html>`;
}
