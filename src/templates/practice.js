/* Practice area page (overview + services hub) + individual service pages. */
import { site } from "../data/site.js";
import { leadForm, ctaBand, breadcrumbs, icons } from "./components.js";
import { renderSections, renderFaq, relatedPractices, escape as esc } from "./render.js";
import { practiceServices, serviceContent } from "../lib/services.js";

function findLawyer(p, team) {
  return (
    (p.lead && team.find((m) => m.slug === p.lead)) ||
    team.find((m) => (m.practices || []).includes(p.slug)) ||
    team.find((m) => m.roleKey === "managing-partner") ||
    team[0]
  );
}

function lawyerCard(lawyer) {
  if (!lawyer) return "";
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

const WHY_US = [
  { h: "Профільний адвокат", p: "Вашу справу веде фахівець саме з цього напряму, а не «універсал»." },
  { h: "Прогнозований результат", p: "Будуємо стратегію на судовій практиці та реальних шансах, а не на обіцянках." },
  { h: "Прозора вартість", p: "Фіксовані етапи й зрозумілий бюджет — ви завжди знаєте, за що платите." },
  { h: "Повна конфіденційність", p: "Адвокатська таємниця, NDA та захищений документообіг за замовчуванням." },
];

function whyUsBlock(p) {
  const items = WHY_US.map(
    (a) => `<div class="feature reveal"><div class="feature__num">${icons.check}</div><div><h3>${esc(a.h)}</h3><p>${esc(a.p)}</p></div></div>`
  ).join("");
  return `<section class="section section--soft"><div class="container">
    <div class="section__head"><span class="eyebrow">Чому LEGIUS</span><h2>Чому цей напрям довіряють нам</h2></div>
    <div class="features features--3">${items}</div>
  </div></section>`;
}

/* Blog articles that belong to this practice's cluster (interlinking). */
function articlesForPractice(articles, slug, n) {
  return (articles || []).filter((a) => a.practice === slug && !a.pillar).slice(0, n);
}

export function practicePage(p, { practiceBySlug, cases, team = [], articles = [] }) {
  const crumbs = [
    { name: "Головна", href: "/" },
    { name: "Практики", href: "/practices/" },
    { name: p.shortTitle, href: `/practices/${p.slug}/` },
  ];
  const lawyer = findLawyer(p, team);
  const services = practiceServices(p);
  const overview = renderSections(p.sections || []); // full practice content (fills the column next to the sticky aside)

  const serviceCards = services
    .map(
      (s) => `<a class="card reveal" href="/practices/${p.slug}/${s.slug}/">
        <h3>${esc(s.title)}</h3>
        <p>${esc(s.summary)}</p>
        <span class="card__link">Детальніше</span></a>`
    )
    .join("");

  const relArticles = articlesForPractice(articles, p.slug, 3);
  const articleBlock = relArticles.length
    ? `<section class="section section--soft reveal"><div class="container">
        <div class="section__head"><span class="eyebrow">Блог</span><h2>Корисні статті за темою</h2><p class="lead">Практичні роз’яснення законодавства від юристів LEGIUS.</p></div>
        <div class="grid grid--3">${relArticles
          .map(
            (a) => `<a class="post-card" href="/blog/${a.slug}/">
              <div class="post-card__body">
                <span class="post-card__meta">${esc(a.practiceLabel || "Блог")} · ${a.readMins || 6} хв</span>
                <h3>${esc(a.title)}</h3>
                <p class="post-card__excerpt">${esc(a.excerpt || "")}</p>
                <span class="card__link">Читати</span>
              </div></a>`
          )
          .join("")}</div>
        <div class="text-center mt-3"><a class="btn btn--dark" href="/blog/">Усі статті</a></div>
      </div></section>`
    : "";

  const relCases = cases.filter((c) => c.practice === p.slug).slice(0, 3);
  const caseBlock = relCases.length
    ? `<section class="section reveal"><div class="container">
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
    <a class="btn btn--primary" href="#practice-${p.slug}">Отримати консультацію</a>
    <a class="btn btn--ghost" style="color:#fff" href="tel:${site.phoneHref}">${icons.phone} ${esc(site.phoneDisplay)}</a>
  </div>
</div></section>

<section class="section"><div class="container">
  <div class="content-aside">
    <div class="content-aside__main prose reveal" style="max-width:none">${overview}</div>
    <aside class="content-aside__side reveal">
      ${lawyerCard(lawyer)}
      ${leadForm({ id: `practice-${p.slug}`, title: "Залишились запитання?", source: `practice:${p.slug}`, compact: true, note: "" })}
    </aside>
  </div>
</div></section>

<section class="section section--soft"><div class="container">
  <div class="section__head"><span class="eyebrow">Послуги напряму</span><h2>Що ми робимо в межах практики</h2><p class="lead">Оберіть послугу, щоб дізнатися деталі, етапи роботи та вартість.</p></div>
  <div class="grid grid--3">${serviceCards}</div>
</div></section>

${whyUsBlock(p)}

${caseBlock}

${articleBlock}

${renderFaq(p.faq, `FAQ: ${p.shortTitle}`)}

${relatedPractices(p.related, practiceBySlug)}

${ctaBand({ title: `Потрібна допомога у сфері «${p.shortTitle}»?`, text: "Залиште заявку — профільний адвокат проаналізує вашу ситуацію та запропонує стратегію." })}`;
}

/* ---------- Individual service page ---------- */
export function servicePage(p, svc, { practiceBySlug, team = [], articles = [] }) {
  const crumbs = [
    { name: "Головна", href: "/" },
    { name: "Практики", href: "/practices/" },
    { name: p.shortTitle, href: `/practices/${p.slug}/` },
    { name: svc.title, href: `/practices/${p.slug}/${svc.slug}/` },
  ];
  const lawyer = findLawyer(p, team);
  const content = serviceContent(p, svc);
  const others = practiceServices(p).filter((s) => s.slug !== svc.slug);
  const otherList = others.length
    ? `<div class="card">
        <h3 style="font-size:1.15rem;margin-bottom:0.8rem">Інші послуги напряму</h3>
        <ul style="display:grid;gap:0.5rem">${others
          .map((s) => `<li><a class="side-link" href="/practices/${p.slug}/${s.slug}/">${esc(s.title)}</a></li>`)
          .join("")}</ul>
      </div>`
    : "";
  const relArticles = articlesForPractice(articles, p.slug, 4);
  const articleList = relArticles.length
    ? `<div class="card">
        <h3 style="font-size:1.15rem;margin-bottom:0.8rem">Статті за темою</h3>
        <ul style="display:grid;gap:0.5rem">${relArticles
          .map((a) => `<li><a class="side-link" href="/blog/${a.slug}/">${esc(a.title)}</a></li>`)
          .join("")}</ul>
      </div>`
    : "";

  return `
${breadcrumbs(crumbs)}
<section class="page-hero"><div class="container">
  <span class="eyebrow"><a href="/practices/${p.slug}/" style="color:inherit">${esc(p.shortTitle)}</a></span>
  <h1>${esc(svc.title)}</h1>
  <p>${esc(content.heroSub)}</p>
  <div class="hero__actions mt-2">
    <a class="btn btn--primary" href="#service-${p.slug}-${svc.slug}">Отримати консультацію</a>
    <a class="btn btn--ghost" style="color:#fff" href="tel:${site.phoneHref}">${icons.phone} ${esc(site.phoneDisplay)}</a>
  </div>
</div></section>

<section class="section"><div class="container">
  <div class="content-aside">
    <div class="content-aside__main prose reveal" style="max-width:none">${renderSections(content.sections)}</div>
    <aside class="content-aside__side reveal">
      ${lawyerCard(lawyer)}
      ${otherList}
      ${articleList}
      ${leadForm({ id: `service-${p.slug}-${svc.slug}`, title: "Залишились запитання?", source: `service:${p.slug}/${svc.slug}`, compact: true, note: "" })}
    </aside>
  </div>
</div></section>

${renderFaq(content.faq, `Питання щодо послуги`)}

${ctaBand({ title: `Потрібна послуга «${svc.title}»?`, text: "Залиште заявку — профільний адвокат проаналізує вашу ситуацію та запропонує рішення." })}`;
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
