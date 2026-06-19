/* Team list + member detail. */
import { site } from "../data/site.js";
import { leadForm, ctaBand, breadcrumbs, icons } from "./components.js";
import { escape as esc } from "./render.js";

export function teamIndexPage(team) {
  const crumbs = [{ name: "Головна", href: "/" }, { name: "Команда", href: "/team/" }];
  const cards = team
    .map(
      (m) => `<a class="team-card reveal" href="/team/${m.slug}/">
        <div class="team-card__photo"><img src="${m.photo}" width="300" height="400" loading="lazy" decoding="async" alt="${esc(m.displayName || m.name)} — ${esc(m.role)}"></div>
        <h3>${esc(m.displayName || m.name)}</h3><div class="role">${esc(m.role)}</div>
        <p style="color:var(--c-slate);font-size:.9rem;margin-top:.4rem">${esc(m.short)}</p>
      </a>`
    )
    .join("");
  return `
${breadcrumbs(crumbs)}
<section class="page-hero"><div class="container">
  <span class="eyebrow">Команда</span>
  <h1>Партнери, адвокати та юристи LEGIUS</h1>
  <p>Досвідчена команда, у якій кожну справу веде профільний фахівець. ${site.stats.lawyers} юристів, ${site.stats.years} років сукупної практики.</p>
</div></section>
<section class="section"><div class="container"><div class="grid grid--3">${cards}</div></div></section>
${ctaBand()}`;
}

export function teamMemberPage(m, { practiceBySlug }) {
  const crumbs = [
    { name: "Головна", href: "/" },
    { name: "Команда", href: "/team/" },
    { name: m.displayName || m.name, href: `/team/${m.slug}/` },
  ];
  const list = (arr = []) => arr.map((x) => `<li style="display:flex;gap:.6rem"><span style="color:var(--c-gold)">${icons.check}</span><span>${esc(x)}</span></li>`).join("");
  const edu = (m.education || []).map((e) => `<li><strong>${esc(e.org)}</strong><br><span style="color:var(--c-muted)">${esc(e.degree)}${e.year ? ", " + e.year : ""}</span></li>`).join("");
  const practiceLinks = (m.practices || [])
    .map((s) => practiceBySlug[s])
    .filter(Boolean)
    .map((p) => `<a class="chip" href="/practices/${p.slug}/">${esc(p.shortTitle)}</a>`)
    .join("");

  return `
${breadcrumbs(crumbs)}
<section class="section"><div class="container">
  <div class="split">
    <div class="reveal"><div class="media-frame team-photo" style="aspect-ratio:3/4;max-width:420px"><img src="${m.photo}" width="420" height="560" decoding="async" alt="${esc(m.displayName || m.name)} — ${esc(m.role)}"></div></div>
    <div class="reveal">
      <span class="eyebrow">${esc(m.role)}</span>
      <h1>${esc(m.displayName || m.name)}</h1>
      <p class="lead">${esc(m.short)}</p>
      <div class="chips mt-2">${practiceLinks}</div>
      <div class="hero__actions mt-3">
        <a class="btn btn--primary" href="#consult">Записатися на консультацію</a>
        ${m.email ? `<a class="btn btn--ghost" href="mailto:${m.email}">${icons.mail} Написати</a>` : ""}
      </div>
    </div>
  </div>
</div></section>

<section class="section section--soft"><div class="container">
  <div class="split" style="align-items:start">
    <div class="prose reveal">${m.bio}</div>
    <div class="reveal" style="display:grid;gap:1.5rem">
      <div class="card"><h3 style="font-size:1.1rem;margin-bottom:.8rem">Спеціалізація</h3><ul style="display:grid;gap:.5rem">${list(m.specialization)}</ul></div>
      <div class="card"><h3 style="font-size:1.1rem;margin-bottom:.8rem">Освіта</h3><ul style="display:grid;gap:.8rem">${edu}</ul></div>
      <div class="card"><h3 style="font-size:1.1rem;margin-bottom:.8rem">Сертифікати та членства</h3><ul style="display:grid;gap:.5rem">${list(m.certificates)}</ul></div>
      <div class="card"><h3 style="font-size:1.1rem;margin-bottom:.8rem">Професійні досягнення</h3><ul style="display:grid;gap:.5rem">${list(m.achievements)}</ul></div>
      ${m.languages ? `<div class="card"><h3 style="font-size:1.1rem;margin-bottom:.8rem">Мови</h3><div class="chips">${m.languages.map((l) => `<span class="chip">${esc(l)}</span>`).join("")}</div></div>` : ""}
    </div>
  </div>
</div></section>

${ctaBand()}
<section class="section" id="consult"><div class="container" style="max-width:640px">
  ${leadForm({ id: `team-${m.slug}`, title: `Консультація: ${m.displayName || m.name}`, source: `team:${m.slug}` })}
</div></section>`;
}
