/* Shared UI components: header, footer, forms, CTA bands, messengers, sticky bar, cards. */
import { site, mainNav } from "../data/site.js";

const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* ---------- Icons (inline SVG, no extra requests) ---------- */
export const icons = {
  scale: '<svg class="card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3v18M5 7h14M7 7l-3 7a3 3 0 006 0L7 7zM17 7l-3 7a3 3 0 006 0l-3-7zM8 21h8"/></svg>',
  shield: '<svg class="card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"/></svg>',
  building: '<svg class="card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 21V5l8-3 8 3v16M9 21v-5h6v5M8 8h.01M12 8h.01M16 8h.01M8 12h.01M12 12h.01M16 12h.01"/></svg>',
  doc: '<svg class="card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M14 3H6v18h12V7l-4-4zM14 3v4h4M8 13h8M8 17h6"/></svg>',
  gavel: '<svg class="card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M14 4l6 6-3 3-6-6 3-3zM11 7L4 14l3 3 7-7M14 20H6"/></svg>',
  globe: '<svg class="card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/></svg>',
  handshake: '<svg class="card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 12l4-4 5 2 5-2 4 4M7 14l3 3 2-2 2 2 3-3"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M5 13l4 4L19 7"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="18" height="18"><path d="M5 4h4l2 5-3 2a12 12 0 005 5l2-3 5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="22" height="22"><path d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="22" height="22"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="22" height="22"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  passport: '<svg class="card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="5" y="3" width="14" height="18" rx="2"/><circle cx="12" cy="10" r="2.6"/><path d="M9 15.4c.8-1 1.9-1.5 3-1.5s2.2.5 3 1.5M10.5 19h3"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>',
};

/* ---------- Site search (index: /search-index.json, logic: main.js) ---------- */
export function searchInline(placeholder = "Пошук по сайту…") {
  return `<div class="search-inline" data-search-scope>
    <div class="search-inline__field">${icons.search}<input type="search" data-search-input placeholder="${esc(placeholder)}" aria-label="Пошук по сайту" autocomplete="off"></div>
    <div class="search-results" data-search-results hidden></div>
  </div>`;
}

function searchModal() {
  return `<div class="search-modal" data-search-modal hidden>
  <div class="search-modal__backdrop" data-search-close></div>
  <div class="search-modal__panel" role="dialog" aria-modal="true" aria-label="Пошук по сайту" data-search-scope>
    <div class="search-modal__bar">
      ${icons.search}
      <input type="search" data-search-input placeholder="Розлучення, спадщина, податкова перевірка…" aria-label="Пошук по сайту" autocomplete="off">
      <button type="button" class="search-modal__close" data-search-close aria-label="Закрити пошук">✕</button>
    </div>
    <div class="search-results" data-search-results hidden></div>
  </div>
</div>`;
}

export const practiceIcon = {
  family: icons.handshake, military: icons.shield, corporate: icons.building,
  tax: icons.doc, land: icons.globe, "real-estate": icons.building,
  litigation: icons.gavel, "criminal-business": icons.shield, ip: icons.doc,
  investment: icons.handshake, "it-law": icons.globe, "m-and-a": icons.building,
  migration: icons.passport,
};

/* ---------- Logo ---------- */
/* Wordmark: thin tracked "LEGIUS" with the signature "E" as three bars (top one gold). */
const logoWord = '<span class="brand"><span class="brand-l">L</span><span class="brand-e" aria-hidden="true"><i></i><i></i><i></i></span><span class="brand-r">GIUS</span></span>';

