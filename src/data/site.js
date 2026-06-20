/* Global site configuration, navigation, contacts, brand. */
export const site = {
  name: "LEGIUS",
  legalName: 'Юридична компанія «ЛЕГІУС»',
  tagline: "Юридична компанія",
  domain: "https://legius.com.ua",
  locale: "uk_UA",
  lang: "uk",
  city: "Київ",
  founded: 2009,
  phoneDisplay: "+38 (068) 888 44 00",
  phoneHref: "+380688884400",
  mobileDisplay: "+38 (068) 888 44 00",
  mobileHref: "+380688884400",
  email: "office@legius.ua",
  /* Lead-form endpoint (Cloudflare Worker proxy that forwards to Telegram).
     Empty = form falls back to localStorage only. Set after deploying the worker. */
  leadEndpoint: "https://legius-lead.mexn1n1.workers.dev",
  /* Analytics — empty = disabled (no GA scripts, no extra CSP domains).
     ga4: GA4 Measurement ID "G-XXXXXXX". gscVerification: Search Console meta token. */
  analytics: { ga4: "G-10B84LRHKX", gscVerification: "" },
  /* Cloudflare Turnstile anti-spam. Empty siteKey = disabled (no widget, no
     extra scripts/CSP). Set the public site key to enable; add TURNSTILE_SECRET
     in the worker to enforce server-side. */
  turnstile: { siteKey: "0x4AAAAAADn2q--5_9ulL7Ys" },
  address: {
    street: "вул. Велика Васильківська, 5, БЦ «Прайм», 8 поверх",
    locality: "Київ",
    region: "Київська область",
    postal: "01004",
    country: "UA",
    lat: 50.4393,
    lng: 30.5221,
  },
  hours: "Пн–Пт 09:00–19:00",
  messengers: {
    telegram: "https://t.me/+380688884400",
    whatsapp: "https://wa.me/380688884400",
    viber: "viber://chat?number=%2B380688884400",
  },
  social: {
    facebook: "https://facebook.com/legius.law",
    linkedin: "https://linkedin.com/company/legius-law",
    youtube: "https://youtube.com/@legius-law",
    instagram: "https://instagram.com/legius.law",
  },
  rating: { value: "5.0", count: 9 },
  reviewsUrl: "https://share.google/FwMjzuvbjUkR7WBEH",
  stats: {
    years: "15+",
    cases: "500+",
    lawyers: "16",
  },
};

/* Primary navigation. Practices dropdown is built from practices data at build time. */
export const mainNav = [
  { label: "Про компанію", href: "/about/" },
  { label: "Практики", href: "/practices/", dropdown: "practices" },
  { label: "Команда", href: "/team/" },
  { label: "Кейси", href: "/cases/" },
  { label: "Блог", href: "/blog/" },
  { label: "Контакти", href: "/contacts/" },
];

export const trustBadges = [
  "Член Асоціації правників України",
  "Рекомендовано Legal500 (регіональний рейтинг)",
  "ISO-стандарти конфіденційності",
];
