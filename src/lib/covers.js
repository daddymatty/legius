/* Тематичні обкладинки статей блогу (16:9), генеруються при збірці.
   Стиль: світло-сірий дуотон («знебарвлене фото») + графітовий лінійний
   мотив за темою кластера + червоне підсвічення в колір бренду (#E13D27).
   Один файл на кластер → /assets/img/covers/<cluster>.svg */

const INK = "#2A2A30";      /* графіт — основний штрих */
const RED = "#E13D27";      /* акцент бренду */

/* Тематичні мотиви. Кожен малюється у координатах 0..100 (центр ~50,50),
   stroke-based; елементи з class="a" підсвічуються червоним. */
const MOTIFS = {
  /* сімейне — дві переплетені обручки */
  "simeyne-pravo": `<circle cx="38" cy="50" r="24"/><circle class="a" cx="62" cy="50" r="24"/>`,
  /* військове — щит */
  "viyskove-pravo": `<path d="M50 12l30 11v22c0 19-13 30-30 35-17-5-30-16-30-35V23l30-11z"/><path class="a" d="M38 50l9 9 17-17"/>`,
  /* корпоративне — фасад з колонами */
  "korporatyvne-pravo": `<path d="M20 84V38l30-14 30 14v46"/><path d="M32 84V46M44 84V42M56 84V42M68 84V46"/><path class="a" d="M14 84h72"/>`,
  /* податкове — документ і відсоток */
  "podatkove-pravo": `<path d="M32 12h26l14 14v58H32V12z"/><path d="M58 12v14h14"/><path class="a" d="M42 62l18-22M44 42a3.4 3.4 0 100-.1M58 61a3.4 3.4 0 100-.1"/>`,
  /* земельне — горизонт ділянки, сонце і паросток */
  "zemelne-pravo": `<path d="M8 70h84M16 80h68"/><path d="M30 70l-5 10M52 70v10M72 70l5 10"/><circle cx="79" cy="27" r="7"/><path d="M50 70V46"/><path class="a" d="M50 52c0-9 6-14 14-14 0 9-6 14-14 14zM50 60c0-7-5-11-12-11 0 7 5 11 12 11z"/>`,
  /* нерухомість — дах і ключ */
  "nerukhomist": `<path d="M18 52L50 24l32 28M28 46v34h44V46"/><path class="a" d="M44 80v-16h12v16M50 56a2.6 2.6 0 100-.1"/>`,
  /* судові спори — терези */
  "sudovi-spory": `<path d="M50 16v56M30 26h40M22 72h56M42 80h16"/><path d="M30 26L20 48a10 10 0 0020 0L30 26zM70 26L60 48a10 10 0 0020 0L70 26z"/><path class="a" d="M50 16a4 4 0 100-.1"/>`,
  /* кримінальний захист — молоток судді */
  "kryminalnyy-zakhyst-biznesu": `<path d="M56 20l20 20-9 9-20-20 9-9zM44 32L20 56l9 9 24-24"/><path class="a" d="M30 82h34M37 82l5-8h10l5 8"/>`,
  /* ІВ — лампа-ідея */
  "intelektualna-vlasnist": `<path d="M50 14a22 22 0 0112 40c-3 2-4 5-4 8H42c0-3-1-6-4-8a22 22 0 0112-40z"/><path d="M42 70h16M44 78h12"/><path class="a" d="M50 30a10 10 0 00-10 10"/>`,
  /* M&A — два кола, що зливаються; перетин підсвічено */
  "ma-zlyttya-pohlynannya": `<circle cx="36" cy="50" r="22"/><circle cx="64" cy="50" r="22"/><path class="a" d="M50 33A22 22 0 0150 67A22 22 0 0150 33Z"/>`,
  /* інвестиції — графік зростання */
  "suprovid-investytsiy": `<path d="M16 84h72M16 84V16"/><path d="M22 72l18-16 12 8 22-26"/><path class="a" d="M62 38h14v14M26 84v-6M42 84v-10M58 84v-8M74 84v-14"/>`,
  /* IT — кодові дужки */
  "it-pravo": `<path d="M34 26L14 50l20 24M66 26l20 24-20 24"/><path class="a" d="M56 20L44 80"/>`,
  /* міграційне — літак і маршрут */
  "migratsiyne-pravo": `<path d="M14 76c22 4 50 4 72 0"/><path d="M20 58l56-26-8 30-14-8-10 12-4-14-20 6z" /><path class="a" d="M76 32L48 54"/>`,
  /* дефолт — терези (як у судових спорів) */
  "default": `<path d="M50 16v56M30 26h40M22 72h56M42 80h16"/><path d="M30 26L20 48a10 10 0 0020 0L30 26zM70 26L60 48a10 10 0 0020 0L70 26z"/><path class="a" d="M50 16a4 4 0 100-.1"/>`,
};

/* Легкий детермінований «зсув композиції» від назви кластера,
   щоб обкладинки різних кластерів не були дзеркально однаковими. */
function seedOf(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 997;
  return h;
}

export function coverSVG(cluster) {
  const motif = MOTIFS[cluster] || MOTIFS.default;
  const seed = seedOf(cluster);
  const flip = seed % 2 === 1;             /* мотив праворуч або ліворуч */
  const rot = (seed % 11) - 5;             /* легкий нахил -5..+5° */
  const mx = flip ? 150 : 340;             /* позиція великого мотиву */
  const bx = flip ? 430 : 90;              /* позиція «бліку» */
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" role="img" aria-hidden="true">
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0" stop-color="#F1F1F3"/><stop offset="1" stop-color="#DCDDE0"/>
</linearGradient>
<radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
  <stop offset="0" stop-color="${RED}" stop-opacity="0.14"/><stop offset="1" stop-color="${RED}" stop-opacity="0"/>
</radialGradient>
<radialGradient id="bokeh" cx="0.5" cy="0.5" r="0.5">
  <stop offset="0" stop-color="#9A9AA2" stop-opacity="0.35"/><stop offset="1" stop-color="#9A9AA2" stop-opacity="0"/>
</radialGradient>
<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope="0.05"/></feComponentTransfer></filter>
</defs>
<rect width="640" height="360" fill="url(#bg)"/>
<circle cx="${bx}" cy="${70 + (seed % 60)}" r="150" fill="url(#bokeh)"/>
<circle cx="${640 - bx}" cy="${290 - (seed % 60)}" r="120" fill="url(#bokeh)"/>
<circle cx="${mx}" cy="180" r="170" fill="url(#glow)"/>
<g transform="translate(${mx} 180) rotate(${rot}) scale(2.7) translate(-50 -50)" fill="none" stroke="${INK}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" opacity="0.85">
  ${motif.replace(/class="a"/g, `stroke="${RED}" opacity="0.95"`)}
</g>
<path d="M0 320l640-64" stroke="#C9CACE" stroke-width="1" opacity="0.6"/>
<path d="M0 348l640-64" stroke="#C9CACE" stroke-width="1" opacity="0.35"/>
<rect x="28" y="312" width="64" height="4" fill="${RED}"/>
<rect width="640" height="360" filter="url(#grain)" opacity="0.5"/>
</svg>`;
}

export const COVER_CLUSTERS = [...Object.keys(MOTIFS)];
