/* Practice area page. */
import { site } from "../data/site.js";
import { leadForm, ctaBand, breadcrumbs, icons } from "./components.js";
import { renderSections, renderFaq, serviceList, relatedPractices, escape as esc } from "./render.js";

export function practicePage(p, { practiceBySlug, cases }) {
  const crumbs = [
    { name: "Головна", href: "/" },
    { name: "Практики", href: "/practices/" },
    { name: p.shortTitle, href: `/practices/${p.slug}/` },
  ];
  const relCases = cases.filter((c) => c.practice === p.slug).slice(0, 3);
  const caseBlock = relCases.length
    ? `<section class="section section--soft reveal"><div class="container">
        <div class="section__head"><span class="eyebrow">Кейси</span><h2>Наш досвід у цій сфері</h2></div>
        <div class="grid grid--3">${relCases
          .map(
            (c) => `<div class="case-card"><div class="case-card__body">
              <span class="tag">${c.year}</span><h3 style="font-size:1.1rem">${esc(c.title)}</h3>
              <p style="color:var(--c-slate);font-size:.92rem">${esc(c.problem)}</p>
              <div class="case-card__result">${icons.check} ${esc(c.metric || c.result)}</div>
            </div></div>`
          )
          .join("")}</div>
      </div></section>`
    : "";

  return `
${breadcrumbs(crumbs)}
<section class="page-hero"><div class="container">
  <span class="eyebrow">Практика</span>
  <h1>${esc(p.h1)}</h1>
  <p>${esc(p.heroSub)}</p>
  <div class="hero__actions mt-2">
    <a class="btn btn--primary" href="#consult">Отримати консультацію</a>
    <a class="btn btn--ghost" style="color:#fff" href="tel:${site.phoneHref}">${icons.phone} ${esc(site.phoneDisplay)}</a>
  </div>
</div></section>

<section class="section"><div class="container">
  <div class="content-aside">
    <div class="content-aside__main prose reveal" style="max-width:none">${renderSections(p.sections)}</div>
    <aside class="content-aside__side reveal">
      <div class="card">
        <h3 style="font-size:1.15rem;margin-bottom:1rem">Послуги напряму</h3>
        ${serviceList(p.services)}
      </div>
      ${leadForm({ id: `practice-${p.slug}`, title: "Консультація юриста", source: `practice:${p.slug}` })}
    </aside>
  </div>
</div></section>

${caseBlock}

${renderFaq(p.faq, `FAQ: ${p.shortTitle}`)}

${relatedPractices(p.related, practiceBySlug)}

${ctaBand({ title: `Потрібна допомога у сфері «${p.shortTitle}»?`, text: "Залиште заявку — профільний адвокат проаналізує вашу ситуацію та запропонує стратегію." })}

<section class="section" id="consult"><div class="container" style="max-width:640px">
  ${leadForm({ id: `practice-bottom-${p.slug}`, title: `Замовити консультацію: ${p.shortTitle}`, source: `practice-bottom:${p.slug}` })}
</div></section>`;
}

export function practicesIndexPage(practices) {
  const crumbs = [
    { name: "Головна", href: "/" },
    { name: "Практики", href: "/practices/" },
  ];
  const cards = practices
    .map(
      (p) => `<a class="card reveal" href="/practices/${p.slug}/">
        <h3>${esc(p.shortTitle)}</h3><p>${esc(p.summary)}</p><span class="card__link">Детальніше</span></a>`
    )
    .join("");
  return `
${breadcrumbs(crumbs)}
<section class="page-hero"><div class="container">
  <span class="eyebrow">Практики</span>
  <h1>Напрями юридичної практики</h1>
  <p>12 спеціалізацій, у яких ми системно досягаємо результату для бізнесу та приватних клієнтів у Києві та по всій Україні.</p>
</div></section>
<section class="section"><div class="container"><div class="grid grid--3">${cards}</div></div></section>
${ctaBand()}`;
}