export function header(practices, currentPath = "") {
  const navItems = mainNav
    .map((item) => {
      const active = currentPath === item.href ? ' aria-current="page"' : "";
      if (item.dropdown === "practices") {
        const links = practices
          .map((p) => `<a href="/practices/${p.slug}/">${esc(p.navLabel || p.shortTitle)}</a>`)
          .join("");
        return `<li class="has-dropdown"><a class="nav__link" href="${item.href}"${active}>${esc(item.label)}</a><div class="dropdown">${links}</div></li>`;
      }
      return `<li><a class="nav__link" href="${item.href}"${active}>${esc(item.label)}</a></li>`;
    })
    .join("");

  const mobileItems = mainNav
    .map((item) => {
      if (item.dropdown === "practices") {
        const links = practices.map((p) => `<a href="/practices/${p.slug}/">${esc(p.navLabel || p.shortTitle)}</a>`).join("");
        return `<details><summary>${esc(item.label)} <span>+</span></summary>${links}</details>`;
      }
      return `<a href="${item.href}">${esc(item.label)}</a>`;
    })
    .join("");

  return `<header class="site-header" data-header>
  <div class="util-bar" data-utilbar><div class="container">
    <div class="util-bar__left">
      <a href="mailto:${site.email}">${icons.mail} ${esc(site.email)}</a>
      <a href="tel:${site.phoneHref}">${icons.phone} ${esc(site.phoneDisplay)}</a>
    </div>
    <div class="util-bar__right">
      <span>${esc(site.hours)}</span>
    </div>
  </div></div>
  <div class="container header__bar">
    <a class="logo" href="/" aria-label="${esc(site.name)} — головна">${logoWord}</a>
    <nav class="nav" aria-label="Основна навігація"><ul class="nav__list">${navItems}</ul></nav>
    <div class="header__cta">
      <button type="button" class="header-search" data-search-open aria-label="Пошук по сайту">${icons.search}</button>
      <a class="btn btn--primary btn--sm" href="/contacts/#consult">Консультація</a>
    </div>
    <button type="button" class="header-search header-search--mobile" data-search-open aria-label="Пошук по сайту">${icons.search}</button>
    <button class="burger" data-burger aria-label="Меню" aria-expanded="false" aria-controls="mobile-nav">Меню <i><span></span></i></button>
  </div>
</header>
${searchModal()}
<div class="mobile-nav" id="mobile-nav" data-mobile-nav>
  ${mobileItems}
  <a class="btn btn--primary btn--block" href="/contacts/#consult">Безкоштовна консультація</a>
  <a class="btn btn--ghost-dark btn--block" style="margin-top:.8rem" href="tel:${site.phoneHref}">Зателефонувати</a>
</div>`;
}

export function breadcrumbs(items) {
  const lis = items
    .map((it, i) =>
      i === items.length - 1
        ? `<li aria-current="page">${esc(it.name)}</li>`
        : `<li><a href="${it.href}">${esc(it.name)}</a></li>`
    )
    .join("");
  return `<nav class="breadcrumbs" aria-label="Хлібні крихти"><div class="container"><ol>${lis}</ol></div></nav>`;
}

/* ---------- Lead form ---------- */
export function leadForm({ id = "lead", title = "Отримати консультацію", source = "site", compact = false, note = "Відповідаємо протягом 15 хвилин у робочий час. Перша консультація — безкоштовно." } = {}) {
  return `<form class="lead-form" id="${id}" data-lead-form${site.leadEndpoint ? ` data-endpoint="${esc(site.leadEndpoint)}"` : ""}>
    <input type="hidden" name="source" value="${esc(source)}">
    <input type="text" name="company" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0">
    <h3 style="margin-bottom:${note ? ".3rem" : ".9rem"}">${esc(title)}</h3>
    ${note ? `<p style="color:var(--c-slate);font-size:.9rem;margin-bottom:.9rem">${esc(note)}</p>` : ""}
    <div class="form-note" role="status" aria-live="polite">Дякуємо! Ваш запит надіслано — ми зв’яжемося з вами найближчим часом.</div>
    <div class="field"><label for="${id}-name">Ваше ім’я</label><input id="${id}-name" name="name" type="text" required autocomplete="name" placeholder="Ім’я"></div>
    <div class="field"><label for="${id}-phone">Телефон</label><input id="${id}-phone" name="phone" type="tel" required autocomplete="tel" placeholder="+38 (0__) ___-__-__"></div>
    ${compact ? "" : `<div class="field"><label for="${id}-msg">Коротко про ситуацію</label><textarea id="${id}-msg" name="message" rows="2" placeholder="Опишіть ваше питання"></textarea></div>`}
    ${site.turnstile && site.turnstile.siteKey ? `<div class="cf-turnstile" data-sitekey="${esc(site.turnstile.siteKey)}" data-theme="light" data-size="flexible" style="margin-bottom:1rem;min-height:65px"></div>` : ""}
    <button class="btn btn--primary btn--block" type="submit">Замовити консультацію</button>
    <p class="form-consent">Натискаючи кнопку, ви погоджуєтесь з <a href="/privacy/">політикою конфіденційності</a>. Гарантуємо повну конфіденційність.</p>
    ${site.messengers ? `<p class="form-msgr">Зручніше написати? <a href="${site.messengers.telegram}" target="_blank" rel="noopener">Telegram</a> · <a href="${site.messengers.whatsapp}" target="_blank" rel="noopener">WhatsApp</a> · <a href="${site.messengers.viber}" target="_blank" rel="noopener">Viber</a></p>` : ""}
  </form>`;
}

