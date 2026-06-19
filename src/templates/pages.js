/* About, Contacts, Privacy, 404. */
import { site, trustBadges } from "../data/site.js";
import { leadForm, ctaBand, breadcrumbs, icons } from "./components.js";
import { escape as esc } from "./render.js";
import { practiceServices } from "../lib/services.js";

export function aboutPage({ team, practices }) {
  const crumbs = [{ name: "Головна", href: "/" }, { name: "Про компанію", href: "/about/" }];
  const values = [
    { h: "Результат понад усе", p: "Ми вимірюємо успіх не кількістю засідань, а досягнутою для клієнта метою." },
    { h: "Чесна оцінка", p: "Якщо шансів мало — скажемо прямо. Ми не продаємо ілюзій." },
    { h: "Конфіденційність", p: "Адвокатська таємниця та захищений документообіг — основа нашої роботи." },
    { h: "Партнерська залученість", p: "Кожен проєкт курує партнер, який особисто відповідає за результат." },
  ]
    .map((v) => `<div class="feature reveal"><div class="feature__num">${icons.check}</div><div><h3>${esc(v.h)}</h3><p>${esc(v.p)}</p></div></div>`)
    .join("");
  const milestones = [
    [String(site.founded), "Заснування компанії у Києві"],
    ["2014", "Відкриття практики податкових спорів"],
    ["2018", "Запуск напрямів M&A та IT Law"],
    ["2022", "Створення практики військового права"],
    ["2025", `${site.stats.cases} успішно завершених справ`],
  ]
    .map(([y, t]) => `<div class="feature reveal"><div class="feature__num">${y}</div><div><p style="color:var(--c-ink);font-weight:600">${esc(t)}</p></div></div>`)
    .join("");

  return `
${breadcrumbs(crumbs)}
<section class="page-hero"><div class="container">
  <span class="eyebrow">Про компанію</span>
  <h1>${esc(site.legalName)}</h1>
  <p>Преміальна юридична компанія в Києві. ${site.stats.years} років захищаємо інтереси бізнесу, інвесторів та приватних клієнтів у найскладніших справах.</p>
</div></section>

<section class="section"><div class="container">
  <div class="split">
    <div class="reveal">
      <span class="eyebrow">Хто ми</span>
      <h2>Юридичний партнер, а не просто підрядник</h2>
      <p class="lead">LEGIUS — це команда з ${site.stats.lawyers} адвокатів і юристів, об’єднаних навколо 12 практик. Ми супроводжуємо клієнтів на всіх етапах: від превентивного консалтингу до представництва у Верховному Суді.</p>
      <p style="color:var(--c-slate)">Наша філософія проста: глибока спеціалізація замість універсальності. Саме тому понад ${site.stats.winRate} наших справ завершуються на користь клієнта.</p>
      <div class="chips mt-2">${trustBadges.map((b) => `<span class="chip">${esc(b)}</span>`).join("")}</div>
    </div>
    <div class="reveal media-frame"><img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=70" width="640" height="480" loading="lazy" decoding="async" alt="Офіс LEGIUS"></div>
  </div>
</div></section>

<section class="section section--navy"><div class="container">
  <div class="grid grid--4">
    <div><div class="feature__num" style="font-size:2.4rem">${site.stats.years}</div><p>років практики</p></div>
    <div><div class="feature__num" style="font-size:2.4rem">${site.stats.cases}</div><p>виграних справ</p></div>
    <div><div class="feature__num" style="font-size:2.4rem">${site.stats.lawyers}</div><p>юристів</p></div>
    <div><div class="feature__num" style="font-size:2.4rem">${site.stats.winRate}</div><p>успішних рішень</p></div>
  </div>
</div></section>

<section class="section"><div class="container">
  <div class="section__head"><span class="eyebrow">Цінності</span><h2>Принципи, за якими ми працюємо</h2></div>
  <div class="features features--3">${values}</div>
</div></section>

<section class="section section--soft"><div class="container">
  <div class="section__head"><span class="eyebrow">Історія</span><h2>Ключові етапи</h2></div>
  <div class="features features--3">${milestones}</div>
</div></section>

<section class="section"><div class="container">
  <div class="section__head section__head--center"><span class="eyebrow">Команда</span><h2>Люди, які створюють LEGIUS</h2></div>
  <div class="grid grid--3">${team
    .map((m) => `<a class="team-card reveal" href="/team/${m.slug}/"><div class="team-card__photo"><img src="${m.photo}" width="300" height="400" loading="lazy" decoding="async" alt="${esc(m.name)}"></div><h3>${esc(m.name)}</h3><div class="role">${esc(m.role)}</div></a>`)
    .join("")}</div>
</div></section>

${ctaBand()}`;
}

