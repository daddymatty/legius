/* ============================================================
   LEGIUS static site generator.
   Reads content data + templates -> writes pure static HTML to /dist.
   ============================================================ */
import { mkdir, writeFile, rm, cp, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { site } from "./src/data/site.js";
import { practices, practiceBySlug } from "./src/data/practices.js";
import { team } from "./src/data/team.js";
import { cases } from "./src/data/cases.js";
import { locations } from "./src/data/locations.js";
import { testimonials } from "./src/data/testimonials.js";
import { homeFaq } from "./src/data/faq.js";
import { pillars, articles, articleBySlug, pillarBySlug } from "./src/data/blog.js";

import { layout } from "./src/templates/layout.js";
import { header, footer } from "./src/templates/components.js";
import { homePage } from "./src/templates/home.js";
import { practicePage, servicePage, practicesIndexPage } from "./src/templates/practice.js";
import { practiceServices, serviceContent } from "./src/lib/services.js";
import { locationPage } from "./src/templates/location.js";
import { teamIndexPage, teamMemberPage } from "./src/templates/team.js";
import { casesPage } from "./src/templates/cases.js";
import { blogIndexPage, pillarPage, articlePage } from "./src/templates/blog.js";
import { aboutPage, contactsPage, privacyPage, notFoundPage } from "./src/templates/pages.js";
import {
  breadcrumbSchema, faqSchema, serviceSchema, articleSchema,
  personSchema, localBusinessSchema,
} from "./src/lib/seo.js";
import { makePlaceholders } from "./tools/placeholders.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, "dist");

/* Optional deploy config:
   BASE_PATH — sub-path prefix for project hosting (e.g. "/legius" on GitHub Pages).
   SITE_URL  — absolute origin (used for canonical, OG, sitemap, robots). */
const BASE = (process.env.BASE_PATH || "").replace(/\/+$/, "");
if (process.env.SITE_URL) site.domain = process.env.SITE_URL.replace(/\/+$/, "");

/* Prefix root-absolute internal links/assets with BASE (skips //, full URLs, anchors). */
function applyBase(html) {
  return BASE ? html.replace(/(href|src)="\/(?!\/)/g, `$1="${BASE}/`) : html;
}

const CLUSTER_LABELS = {
  "simeyne-pravo": "Сімейне право",
  "viyskove-pravo": "Військове право",
  "korporatyvne-pravo": "Корпоративне право",
  "podatkove-pravo": "Податкове право",
};

/* enrich articles with display labels */
for (const a of articles) {
  a.clusterLabel = CLUSTER_LABELS[a.cluster] || "Блог";
  a.practiceLabel = practiceBySlug[a.practice]?.shortTitle || a.clusterLabel;
}
for (const p of pillars) p.clusterLabel = CLUSTER_LABELS[p.cluster] || "Блог";

const sitemapUrls = [];

async function writePage(routePath, html, { lastmod, priority = "0.6", changefreq = "monthly", index = true } = {}) {
  const dir = routePath === "/" ? DIST : path.join(DIST, routePath);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, "index.html"), applyBase(html), "utf8");
  if (index) {
    sitemapUrls.push({
      loc: site.domain + (routePath === "/" ? "/" : "/" + routePath + "/"),
      lastmod: lastmod || new Date().toISOString().slice(0, 10),
      priority, changefreq,
    });
  }
}

function page(opts, content, currentPath = "") {
  return layout({
    ...opts,
    content,
    header: header(practices, currentPath),
    footer: footer(practices),
  });
}

async function build() {
  process.env.ASSET_V = Date.now().toString(36); /* bust CSS/JS cache each build */
  console.log("→ Очищення dist/");
  if (existsSync(DIST)) await rm(DIST, { recursive: true, force: true });
  await mkdir(DIST, { recursive: true });

  /* assets */
  console.log("→ Копіювання ассетів");
  await cp(path.join(__dirname, "src/assets"), path.join(DIST, "assets"), { recursive: true });
  await makePlaceholders(path.join(DIST, "assets/img"), { team });

  /* Design preview/moodboard (standalone, noindex) — served at /design/. */
  if (existsSync(path.join(__dirname, "design"))) {
    await cp(path.join(__dirname, "design"), path.join(DIST, "design"), { recursive: true });
    console.log("→ Дизайн-прев'ю /design/");
  }

  /* ---------- Home ---------- */
  console.log("→ Головна");
  await writePage(
    "/",
    page(
      {
        title: `${site.name} — ${site.tagline} у Києві | Адвокати та юристи`,
        description: "Юридична компанія LEGIUS у Києві: корпоративне, сімейне, військове, податкове право, M&A, судові спори. 15+ років, 94% виграних справ. Безкоштовна консультація.",
        canonical: "/",
        schemas: [faqSchema(homeFaq)],
      },
      homePage({ practices, cases, team, articles, testimonials, homeFaq }),
      "/"
    ),
    { priority: "1.0", changefreq: "weekly" }
  );

  /* ---------- Practices ---------- */
  console.log("→ Практики:", practices.length);
  await writePage(
    "practices",
    page(
      {
        title: "Практики юридичної компанії LEGIUS — Київ | 12 напрямів",
        description: "12 напрямів юридичної практики LEGIUS у Києві: корпоративне, податкове, сімейне, військове право, нерухомість, M&A, IT Law, судові спори.",
        canonical: "/practices/",
        schemas: [breadcrumbSchema([{ name: "Головна", href: "/" }, { name: "Практики", href: "/practices/" }])],
      },
      practicesIndexPage(practices),
      "/practices/"
    ),
    { priority: "0.9" }
  );
  for (const p of practices) {
    await writePage(
      `practices/${p.slug}`,
      page(
        {
          title: p.metaTitle,
          description: p.metaDescription,
          canonical: `/practices/${p.slug}/`,
          ogType: "article",
          schemas: [
            serviceSchema(p),
            faqSchema(p.faq || []),
            breadcrumbSchema([
              { name: "Головна", href: "/" },
              { name: "Практики", href: "/practices/" },
              { name: p.shortTitle, href: `/practices/${p.slug}/` },
            ]),
          ],
        },
        practicePage(p, { practiceBySlug, cases, team })
      ),
      { priority: "0.9" }
    );

    /* individual service pages under each practice */
    for (const svc of practiceServices(p)) {
      const sc = serviceContent(p, svc);
      await writePage(
        `practices/${p.slug}/${svc.slug}`,
        page(
          {
            title: `${svc.title} — ${p.shortTitle} | ${site.name}`,
            description: `${svc.title}: послуга практики «${p.shortTitle}» від LEGIUS у Києві. Профільний адвокат, прозора вартість, конфіденційність. Безкоштовна консультація.`,
            canonical: `/practices/${p.slug}/${svc.slug}/`,
            ogType: "article",
            schemas: [
              faqSchema(sc.faq || []),
              breadcrumbSchema([
                { name: "Головна", href: "/" },
                { name: "Практики", href: "/practices/" },
                { name: p.shortTitle, href: `/practices/${p.slug}/` },
                { name: svc.title, href: `/practices/${p.slug}/${svc.slug}/` },
              ]),
            ],
          },
          servicePage(p, svc, { practiceBySlug, team })
        ),
        { priority: "0.7" }
      );
    }
  }

  /* ---------- Local landing pages (root level) ---------- */
  console.log("→ Локальні сторінки:", locations.length);
  for (const loc of locations) {
    await writePage(
      loc.slug,
      page(
        {
          title: loc.metaTitle,
          description: loc.metaDescription,
          canonical: `/${loc.slug}/`,
          schemas: [
            localBusinessSchema(loc),
            faqSchema(loc.faq || []),
            breadcrumbSchema([{ name: "Головна", href: "/" }, { name: loc.navLabel, href: `/${loc.slug}/` }]),
          ],
        },
        locationPage(loc, { practiceBySlug }),
        `/${loc.slug}/`
      ),
      { priority: "0.8" }
    );
  }

  /* ---------- Team ---------- */
  console.log("→ Команда:", team.length);
  await writePage(
    "team",
    page(
      {
        title: "Команда LEGIUS — адвокати та юристи у Києві",
        description: "Партнери, адвокати та юристи юридичної компанії LEGIUS. Профільні фахівці з 12 практик: корпоративне, податкове, сімейне, військове право.",
        canonical: "/team/",
        schemas: [breadcrumbSchema([{ name: "Головна", href: "/" }, { name: "Команда", href: "/team/" }])],
      },
      teamIndexPage(team),
      "/team/"
    ),
    { priority: "0.7" }
  );
  for (const m of team) {
    await writePage(
      `team/${m.slug}`,
      page(
        {
          title: `${m.name} — ${m.role} | LEGIUS`,
          description: `${m.name}, ${m.role} юридичної компанії LEGIUS. ${m.short}`,
          canonical: `/team/${m.slug}/`,
          ogType: "profile",
          ogImage: m.photo,
          schemas: [
            personSchema(m),
            breadcrumbSchema([
              { name: "Головна", href: "/" },
              { name: "Команда", href: "/team/" },
              { name: m.name, href: `/team/${m.slug}/` },
            ]),
          ],
        },
        teamMemberPage(m, { practiceBySlug })
      ),
      { priority: "0.6" }
    );
  }

  /* ---------- Cases ---------- */
  console.log("→ Кейси:", cases.length);
  await writePage(
    "cases",
    page(
      {
        title: "Кейси LEGIUS — виграні справи | Київ",
        description: `Понад ${cases.length} реальних кейсів юридичної компанії LEGIUS: проблема клієнта, стратегія та результат у сімейному, корпоративному, податковому та військовому праві.`,
        canonical: "/cases/",
        schemas: [breadcrumbSchema([{ name: "Головна", href: "/" }, { name: "Кейси", href: "/cases/" }])],
      },
      casesPage(cases, practices),
      "/cases/"
    ),
    { priority: "0.8" }
  );

  /* ---------- Blog ---------- */
  console.log("→ Блог: pillars", pillars.length, "articles", articles.length);
  await writePage(
    "blog",
    page(
      {
        title: "Блог LEGIUS — юридичні статті та роз’яснення | Київ",
        description: `Понад ${articles.length} експертних статей про сімейне, військове, корпоративне та податкове право України. Практичні поради адвокатів LEGIUS.`,
        canonical: "/blog/",
        schemas: [breadcrumbSchema([{ name: "Головна", href: "/" }, { name: "Блог", href: "/blog/" }])],
      },
      blogIndexPage({ pillars, articles, clusterLabels: CLUSTER_LABELS }),
      "/blog/"
    ),
    { priority: "0.8", changefreq: "daily" }
  );
  for (const p of pillars) {
    await writePage(
      `blog/${p.slug}`,
      page(
        {
          title: p.metaTitle,
          description: p.metaDescription,
          canonical: `/blog/${p.slug}/`,
          ogType: "article",
          schemas: [
            articleSchema(p),
            faqSchema(p.faq || []),
            breadcrumbSchema([
              { name: "Головна", href: "/" },
              { name: "Блог", href: "/blog/" },
              { name: p.title, href: `/blog/${p.slug}/` },
            ]),
          ],
        },
        pillarPage(p, { articles })
      ),
      { priority: "0.8", lastmod: p.modified, changefreq: "weekly" }
    );
  }
  for (const a of articles) {
    await writePage(
      `blog/${a.slug}`,
      page(
        {
          title: a.metaTitle,
          description: a.metaDescription,
          canonical: `/blog/${a.slug}/`,
          ogType: "article",
          schemas: [
            articleSchema(a),
            faqSchema(a.faq || []),
            breadcrumbSchema([
              { name: "Головна", href: "/" },
              { name: "Блог", href: "/blog/" },
              ...(pillarBySlug[a.cluster] ? [{ name: pillarBySlug[a.cluster].title, href: `/blog/${a.cluster}/` }] : []),
              { name: a.title, href: `/blog/${a.slug}/` },
            ]),
          ],
        },
        articlePage(a, { practiceBySlug, pillarBySlug, articleBySlug })
      ),
      { priority: "0.6", lastmod: a.modified || a.date }
    );
  }

  /* ---------- Static pages ---------- */
  console.log("→ Про компанію / Контакти / Політика / 404");
  await writePage("about", page({
    title: "Про компанію LEGIUS — юридична фірма у Києві",
    description: "LEGIUS — преміальна юридична компанія у Києві з 2009 року. 24 юристи, 12 практик, 94% виграних справ. Дізнайтеся про нашу команду та цінності.",
    canonical: "/about/",
    schemas: [breadcrumbSchema([{ name: "Головна", href: "/" }, { name: "Про компанію", href: "/about/" }])],
  }, aboutPage({ team, practices }), "/about/"), { priority: "0.7" });

  await writePage("contacts", page({
    title: "Контакти LEGIUS — юридична компанія у Києві",
    description: "Зв’яжіться з юридичною компанією LEGIUS: телефон, e-mail, адреса офісу у центрі Києва, месенджери. Безкоштовна первинна консультація.",
    canonical: "/contacts/",
    schemas: [breadcrumbSchema([{ name: "Головна", href: "/" }, { name: "Контакти", href: "/contacts/" }])],
  }, contactsPage(), "/contacts/"), { priority: "0.7" });

  await writePage("privacy", page({
    title: "Політика конфіденційності | LEGIUS",
    description: "Політика конфіденційності та обробки персональних даних на сайті юридичної компанії LEGIUS.",
    canonical: "/privacy/", noindex: true,
  }, privacyPage(), "/privacy/"), { index: false });

  await writeFile(path.join(DIST, "404.html"), applyBase(page({
    title: "404 — сторінку не знайдено | LEGIUS",
    description: "Сторінку не знайдено.", canonical: "/404.html", noindex: true,
  }, notFoundPage())), "utf8");

  /* ---------- robots.txt, sitemap.xml, manifest ---------- */
  console.log("→ robots.txt, sitemap.xml, manifest");
  await writeFile(
    path.join(DIST, "robots.txt"),
    `User-agent: *\nAllow: /\nDisallow: /privacy/\n\nSitemap: ${site.domain}/sitemap.xml\n`,
    "utf8"
  );
  const sm = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls
    .map((u) => `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`)
    .join("\n")}\n</urlset>\n`;
  await writeFile(path.join(DIST, "sitemap.xml"), sm, "utf8");
  await writeFile(
    path.join(DIST, "site.webmanifest"),
    JSON.stringify({
      name: site.legalName, short_name: site.name, lang: "uk",
      start_url: BASE + "/", display: "standalone", background_color: "#ffffff", theme_color: "#0e1c33",
      icons: [{ src: BASE + "/assets/img/favicon.svg", sizes: "any", type: "image/svg+xml" }],
    }),
    "utf8"
  );

  /* GitHub Pages: disable Jekyll processing so all files are served as-is. */
  await writeFile(path.join(DIST, ".nojekyll"), "", "utf8");

  /* ---------- Minify HTML/CSS/JS (optional — skipped if deps absent) ---------- */
  await minifyDist();

  const totalPages = sitemapUrls.length + 1;
  console.log(`\n✓ Готово. Згенеровано ${totalPages} сторінок у dist/`);
  console.log(`  Практики: ${practices.length} | Локальні: ${locations.length} | Команда: ${team.length} | Кейси: ${cases.length}`);
  console.log(`  Блог: ${pillars.length} стовпових + ${articles.length} статей`);
}

/* Walk dist and minify HTML/CSS/JS in place. Uses optional deps; if they are
   not installed (e.g. a bare `node build.js` without `npm ci`), it logs and skips
   so the build never fails on minification. */
async function minifyDist() {
  let htmlMin, csso, terser;
  try {
    ({ minify: htmlMin } = await import("html-minifier-terser"));
    csso = (await import("csso")).default || (await import("csso"));
    terser = await import("terser");
  } catch {
    console.log("→ Мініфікація пропущена (немає dev-залежностей)");
    return;
  }
  const { readFile } = await import("node:fs/promises");
  async function walk(dir) {
    const out = [];
    for (const e of await readdir(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) out.push(...(await walk(full)));
      else out.push(full);
    }
    return out;
  }
  const files = await walk(DIST);
  let before = 0, after = 0;
  for (const f of files) {
    const ext = path.extname(f);
    if (![".html", ".css", ".js"].includes(ext)) continue;
    if (f.includes(`${path.sep}design${path.sep}`)) continue; /* leave standalone preview untouched */
    const src = await readFile(f, "utf8");
    before += Buffer.byteLength(src);
    let res = src;
    try {
      if (ext === ".html") {
        res = await htmlMin(src, {
          collapseWhitespace: true, conservativeCollapse: true, removeComments: true,
          minifyCSS: true, minifyJS: true, keepClosingSlash: true, removeRedundantAttributes: false,
        });
      } else if (ext === ".css") {
        res = csso.minify(src).css;
      } else if (ext === ".js") {
        res = (await terser.minify(src, { format: { comments: false } })).code || src;
      }
    } catch (err) {
      console.warn(`  ! Мініфікація ${path.relative(DIST, f)} пропущена: ${err.message}`);
      res = src;
    }
    after += Buffer.byteLength(res);
    if (res !== src) await writeFile(f, res, "utf8");
  }
  const saved = before ? Math.round((1 - after / before) * 100) : 0;
  console.log(`→ Мініфікація: ${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB (−${saved}%)`);
}

build().catch((e) => {
  console.error("✗ Помилка збірки:", e);
  process.exit(1);
});