export function ctaBand({ title = "Потрібна юридична підтримка?", text = "Залиште заявку — провідний адвокат проаналізує вашу ситуацію та запропонує стратегію дій.", btn = "Безкоштовна консультація", href = "/contacts/#consult" } = {}) {
  return `<section class="section section--cta"><div class="container"><div class="cta-band reveal">
    <h2>${esc(title)}</h2><p>${esc(text)}</p>
    <div class="hero__actions">
      <a class="btn btn--primary" href="${href}">${esc(btn)}</a>
      <a class="btn btn--light" href="tel:${site.phoneHref}">${icons.phone} ${esc(site.phoneDisplay)}</a>
    </div>
  </div></div></section>`;
}

/* ---------- Google rating badge (real GBP numbers only — no invented quotes) ---------- */
export function ratingBadge() {
  if (!site.rating || !site.reviewsUrl) return "";
  /* Stars follow the actual GBP value from config — never hardcoded five. */
  const full = Math.max(0, Math.min(5, Math.round(parseFloat(site.rating.value) || 0)));
  const stars = "★".repeat(full) + "☆".repeat(5 - full);
  return `<a class="rating-badge" href="${site.reviewsUrl}" target="_blank" rel="noopener nofollow" aria-label="Рейтинг ${site.rating.value} з 5 на Google">
    <span class="rating-badge__stars" aria-hidden="true">${stars}</span>
    <span>${site.rating.value} на Google</span>
  </a>`;
}

/* ---------- Floating messengers + sticky mobile CTA ---------- */
export function messengers() {
  const tg = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9.8 15.6l-.4 4c.5 0 .8-.2 1-.5l2.4-2.3 5 3.6c.9.5 1.6.2 1.8-.8l3.3-15.4c.3-1.3-.5-1.8-1.4-1.5L2 9.2c-1.3.5-1.3 1.2-.2 1.5l5 1.6L18 5.4c.5-.4 1-.2.6.2"/></svg>';
  const wa = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 00-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1012 2zm0 18a8 8 0 01-4.1-1.1l-.3-.2-2.8.7.8-2.7-.2-.3A8 8 0 1112 20zm4.4-6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6.6 6.6 0 01-3.2-2.8c-.2-.4.2-.4.6-1.2.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.5.1-.7.3-.7.8-.9 1.7-.6 2.8.6 2 2 3.6 3.9 4.6 2.4 1.2 2.9.9 3.4.9.7-.1 1.4-.6 1.6-1.2.2-.6.2-1 .1-1.1z"/></svg>';
  const vb = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.9 2 3 5.2 3 9.7c0 2.4 1.2 4.5 3.2 5.9v3.9l3-1.7c.9.2 1.9.3 2.8.3 5.1 0 9-3.2 9-7.7S17.1 2 12 2zm0 13.8c-.9 0-1.7-.1-2.5-.3l-.4-.1-2 1.1v-2.1l-.4-.3C5.1 13 4.2 11.4 4.2 9.7 4.2 6 7.6 3.2 12 3.2s7.8 2.8 7.8 6.5S16.4 15.8 12 15.8z"/></svg>';
  const chat = '<svg class="ico-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.4 8.4 0 01-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.4 8.4 0 013.8-.9h.5a8.5 8.5 0 018 8v.5z"/></svg>';
  const close = '<svg class="ico-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>';
  /* На вузьких екранах три кнопки перекривали текст, тому вони згорнуті
     за один перемикач — див. .m-toggle у styles.css і main.js. */
  return `<div class="messengers" aria-label="Месенджери">
    <div class="messengers__list" id="messenger-list">
      <a class="m-tg" href="${site.messengers.telegram}" target="_blank" rel="noopener" aria-label="Telegram">${tg}</a>
      <a class="m-wa" href="${site.messengers.whatsapp}" target="_blank" rel="noopener" aria-label="WhatsApp">${wa}</a>
      <a class="m-vb" href="${site.messengers.viber}" target="_blank" rel="noopener" aria-label="Viber">${vb}</a>
    </div>
    <button type="button" class="m-toggle" aria-expanded="false" aria-controls="messenger-list" aria-label="Написати в месенджер">${chat}${close}</button>
  </div>
  <div class="sticky-cta" aria-label="Швидкі дії">
    <a class="s-call" href="tel:${site.phoneHref}">${icons.phone} Подзвонити</a>
    <a class="s-cta" href="/contacts/#consult">Консультація</a>
  </div>`;
}

