/* Generates lightweight placeholder SVG assets at build time (no binary deps). */
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const NAVY = "#0D0D0F";
const NAVY2 = "#16161A";
const GOLD = "#E13D27"; /* accent — teal (kept var name for minimal diff) */
const BRASS = "#E13D27"; /* logo top-bar gold */

function initials(name = "") {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

function avatar(name) {
  const ini = initials(name);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="300" height="400" role="img" aria-label="${name}">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${NAVY}"/><stop offset="1" stop-color="${NAVY2}"/></linearGradient></defs>
  <rect width="300" height="400" fill="url(#g)"/>
  <circle cx="150" cy="150" r="64" fill="none" stroke="${GOLD}" stroke-width="2" opacity="0.6"/>
  <text x="150" y="172" font-family="Georgia, serif" font-size="64" fill="${GOLD}" text-anchor="middle">${ini}</text>
  <path d="M70 400c0-50 36-86 80-86s80 36 80 86" fill="${GOLD}" opacity="0.18"/>
  <circle cx="150" cy="150" r="40" fill="${GOLD}" opacity="0.12"/>
</svg>`;
}

/* Monogram: the signature "E" — three bars, top one gold/brass. */
const monogram = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40"><rect width="40" height="40" rx="9" fill="${NAVY}"/><rect x="10" y="12.2" width="20" height="2.6" rx="1.3" fill="${BRASS}"/><rect x="10" y="18.7" width="20" height="2.6" rx="1.3" fill="#ffffff"/><rect x="10" y="25.2" width="20" height="2.6" rx="1.3" fill="#ffffff"/></svg>`;
const logo = monogram;
const favicon = monogram;

const office = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" width="640" height="480" role="img" aria-label="Офіс LEGIUS">
  <defs><linearGradient id="o" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16161A"/><stop offset="1" stop-color="${NAVY}"/></linearGradient></defs>
  <rect width="640" height="480" fill="url(#o)"/>
  <g fill="none" stroke="${GOLD}" stroke-width="1.2" opacity="0.5">
    <rect x="120" y="90" width="160" height="300"/><rect x="300" y="60" width="220" height="330"/>
    ${Array.from({ length: 6 }).map((_, r) => Array.from({ length: 5 }).map((_, c) => `<rect x="${320 + c * 40}" y="${80 + r * 50}" width="26" height="34"/>`).join("")).join("")}
    ${Array.from({ length: 5 }).map((_, r) => Array.from({ length: 3 }).map((_, c) => `<rect x="${140 + c * 45}" y="${110 + r * 55}" width="30" height="38"/>`).join("")).join("")}
  </g>
  <rect x="0" y="390" width="640" height="90" fill="#0A0A0C"/>
  <text x="320" y="445" font-family="Georgia, serif" font-size="30" fill="${GOLD}" text-anchor="middle" letter-spacing="3">LEGIUS</text>
</svg>`;

const og = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630" role="img" aria-label="LEGIUS">
  <defs><linearGradient id="b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${NAVY}"/><stop offset="1" stop-color="${NAVY2}"/></linearGradient></defs>
  <rect width="1200" height="630" fill="url(#b)"/>
  <circle cx="1010" cy="120" r="260" fill="${GOLD}" opacity="0.10"/>
  <g>
    <rect x="84" y="214" width="120" height="8" rx="4" fill="${BRASS}"/>
    <rect x="84" y="240" width="120" height="8" rx="4" fill="#ffffff" opacity="0.95"/>
    <rect x="84" y="266" width="120" height="8" rx="4" fill="#ffffff" opacity="0.95"/>
  </g>
  <text x="80" y="430" font-family="Arial, Helvetica, sans-serif" font-weight="300" letter-spacing="24" font-size="118" fill="#fff">LEGIUS</text>
  <rect x="84" y="470" width="80" height="4" fill="${BRASS}"/>
  <text x="84" y="520" font-family="Arial, sans-serif" font-size="28" fill="${GOLD}" letter-spacing="4">ЮРИДИЧНА КОМПАНІЯ · КИЇВ</text>
  <text x="84" y="562" font-family="Arial, sans-serif" font-size="24" fill="#c4d0e4">Корпоративне · Сімейне · Військове · Податкове право</text>
</svg>`;

export async function makePlaceholders(imgDir, { team = [] } = {}) {
  await mkdir(imgDir, { recursive: true });
  await mkdir(path.join(imgDir, "team"), { recursive: true });
  await writeFile(path.join(imgDir, "logo.svg"), logo);
  await writeFile(path.join(imgDir, "favicon.svg"), favicon);
  await writeFile(path.join(imgDir, "office.svg"), office);
  await writeFile(path.join(imgDir, "og-default.svg"), og);
  for (const m of team) {
    /* If a member uses a real raster photo (.jpg/.png/.webp) that is already
       present (copied from src/assets), keep it. Otherwise fall back to a
       generated SVG placeholder and repoint the member to it. */
    const isSvg = (m.photo || "").endsWith(".svg");
    if (!isSvg) {
      const real = path.join(imgDir, "team", path.basename(m.photo));
      if (existsSync(real)) continue; // real photo present → use as-is
      m.photo = `/assets/img/team/${m.slug}.svg`; // missing → use placeholder
    }
    await writeFile(path.join(imgDir, "team", `${m.slug}.svg`), avatar(m.name));
  }
}
