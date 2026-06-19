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
    ogImage = "/assets/img/og-default.png",
    schemas = [],
    bodyClass = "",
    content = "",
    header = "",
    footer = "",
    noindex = false,
  } = opts;

  const allSchemas = [websiteSchema(), organizationSchema(), ...schemas];
  const v = process.env.ASSET_V || "1"; /* cache-busting for CSS/JS */

  /* Content-Security-Policy (enforced via meta — works on GitHub Pages too).
     Built from config so the lead-form origin always matches. script-src is
     strict 'self' (no inline JS); style-src allows inline due to style attrs. */
  const leadOrigin = site.leadEndpoint ? new URL(site.leadEndpoint).origin : "";
  const ga = (site.analytics && site.analytics.ga4) || "";
  const turnstile = (site.turnstile && site.turnstile.siteKey) || "";
  const cf = "https://challenges.cloudflare.com";
  const csp = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    `img-src 'self' https://images.unsplash.com${ga ? " https://*.google-analytics.com https://*.googletagmanager.com" : ""}`,
    "font-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    `script-src 'self'${ga ? " https://www.googletagmanager.com" : ""}${turnstile ? " " + cf : ""}`,
    `connect-src 'self'${leadOrigin ? " " + leadOrigin : ""}${ga ? " https://*.google-analytics.com https://*.googletagmanager.com" : ""}`,
    `frame-src https://www.openstreetmap.org${turnstile ? " " + cf : ""}`,
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join("; ");
  const turnstileTag = turnstile ? `<script src="${cf}/turnstile/v0/api.js" async defer></script>` : "";

  /* GA4: load gtag.js; init lives in main.js (data-ga) so no inline script,
     keeping script-src strict. */
  const gaTag = ga ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${esc(ga)}" data-ga="${esc(ga)}"></script>` : "";
  const gscTag = site.analytics && site.analytics.gscVerification
    ? `<meta name="google-site-verification" content="${esc(site.analytics.gscVerification)}">`
    : "";

  return `<!doctype html>
<html lang="${site.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta http-equiv="Content-Security-Policy" content="${csp}">
<meta name="referrer" content="strict-origin-when-cross-origin">
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
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(site.name)} — ${esc(site.tagline)}">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${abs(ogImage)}">

<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<meta name="theme-color" content="#0D0D0F">

<!-- Speed: warm up connections to external origins -->
<link rel="preconnect" href="https://images.unsplash.com" crossorigin>
${ga ? `<link rel="preconnect" href="https://www.googletagmanager.com">
<link rel="preconnect" href="https://www.google-analytics.com" crossorigin>
<link rel="dns-prefetch" href="https://www.googletagmanager.com">` : ""}

<link rel="preload" href="/assets/fonts/montserrat-cyrillic-800-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/inter-cyrillic-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/styles.css?v=${v}">
${gscTag}
${gaTag}
${turnstileTag}
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
<button class="to-top" data-to-top aria-label="Нагору" hidden><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg></button>
<script src="/assets/js/main.js?v=${v}" defer></script>
</body>
</html>`;
}
