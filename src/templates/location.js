/* Local landing page. */
import { site } from "../data/site.js";
import { leadForm, ctaBand, breadcrumbs, icons } from "./components.js";
import { renderSections, renderFaq, relatedPractices, escape as esc } from "./render.js";

export function locationPage(loc, { practiceBySlug }) {
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
    <a class="btn btn--ghost" style="color:#fff" href="tel:${site.phoneHref}">${icons.phone} ${esc(site.phoneDisplay)}</a>
  </div>
</div></section>

<section class="section"><div class="container">
  <div class="content-aside">
    <div class="content-aside__main prose reveal" style="max-width:none">${renderSections(loc.sections)}</div>
    <aside class="content-aside__side reveal">${leadForm({ id: `loc-${loc.slug}`, title: "Отримати консультацію", source: `location:${loc.slug}` })}</aside>
  </div>
</div></section>

${renderFaq(loc.faq, "Поширені запитання")}

${relatedPractices(loc.related, practiceBySlug)}

${ctaBand({ title: "Потрібен юрист поруч?", text: "Залиште заявку — ми зв’яжемося протягом 15 хвилин і запропонуємо зручний формат зустрічі: в офісі або онлайн." })}

<section class="section" id="consult"><div class="container" style="max-width:640px">
  ${leadForm({ id: `loc-bottom-${loc.slug}`, title: "Замовити консультацію", source: `location-bottom:${loc.slug}` })}
</div></section>`;
}
