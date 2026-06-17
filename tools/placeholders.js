/* Generates lightweight placeholder SVG assets at build time (no binary deps). */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const NAVY = "#0e1c33";
const NAVY2 = "#1b3358";
const GOLD = "#cda35c";

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

const logo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40"><rect width="40" height="40" rx="8" fill="${NAVY}"/><path d="M20 8v24M12 14h16M14 14l-3 7a3 3 0 006 0l-3-7zM26 14l-3 7a3 3 0 006 0l-3-7z" stroke="${GOLD}" stroke-width="1.4" fill="none"/></svg>`;

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40"><rect width="40" height="40" rx="8" fill="${NAVY}"/><text x="20" y="28" font-family="Georgia, serif" font-size="22" fill="${GOLD}" text-anchor="middle">L</text></svg>`;

const office = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" width="640" height="480" role="img" aria-label="Офіс LEGIUS">
  <defs><linearGradient id="o" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#15294a"/><stop offset="1" stop-color="${NAVY}"/></linearGradient></defs>
  <rect width="640" height="480" fill="url(#o)"/>
  <g fill="none" stroke="${GOLD}" stroke-width="1.2" opacity="0.5">
    <rect x="120" y="90" width="160" height="300"/><rect x="300" y="60" width="220" height="330"/>
    ${Array.from({ length: 6 }).map((_, r) => Array.from({ length: 5 }).map((_, c) => `<rect x="${320 + c * 40}" y="${80 + r * 50}" width="26" height="34"/>`).join("")).join("")}
    ${Array.from({ length: 5 }).map((_, r) => Array.from({ length: 3 }).map((_, c) => `<rect x="${140 + c * 45}" y="${110 + r * 55}" width="30" height="38"/>`).join("")).join("")}
  </g>
  <rect x="0" y="390" width="640" height="90" fill="#0a1426"/>
  <text x="320" y="445" font-family="Georgia, serif" font-size="30" fill="${GOLD}" text-anchor="middle" letter-spacing="3">LEGIUS</text>
</svg>`;

const og = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630" role="img" aria-label="LEGIUS">
  <defs><linearGradient id="b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${NAVY}"/><stop offset="1" stop-color="${NAVY2}"/></linearGradient></defs>
  <rect width="1200" height="630" fill="url(#b)"/>
  <circle cx="1000" cy="120" r="260" fill="${GOLD}" opacity="0.10"/>
  <text x="80" y="300" font-family="Georgia, serif" font-size="86" fill="#fff" font-weight="bold">LEGIUS</text>
  <text x="84" y="360" font-family="Arial, sans-serif" font-size="30" fill="${GOLD}" letter-spacing="4">ЮРИДИЧНА КОМПАНІЯ · КИЇВ</text>
  <text x="84" y="430" font-family="Arial, sans-serif" font-size="26" fill="#c4d0e4">Корпоративне · Сімейне · Військове · Податкове право</text>
  <rect x="80" y="470" width="120" height="4" fill="${GOLD}"/>
</svg>`;

export async function makePlaceholders(imgDir, { team = [] } = {}) {
  await mkdir(imgDir, { recursive: true });
  await mkdir(path.join(imgDir, "team"), { recursive: true });
  await writeFile(path.join(imgDir, "logo.svg"), logo);
  await writeFile(path.join(imgDir, "favicon.svg"), favicon);
  await writeFile(path.join(imgDir, "office.svg"), office);
  await writeFile(path.join(imgDir, "og-default.svg"), og);
  for (const m of team) {
    await writeFile(path.join(imgDir, "team", `${m.slug}.svg`), avatar(m.name));
  }
}
