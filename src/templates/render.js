/* Reusable render helpers for page bodies. */
const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function renderSections(sections = []) {
  return sections
    .map((s) => `<section class="reveal"><h2>${esc(s.h2)}</h2>${s.html}</section>`)
    .join("\n");
}

export function renderProseSections(sections = []) {
  /* sections with id for TOC anchors */
  return sections
    .map((s) => `<section id="${s.id || ""}"><h2>${esc(s.h2)}</h2>${s.html}</section>`)
    .join("\n");
}

export function renderFaq(faqs = [], heading = "Поширені запитання") {
  if (!faqs.length) return "";
  const items = faqs
    .map(
      (f) =>
        `<details><summary>${esc(f.q)}</summary><div>${f.a.startsWith("<") ? f.a : `<p>${esc(f.a)}</p>`}</div></details>`
    )
    .join("");
  return `<section class="section section--soft reveal"><div class="container">
    <div class="section__head section__head--center"><span class="eyebrow">FAQ</span><h2>${esc(heading)}</h2></div>
    <div class="faq">${items}</div>
  </div></section>`;
}

export function serviceList(services = []) {
  if (!services.length) return "";
  const items = services
    .map(
      (s) =>
        `<li style="display:flex;gap:.7rem;align-items:flex-start"><span style="color:var(--c-gold);flex:none;margin-top:.2rem"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M5 13l4 4L19 7"/></svg></span><span>${esc(s)}</span></li>`
    )
    .join("");
  return `<ul style="display:grid;gap:.7rem">${items}</ul>`;
}

export function relatedPractices(slugs = [], practiceBySlug) {
  const cards = slugs
    .map((s) => practiceBySlug[s])
    .filter(Boolean)
    .map(
      (p) =>
        `<a class="card" href="/practices/${p.slug}/"><h3>${esc(p.shortTitle)}</h3><p>${esc(p.summary)}</p><span class="card__link">Детальніше</span></a>`
    )
    .join("");
  if (!cards) return "";
  return `<section class="section reveal"><div class="container">
    <div class="section__head"><span class="eyebrow">Суміжні практики</span><h2>Це може бути корисно</h2></div>
    <div class="grid grid--3">${cards}</div>
  </div></section>`;
}

export const escape = esc;
