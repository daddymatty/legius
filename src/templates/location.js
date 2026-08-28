/* Local landing page. */
import { site } from "../data/site.js";
import { testimonials } from "../data/testimonials.js";
import { leadForm, ctaBand, breadcrumbs, icons } from "./components.js";
import { renderSections, renderFaq, relatedPractices, escape as esc } from "./render.js";

/* Кроки роботи — однакові для всіх напрямів, ламають суцільний текст
   одразу після hero й відповідають на питання «що буде далі». */
const STEPS = [
  { i: icons.phone, t: "Консультація", d: "Розбираємо ситуацію і кажемо прямо, чи потрібен адвокат. Якщо впораєтесь самі — так і скажемо." },
  { i: icons.doc, t: "Документи", d: "Дивимося, що є на руках, чого бракує і які докази доведеться здобувати окремо." },
  { i: icons.scale, t: "Оцінка перспективи", d: "Називаємо реалістичний сценарій, строки й обсяг роботи до того, як ви щось платите." },
  { i: icons.handshake, t: "Робота у справі", d: "Ведемо справу й тримаємо в курсі. Ви завжди знаєте, на якому етапі процес." },
];

function stepsBlock() {
  return `<section class="section section--soft"><div class="container">
  <div class="section__head section__head--center">
    <span class="eyebrow">Як ми працюємо</span>
    <h2>Чотири кроки без сюрпризів</h2>
  </div>
  <div class="grid grid--4">${STEPS.map(
    (s, n) => `<div class="card step-card reveal">
      <span class="step-card__num">${n + 1}</span>
      <span class="step-card__icon" aria-hidden="true">${s.i}</span>
      <h3>${esc(s.t)}</h3>
      <p>${esc(s.d)}</p>
    </div>`
  ).join("")}</div>
</div></section>`;
}

function inlineCta() {
  return `<div class="inline-cta reveal">
  <div class="inline-cta__text">
    <strong>Не впевнені, чи є у вас підстави?</strong>
    <span>Перша консультація безкоштовна. Розберемо ситуацію і скажемо чесно, чи є перспектива.</span>
  </div>
  <div class="inline-cta__actions">
    <a class="btn btn--primary" href="#consult">Отримати консультацію</a>
    <a class="btn btn--ghost" href="tel:${site.phoneHref}">${icons.phone} ${esc(site.phoneDisplay)}</a>
  </div>
</div>`;
}

/* Релевантний кейс: практику беремо з першого елемента related. */
function caseBlock(cases, loc) {
  const slug = (loc.related || []).find((r) => (cases || []).some((c) => c.practice === r));
  const rel = (cases || []).filter((c) => c.practice === slug).slice(0, 3);
  if (!rel.length) return "";
  return `<section class="section"><div class="container">
  <div class="section__head section__head--center">
    <span class="eyebrow">Досвід</span>
    <h2>Справи, які ми вели</h2>
  </div>
  <div class="grid grid--3">${rel
    .map(
      (c) => `<div class="case-card reveal"><div class="case-card__body">
        <span class="case-card__tag">${esc(c.tag || c.practiceLabel)} · ${c.year}</span>
        <h3>${esc(c.title)}</h3>
        <div class="case-card__result">${icons.check} ${esc(c.metric || c.result)}</div>
      </div></div>`
    )
    .join("")}</div>
  <p class="text-center mt-2"><a class="btn btn--ghost" href="/cases/">Усі кейси</a></p>
</div></section>`;
}

export function locationPage(loc, { practiceBySlug, cases = [] }) {
  const reviews = testimonials
    .slice(0, 3)
    .map(
      (t) => `<div class="quote-card reveal">
        <div class="quote-card__stars">★★★★★</div>
        <blockquote>${esc(t.text.length > 260 ? t.text.slice(0, 257).replace(/\s+\S*$/, "") + "…" : t.text)}</blockquote>
        <div class="quote-card__author">${esc(t.name)}<span>${esc(t.role)}</span></div>
      </div>`
    )
    .join("");

  /* CTA всередині тексту — після третього розділу, щоб не змушувати
     гортати весь масив прози до форми внизу. */
  const secs = loc.sections || [];
  const cut = secs.length >= 5 ? 3 : Math.max(1, secs.length - 1);
  const body =
    renderSections(secs.slice(0, cut)) + inlineCta() + renderSections(secs.slice(cut));

  const crumbs = [
    { name: "Головна", href: "/" },
    { name: loc.navLabel, href: `/${loc.slug}/` },
  ];
  return `
${breadcrumbs(crumbs)}
<section class="page-hero"><div class="container">
  <span class="eyebrow">${esc(loc.areaServed)}</span>
  <h1>${esc(loc.h1)}</h1>
  <p>${esc(loc.heroSub)}</p>
  <div class="hero__actions mt-2">
    <a class="btn btn--primary" href="#consult">Безкоштовна консультація</a>
    <a class="btn btn--ghost-dark" href="tel:${site.phoneHref}">${icons.phone} ${esc(site.phoneDisplay)}</a>
  </div>
  <div class="hero__trust">
    <div class="stat"><strong>${site.stats.years}</strong><span>років практики</span></div>
    <div class="stat"><strong>${site.stats.cases}</strong><span>проведених справ</span></div>
    <div class="stat"><strong>${site.stats.lawyers}</strong><span>юристів у команді</span></div>
    <div class="stat"><strong>${site.rating.value}</strong><span>рейтинг у Google</span></div>
  </div>
</div></section>

${stepsBlock()}

<section class="section"><div class="container">
  <div class="content-aside">
    <div class="content-aside__main prose reveal" style="max-width:none">${body}</div>
    <aside class="content-aside__side reveal">${leadForm({ id: `loc-${loc.slug}`, title: "Отримати консультацію", source: `location:${loc.slug}` })}</aside>
  </div>
</div></section>

${caseBlock(cases, loc)}

${renderFaq(loc.faq, "Поширені запитання")}

<section class="section section--soft"><div class="container">
  <div class="section__head section__head--center">
    <span class="eyebrow">Відгуки</span>
    <h2>Що кажуть клієнти</h2>
  </div>
  <div class="grid grid--3">${reviews}</div>
</div></section>

${relatedPractices(loc.related, practiceBySlug)}

${ctaBand({ title: "Потрібен юрист поруч?", text: "Залиште заявку — ми зв’яжемося протягом 15 хвилин і запропонуємо зручний формат зустрічі: в офісі або онлайн." })}

<section class="section" id="consult"><div class="container" style="max-width:640px">
  ${leadForm({ id: `loc-bottom-${loc.slug}`, title: "Замовити консультацію", source: `location-bottom:${loc.slug}` })}
</div></section>`;
}
