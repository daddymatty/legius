/* Blog: index (hub), pillar page, article page. */
import { site } from "../data/site.js";
import { leadForm, ctaBand, breadcrumbs, icons } from "./components.js";
import { renderProseSections, renderFaq, escape as esc } from "./render.js";
import { practiceServices } from "../lib/services.js";

function postCard(a) {
  return `<a class="post-card reveal" href="/blog/${a.slug}/" data-cluster="${esc(a.cluster || "")}">
    <div class="post-card__img"></div>
    <div class="post-card__body">
      <span class="post-card__meta">${esc(a.clusterLabel || "Блог")} · ${(a.readMins || 6)} хв</span>
      <h3>${esc(a.title)}</h3>
      <p class="post-card__excerpt">${esc(a.excerpt)}</p>
      <span class="card__link">Читати</span>
    </div></a>`;
}

export function blogIndexPage({ pillars, articles, clusterLabels }) {
  const crumbs = [{ name: "Головна", href: "/" }, { name: "Блог", href: "/blog/" }];
  const pillarCards = pillars
    .map(
      (p) => `<a class="card reveal" href="/blog/${p.slug}/" style="background:linear-gradient(135deg,#0D0D0F,#1A1A20);color:#fff;border:none">
        <span class="eyebrow">Стовпова сторінка</span>
        <h3 style="color:#fff">${esc(p.title)}</h3>
        <p style="color:#c4d0e4">${esc(p.excerpt)}</p>
        <span class="card__link" style="color:var(--c-teal-l)">Відкрити хаб</span></a>`
    )
    .join("");
  const sorted = articles.slice().sort((a, b) => (a.date < b.date ? 1 : -1));
  const allCards = sorted.map(postCard).join("");
  /* Filter chips by practice/cluster, in pillar order, only clusters that have articles. */
  const filterClusters = pillars
    .map((p) => [p.cluster, (sorted.find((a) => a.cluster === p.cluster) || {}).clusterLabel || p.title])
    .filter(([c]) => sorted.some((a) => a.cluster === c));
  const filterBar = `<div class="case-filter" data-blog-filter>
      <button type="button" class="case-filter__btn is-active" data-filter="all">Усі практики</button>
      ${filterClusters.map(([c, label]) => `<button type="button" class="case-filter__btn" data-filter="${esc(c)}">${esc(label)}</button>`).join("")}
    </div>`;
  return `
${breadcrumbs(crumbs)}
<section class="page-hero"><div class="container">
  <span class="eyebrow">Блог · Юридичний хаб знань</span>
  <h1>Юридична бібліотека LEGIUS</h1>
  <p>Понад ${articles.length} експертних матеріалів про сімейне, військове, корпоративне та податкове право. Практичні роз’яснення від адвокатів.</p>
</div></section>
<section class="section"><div class="container">
  <div class="section__head"><span class="eyebrow">Стовпові сторінки</span><h2>Оберіть напрям</h2></div>
  <div class="grid grid--4">${pillarCards}</div>
</div></section>
<section class="section section--soft"><div class="container">
  <div class="section__head section__head--center"><span class="eyebrow">Усі матеріали</span><h2>Статті за практиками</h2><p class="lead">Оберіть напрям, щоб відфільтрувати ${articles.length} публікацій.</p></div>
  ${filterBar}
  <div class="grid grid--3" data-blog-grid>${allCards}</div>
</div></section>
${ctaBand()}`;
}

export function pillarPage(p, { articles }) {
  const crumbs = [
    { name: "Головна", href: "/" },
    { name: "Блог", href: "/blog/" },
    { name: p.title, href: `/blog/${p.slug}/` },
  ];
  const clusterArticles = articles.filter((a) => a.cluster === p.cluster);
  const cards = clusterArticles.map(postCard).join("");
  return `
${breadcrumbs(crumbs)}
<section class="page-hero"><div class="container">
  <span class="eyebrow">Стовпова сторінка · ${clusterArticles.length} статей</span>
  <h1>${esc(p.h1)}</h1>
  <p>${esc(p.excerpt)}</p>
</div></section>
<section class="section"><div class="container">
  <div class="prose reveal" style="max-width:820px;margin-inline:auto">${p.intro}${renderProseSections(p.sections)}</div>
</div></section>
<section class="section section--soft"><div class="container">
  <div class="section__head"><span class="eyebrow">Усі матеріали кластера</span><h2>Статті за темою</h2></div>
  <div class="grid grid--3">${cards}</div>
</div></section>
${renderFaq(p.faq, "Поширені запитання")}
${ctaBand({ btn: "Консультація юриста" })}`;
}

export function articlePage(a, { practiceBySlug, pillarBySlug, articleBySlug }) {
  const pillar = pillarBySlug[a.cluster];
  const crumbs = [
    { name: "Головна", href: "/" },
    { name: "Блог", href: "/blog/" },
    ...(pillar ? [{ name: pillar.title, href: `/blog/${pillar.slug}/` }] : []),
    { name: a.title, href: `/blog/${a.slug}/` },
  ];
  const toc = (a.toc || a.sections || [])
    .map((t) => `<a href="#${t.id}">${esc(t.label || t.h2)}</a>`)
    .join("");
  const related = (a.related || [])
    .map((s) => articleBySlug[s])
    .filter(Boolean)
    .slice(0, 3)
    .map(postCard)
    .join("");
  const practice = practiceBySlug[a.practice];

  return `
${breadcrumbs(crumbs)}
<section class="page-hero"><div class="container">
  <span class="eyebrow">${esc(a.clusterLabel || "Блог")} · ${(a.readMins || 6)} хв читання</span>
  <h1>${esc(a.h1 || a.title)}</h1>
  <p>Оновлено: ${esc(a.modified || a.date)} · ${esc(site.legalName)}</p>
</div></section>
<section class="section"><div class="container">
  <div class="article-layout">
    <aside>${toc ? `<nav class="toc"><h4>Зміст</h4>${toc}</nav>` : ""}</aside>
    <div>
      <article class="prose reveal">
        ${a.intro || `<p class="lead">${esc(a.excerpt)}</p>`}
        ${renderProseSections(a.sections)}
        ${practice ? `<div class="callout">Потрібна персональна консультація з теми «${esc(practice.shortTitle)}»? <a href="/practices/${practice.slug}/">Перейдіть на сторінку практики</a> або <a href="#consult">залиште заявку</a> — відповімо протягом 15 хвилин.${(() => {
          const svc = practiceServices(practice).slice(0, 3);
          return svc.length ? `<br><span style="font-size:.92em">Послуги напряму: ${svc.map((s) => `<a href="/practices/${practice.slug}/${s.slug}/">${esc(s.title)}</a>`).join(", ")}.</span>` : "";
        })()}</div>` : ""}
      </article>
    </div>
  </div>
</div></section>
${renderFaq(a.faq, "Питання та відповіді")}
${related ? `<section class="section"><div class="container">
  <div class="section__head section__head--center"><span class="eyebrow">Блог</span><h2>Читайте також</h2></div>
  <div class="grid grid--3">${related}</div>
</div></section>` : ""}
${ctaBand({ btn: "Отримати консультацію" })}
<section class="section" id="consult"><div class="container" style="max-width:640px">
  ${leadForm({ id: `article-${a.slug}`, title: "Безкоштовна консультація юриста", source: `article:${a.slug}` })}
</div></section>`;
}
