/* Cases archive page. */
import { ctaBand, breadcrumbs, icons } from "./components.js";
import { escape as esc } from "./render.js";

export function casesPage(cases, practices) {
  const crumbs = [{ name: "Головна", href: "/" }, { name: "Кейси", href: "/cases/" }];
  const cards = cases
    .map(
      (c) => `<article class="case-card reveal" id="${c.slug}">
        <div class="case-card__body">
          <span class="tag">${esc(c.practiceLabel || c.tag)} · ${c.year}</span>
          <h3 style="font-size:1.2rem">${esc(c.title)}</h3>
          <p><strong>Проблема:</strong> ${esc(c.problem)}</p>
          <p style="color:var(--c-slate);font-size:.95rem"><strong>Що зробили:</strong> ${esc(c.work)}</p>
          <p style="color:var(--c-slate);font-size:.95rem"><strong>Результат:</strong> ${esc(c.result)}</p>
          <div class="case-card__result">${icons.check} ${esc(c.metric || c.result)}</div>
        </div>
      </article>`
    )
    .join("");
  return `
${breadcrumbs(crumbs)}
<section class="page-hero"><div class="container">
  <span class="eyebrow" style="color:var(--c-gold-2)">Кейси</span>
  <h1>Справи, які ми виграли</h1>
  <p>Понад ${cases.length} детальних прикладів роботи: проблема клієнта, наша стратегія та досягнутий результат у різних практиках.</p>
</div></section>
<section class="section"><div class="container"><div class="grid grid--3">${cards}</div></div></section>
${ctaBand({ title: "Маєте схожу ситуацію?", text: "Розкажіть про вашу справу — ми оцінимо перспективи та запропонуємо рішення." })}`;
}