/* ---------- Footer ---------- */
export function footer(practices) {
  const practiceLinks = practices
    .slice(0, 8)
    .map((p) => `<li><a href="/practices/${p.slug}/">${esc(p.navLabel || p.shortTitle)}</a></li>`)
    .join("");
  return `<footer class="site-footer">
  <div class="container">
    <div class="footer__grid">
      <div class="footer__brand">
        <a class="logo" href="/" aria-label="${esc(site.name)}">${logoWord}</a>
        <p>${esc(site.legalName)}. Юридичний супровід бізнесу та приватних клієнтів у Києві з ${site.founded} року.</p>
      </div>
      <div><h4>Практики</h4><ul>${practiceLinks}<li><a href="/practices/">Усі практики →</a></li></ul></div>
      <div><h4>Компанія</h4><ul>
        <li><a href="/about/">Про компанію</a></li>
        ${site.showTeam ? `<li><a href="/team/">Команда</a></li>` : ""}
        <li><a href="/cases/">Кейси</a></li>
        <li><a href="/blog/">Блог</a></li>
        <li><a href="/contacts/">Контакти</a></li>
      </ul></div>
      <div><h4>Контакти</h4><ul>
        <li><a href="tel:${site.phoneHref}">${esc(site.phoneDisplay)}</a></li>
        <li><a href="mailto:${site.email}">${esc(site.email)}</a></li>
        <li>${esc(site.address.street)}</li>
        <li>${esc(site.hours)}</li>
      </ul></div>
    </div>
    <div class="footer__bottom">
      <span>© <span data-year>2026</span> ${esc(site.legalName)}. Усі права захищено.</span>
      <span><a href="/privacy/">Політика конфіденційності</a> · <a href="/sitemap/">Карта сайту</a></span>
    </div>
  </div>
</footer>${messengers()}`;
}

/* ---- Спільні блоки для сторінок практик і посадкових ---- */

const WORK_STEPS = [
  { i: "phone", t: "Консультація", d: "Розбираємо ситуацію і кажемо прямо, чи потрібен адвокат. Якщо впораєтесь самі — так і скажемо." },
  { i: "doc", t: "Документи", d: "Дивимося, що є на руках, чого бракує і які докази доведеться здобувати окремо." },
  { i: "scale", t: "Оцінка перспективи", d: "Називаємо реалістичний сценарій, строки й обсяг роботи до того, як ви щось платите." },
  { i: "handshake", t: "Робота у справі", d: "Ведемо справу й тримаємо в курсі. Ви завжди знаєте, на якому етапі процес." },
];

