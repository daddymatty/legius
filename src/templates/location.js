/* Local landing page. */
import { site } from "../data/site.js";
import { testimonials } from "../data/testimonials.js";
import { leadForm, ctaBand, breadcrumbs, icons } from "./components.js";
import { renderSections, renderFaq, relatedPractices, escape as esc } from "./render.js";

export function locationPage(loc, { practiceBySlug }) {
  const reviews = testimonials.slice(0, 3).map((t) => `<div class="quote-card reveal">
        <div class="quote-card__stars">★★★★★</div>
        <blockquote>${esc(t.text.length > 260 ? t.text.slice(0, 257).replace(/\s+\S*$/, "") + "…" : t.text)}</blockquote>
        <div class="quote-card__author">${esc(t.name)}<span>${esc(t.role)}</span></div>
      </div>`).join("");
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

<section class="section"><div class="container">
  <div class="content-aside">
    <div class="content-aside__main prose reveal" style="max-width:none">${renderSections(loc.sections)}</div>
    <aside class="content-aside__side reveal">${leadForm({ id: `loc-${loc.slug}`, title: "Отримати консультацію", source: `location:${loc.slug}` })}</aside>
  </div>
</div></section>

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
