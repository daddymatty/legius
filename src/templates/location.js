/* Local landing page. */
import { site } from "../data/site.js";
import { testimonials } from "../data/testimonials.js";
import { leadForm, ctaBand, breadcrumbs, icons, stepsBlock, heroTrust, reviewsBlock, proseWithCta, findLawyer, lawyerCard } from "./components.js";
import { renderSections, renderFaq, relatedPractices, escape as esc } from "./render.js";

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

/* Сусідні посадкові тієї самої практики: без цього кожна комерційна сторінка
   висить окремо і має 1–5 вхідних посилань. */
function siblingBlock(loc, locations, practiceBySlug) {
  const primary = (l) => (l.related || []).find((r) => practiceBySlug[r]);
  const mine = primary(loc);
  if (!mine) return "";
  const sibs = (locations || []).filter((l) => l.slug !== loc.slug && primary(l) === mine).slice(0, 6);
  if (!sibs.length) return "";
  const label = practiceBySlug[mine].shortTitle;
  return `<section class="section section--soft reveal"><div class="container">
    <div class="section__head"><span class="eyebrow">Ще за напрямом</span><h2>Суміжні послуги: ${esc(label)}</h2></div>
    <ul class="link-columns">${sibs
      .map((l) => `<li><a href="/${l.slug}/">${esc(l.navLabel)}</a></li>`)
      .join("")}</ul>
  </div></section>`;
}

export function locationPage(loc, { practiceBySlug, locationBySlug = {}, locations = [], cases = [], team = [] }) {
  const body = proseWithCta(loc.sections, renderSections);
  /* відповідального адвоката беремо за першою пов'язаною практикою */
  const practice = (loc.related || []).map((r) => practiceBySlug[r]).find(Boolean);
  const lawyer = practice ? findLawyer(practice, team) : null;

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
  ${heroTrust()}
</div></section>

${stepsBlock()}

<section class="section"><div class="container">
  <div class="content-aside">
    <div class="content-aside__main prose reveal" style="max-width:none">${body}</div>
    <aside class="content-aside__side reveal">${lawyerCard(lawyer)}
      ${leadForm({ id: `loc-${loc.slug}`, title: "Отримати консультацію", source: `location:${loc.slug}` })}</aside>
  </div>
</div></section>

${caseBlock(cases, loc)}

${renderFaq(loc.faq, "Поширені запитання")}

${reviewsBlock(testimonials)}

${siblingBlock(loc, locations, practiceBySlug)}

${relatedPractices(loc.related, practiceBySlug, locationBySlug)}

${ctaBand({ title: "Потрібен юрист поруч?", text: "Залиште заявку — ми зв’яжемося протягом 15 хвилин і запропонуємо зручний формат зустрічі: в офісі або онлайн." })}

<section class="section" id="consult"><div class="container" style="max-width:640px">
  ${leadForm({ id: `loc-bottom-${loc.slug}`, title: "Замовити консультацію", source: `location-bottom:${loc.slug}` })}
</div></section>`;
}