export function contactsPage() {
  const crumbs = [{ name: "Головна", href: "/" }, { name: "Контакти", href: "/contacts/" }];
  return `
${breadcrumbs(crumbs)}
<section class="page-hero"><div class="container">
  <span class="eyebrow">Контакти</span>
  <h1>Зв’яжіться з LEGIUS</h1>
  <p>Безкоштовна первинна консультація. Працюємо в офісі у центрі Києва та онлайн — по всій Україні.</p>
</div></section>

<section class="section"><div class="container">
  <div class="contact-grid">
    <div class="reveal">
      <ul class="contact-info">
        <li><span class="ico">${icons.pin}</span><div><strong>Адреса офісу</strong><br>${esc(site.address.street)}, ${esc(site.address.locality)}</div></li>
        <li><span class="ico">${icons.phone}</span><div><strong>Телефони</strong><br><a href="tel:${site.phoneHref}">${esc(site.phoneDisplay)}</a><br><a href="tel:${site.mobileHref}">${esc(site.mobileDisplay)}</a></div></li>
        <li><span class="ico">${icons.mail}</span><div><strong>E-mail</strong><br><a href="mailto:${site.email}">${esc(site.email)}</a></div></li>
        <li><span class="ico">${icons.clock}</span><div><strong>Графік роботи</strong><br>${esc(site.hours)}</div></li>
      </ul>
      <div class="chips mt-2">
        <a class="chip" href="${site.messengers.telegram}" target="_blank" rel="noopener">Telegram</a>
        <a class="chip" href="${site.messengers.whatsapp}" target="_blank" rel="noopener">WhatsApp</a>
        <a class="chip" href="${site.messengers.viber}" target="_blank" rel="noopener">Viber</a>
      </div>
      <div class="map-frame mt-3"><iframe title="Мапа офісу LEGIUS" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=30.51%2C50.43%2C30.535%2C50.445&layer=mapnik&marker=${site.address.lat}%2C${site.address.lng}"></iframe></div>
    </div>
    <div class="reveal" id="consult">${leadForm({ id: "contacts-form", title: "Записатися на консультацію", source: "contacts" })}</div>
  </div>
</div></section>`;
}

export function privacyPage() {
  const crumbs = [{ name: "Головна", href: "/" }, { name: "Політика конфіденційності", href: "/privacy/" }];
  return `
${breadcrumbs(crumbs)}
<section class="page-hero"><div class="container"><h1>Політика конфіденційності</h1><p>Як ${esc(site.legalName)} обробляє та захищає ваші персональні дані.</p></div></section>
<section class="section"><div class="container"><div class="prose">
  <p>Ця Політика конфіденційності визначає порядок обробки персональних даних відвідувачів сайту ${site.domain} відповідно до Закону України «Про захист персональних даних» та GDPR.</p>
  <h2>1. Які дані ми збираємо</h2>
  <p>Ім’я, номер телефону, адресу електронної пошти та зміст звернення, які ви добровільно надаєте через форми зворотного зв’язку, а також знеособлені аналітичні дані (cookies, IP, дані про пристрій).</p>
  <h2>2. Мета обробки</h2>
  <ul><li>надання юридичних консультацій та послуг;</li><li>зворотний зв’язок за вашим запитом;</li><li>покращення роботи сайту та сервісу.</li></ul>
  <h2>3. Передача третім особам</h2>
  <p>Ми не передаємо ваші дані третім особам, окрім випадків, передбачених законом. Уся комунікація з клієнтами захищена адвокатською таємницею.</p>
  <h2>4. Зберігання та захист</h2>
  <p>Дані зберігаються протягом строку, необхідного для досягнення мети обробки, та захищені організаційними і технічними заходами.</p>
  <h2>5. Ваші права</h2>
  <p>Ви маєте право на доступ, виправлення та видалення своїх даних. Для реалізації прав напишіть на <a href="mailto:${site.email}">${esc(site.email)}</a>.</p>
</div></div></section>`;
}

