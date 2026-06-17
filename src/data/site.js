/* Global site configuration, navigation, contacts, brand. */
export const site = {
  name: "LEGIUS",
  legalName: 'Адвокатське об’єднання «ЛЕГІУС»',
  tagline: "Юридична компанія преміум-класу",
  domain: "https://legius.ua",
  locale: "uk_UA",
  lang: "uk",
  city: "Київ",
  founded: 2009,
  phoneDisplay: "+38 (068) 888 44 00",
  phoneHref: "+380688884400",
  mobileDisplay: "+38 (068) 888 44 00",
  mobileHref: "+380688884400",
  email: "office@legius.ua",
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
    telegram: "https://t.me/legius_law",
    whatsapp: "https://wa.me/380688884400",
    viber: "viber://chat?number=%2B380688884400",
  },
  social: {
    facebook: "https://facebook.com/legius.law",
    linkedin: "https://linkedin.com/company/legius-law",
    youtube: "https://youtube.com/@legius-law",
    instagram: "https://instagram.com/legius.law",
  },
  rating: { value: "4.9", count: 218 },
  stats: {
    years: "15+",
    cases: "3 200+",
    lawyers: "24",
    winRate: "94%",
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
