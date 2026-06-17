/* Practice area page. */
import { site } from "../data/site.js";
import { leadForm, ctaBand, breadcrumbs, icons } from "./components.js";
import { renderSections, renderFaq, serviceList, relatedPractices, escape as esc } from "./render.js";

export function practicePage(p, { practiceBySlug, cases, team = [] }) {
  const crumbs = [
    { name: "Головна", href: "/" },
    { name: "Практики", href: "/practices/" },
    { name: p.shortTitle, href: `/practices/${p.slug}/` },
  ];
  const lawyer =
    (p.lead && team.find((m) => m.slug === p.lead)) ||
    team.find((m) => (m.practices || []).includes(p.slug)) ||
    team.find((m) => m.roleKey === "managing-partner") ||
    team[0];
  const lawyerCard = lawyer
    ? `<div class="card">
        <span class="eyebrow">Відповідальний адвокат</span>
        <a class="lawyer-card__row" href="/team/${lawyer.slug}/">
          <img src="${lawyer.photo}" width="64" height="80" loading="lazy" alt="${esc(lawyer.name)} — ${esc(lawyer.role)}">
          <span><b>${esc(lawyer.name)}</b><span>${esc(lawyer.role)}</span></span>
        </a>
        <a class="btn btn--ghost btn--block" href="/team/${lawyer.slug}/">Профіль адвоката</a>
      </div>`
    : "";
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
      ${lawyerCard}
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
  const list = practices
    .map(
      (p, i) => `<a href="/practices/${p.slug}/">
        <span class="num">${String(i + 1).padStart(2, "0")}</span>
        <span class="pt"><b>${esc(p.shortTitle)}</b><span>${esc(p.summary)}</span></span>
        <span class="arr" aria-hidden="true">→</span></a>`
    )
    .join("");
  return `
${breadcrumbs(crumbs)}
<section class="page-hero"><div class="container">
  <span class="eyebrow">Практики</span>
  <h1>Напрями юридичної практики</h1>
  <p>${practices.length} спеціалізацій, у яких ми системно досягаємо результату для бізнесу та приватних клієнтів у Києві та по всій Україні.</p>
</div></section>
<section class="section"><div class="container"><div class="practice-list reveal">${list}</div></div></section>
${ctaBand()}`;
}