export function htmlSitemapPage({ practices, locations = [], team = [], pillars = [], articles = [] }) {
  const crumbs = [{ name: "Головна", href: "/" }, { name: "Карта сайту", href: "/sitemap/" }];
  const li = (href, label) => `<li><a href="${href}">${esc(label)}</a></li>`;

  const main = ["/ Головна", "/practices/ Усі практики", "/about/ Про компанію", "/team/ Команда", "/cases/ Кейси", "/blog/ Блог", "/contacts/ Контакти", "/privacy/ Політика конфіденційності"]
    .map((s) => { const i = s.indexOf(" "); return li(s.slice(0, i), s.slice(i + 1)); }).join("");

  const practiceBlocks = practices.map((p) => {
    const svc = practiceServices(p).map((s) => li(`/practices/${p.slug}/${s.slug}/`, s.title)).join("");
    return `<div class="sitemap-col"><h3><a href="/practices/${p.slug}/">${esc(p.shortTitle)}</a></h3><ul>${svc}</ul></div>`;
  }).join("");

  const locLinks = locations.map((l) => li(`/${l.slug}/`, l.navLabel || l.metaTitle)).join("");
  const teamLinks = team.map((m) => li(`/team/${m.slug}/`, m.name)).join("");

  const blogBlocks = pillars.map((p) => {
    const arts = articles.filter((a) => a.cluster === p.cluster).map((a) => li(`/blog/${a.slug}/`, a.title)).join("");
    return arts ? `<div class="sitemap-col"><h3><a href="/blog/${p.slug}/">${esc(p.title)}</a></h3><ul>${arts}</ul></div>` : "";
  }).join("");

  return `
${breadcrumbs(crumbs)}
<section class="page-hero"><div class="container">
  <span class="eyebrow">Навігація</span>
  <h1>Карта сайту</h1>
  <p>Усі розділи LEGIUS в одному місці — практики, послуги, статті блогу, команда та інформація про компанію.</p>
</div></section>
<section class="section"><div class="container sitemap">
  <div class="sitemap-col"><h2>Основні сторінки</h2><ul>${main}</ul></div>
  ${locLinks ? `<div class="sitemap-col"><h2>Юристи по районах Києва</h2><ul>${locLinks}</ul></div>` : ""}
  <div class="sitemap-col"><h2>Команда</h2><ul>${teamLinks}</ul></div>
  <h2 style="grid-column:1/-1;margin-top:1rem">Практики та послуги</h2>
  ${practiceBlocks}
  <h2 style="grid-column:1/-1;margin-top:1rem">Блог</h2>
  ${blogBlocks}
</div></section>`;
}

export function notFoundPage() {
  return `
<section class="page-hero"><div class="container"><h1>404 — сторінку не знайдено</h1><p>Можливо, сторінку переміщено або видалено. Скористайтеся навігацією нижче.</p></div></section>
<section class="section"><div class="container text-center">
  <div class="hero__actions" style="justify-content:center">
    <a class="btn btn--primary" href="/">На головну</a>
    <a class="btn btn--dark" href="/practices/">Практики</a>
    <a class="btn btn--ghost" href="/contacts/">Контакти</a>
  </div>
</div></section>`;
}