export function stepsBlock() {
  return `<section class="section section--soft"><div class="container">
  <div class="section__head section__head--center">
    <span class="eyebrow">Як ми працюємо</span>
    <h2>Чотири кроки без сюрпризів</h2>
  </div>
  <div class="grid grid--4">${WORK_STEPS.map(
    (s, n) => `<div class="card step-card reveal">
      <span class="step-card__num">${n + 1}</span>
      <span class="step-card__icon" aria-hidden="true">${icons[s.i]}</span>
      <h3>${esc(s.t)}</h3>
      <p>${esc(s.d)}</p>
    </div>`
  ).join("")}</div>
</div></section>`;
}

export function heroTrust() {
  return `<div class="hero__trust">
    <div class="stat"><strong>${site.stats.years}</strong><span>років практики</span></div>
    <div class="stat"><strong>${site.stats.cases}</strong><span>проведених справ</span></div>
    <div class="stat"><strong>${site.stats.lawyers}</strong><span>юристів у команді</span></div>
    <div class="stat"><strong>${site.rating.value}</strong><span>рейтинг у Google</span></div>
  </div>`;
}

export function inlineCta(href = "#consult", title = "Не впевнені, чи є у вас підстави?", text = "Перша консультація безкоштовна. Розберемо ситуацію і скажемо чесно, чи є перспектива.") {
  return `<div class="inline-cta reveal">
  <div class="inline-cta__text"><strong>${esc(title)}</strong><span>${esc(text)}</span></div>
  <div class="inline-cta__actions">
    <a class="btn btn--primary" href="${href}">Отримати консультацію</a>
    <a class="btn btn--ghost" href="tel:${site.phoneHref}">${icons.phone} ${esc(site.phoneDisplay)}</a>
  </div>
</div>`;
}

export function reviewsBlock(testimonials, n = 3) {
  const cards = (testimonials || []).slice(0, n).map(
    (t) => `<div class="quote-card reveal">
        <div class="quote-card__stars">★★★★★</div>
        <blockquote>${esc(t.text.length > 260 ? t.text.slice(0, 257).replace(/\s+\S*$/, "") + "…" : t.text)}</blockquote>
        <div class="quote-card__author">${esc(t.name)}<span>${esc(t.role)}</span></div>
      </div>`
  ).join("");
  if (!cards) return "";
  return `<section class="section section--soft"><div class="container">
  <div class="section__head section__head--center">
    <span class="eyebrow">Відгуки</span>
    <h2>Що кажуть клієнти</h2>
  </div>
  <div class="grid grid--3">${cards}</div>
</div></section>`;
}

/* Розбиває масив розділів навпіл і вставляє CTA всередину тексту. */
export function proseWithCta(sections, renderSections, href = "#consult") {
  const secs = sections || [];
  if (secs.length < 4) return renderSections(secs);
  const cut = secs.length >= 6 ? 3 : 2;
  return renderSections(secs.slice(0, cut)) + inlineCta(href) + renderSections(secs.slice(cut));
}

/* ---- Відповідальний адвокат (практики й посадкові) ---- */
export function findLawyer(p, team) {
  return (
    (p.lead && team.find((m) => m.slug === p.lead)) ||
    team.find((m) => (m.practices || []).includes(p.slug)) ||
    team.find((m) => m.roleKey === "managing-partner") ||
    team[0]
  );
}

export function lawyerCard(lawyer) {
  if (!lawyer || !site.showTeam) return "";
  const name = lawyer.displayName || lawyer.name;
  return `<div class="card">
    <span class="eyebrow">Відповідальний адвокат</span>
    <a class="lawyer-card__row" href="/team/${lawyer.slug}/">
      <img src="${lawyer.photo}" width="64" height="80" loading="lazy" decoding="async" alt="" aria-hidden="true">
      <span><b>${esc(name)}</b> <span>${esc(lawyer.role)}</span></span>
    </a>
    <a class="btn btn--ghost btn--block" href="/team/${lawyer.slug}/">Профіль адвоката</a>
  </div>`;
}
