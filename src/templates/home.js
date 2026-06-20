/* Homepage — Hero, About, Practices, Advantages, Cases, Team, Posts, Testimonials, FAQ, Contacts + form. */
import { site } from "../data/site.js";
import { icons, practiceIcon, leadForm, ctaBand } from "./components.js";
import { renderFaq, escape as esc } from "./render.js";

export function homePage({ practices, cases, team, articles, testimonials, homeFaq }) {
  const bySlug = Object.fromEntries(practices.map((p) => [p.slug, p]));

  /* Punchy, benefit-led one-liners for the homepage practice cards. */
  const pitch = {
    "family-law": "Розлучення рідко буває тихим. Зробимо так, щоб ви вийшли з нього з майном і спокоєм.",
    "criminal-business": "Обшук о 7 ранку — не час шукати адвоката. Краще, щоб номер уже був у вас.",
    "corporate-law": "Поки бізнес росте, його хочуть забрати. Закриваємо лазівки для рейдерів і партнерів.",
    "military-law": "ТЦК, ВЛК, відстрочка, виплати. Там, де інші бачать глухий кут, ми бачимо процедуру.",
    "tax-law": "Заблокували накладні чи нарахували мільйони? Знаємо, де податкова перегинає — і як це зняти.",
    "litigation": "Виграє не той, хто голосніше обіцяє, а той, хто приходить у суд з доказами. Ми приходимо.",
    "real-estate": "Одна непомічена деталь у договорі — і квартира вже не ваша. Помічаємо.",
    "land-law": "Земля любить порядок у документах. Наведемо його — від оренди до спору з владою.",
    "ip-law": "Ваш бренд хтось уже копіює. Зареєструємо марку й змусимо це припинити.",
    "investment": "Вкласти гроші легко. Ми робимо так, щоб їх потім можна було забрати.",
    "it-law": "Код, команда, дані, інвестори. Збираємо це в структуру, яка не розсиплеться на масштабуванні.",
    "m-and-a": "Купівля чи продаж бізнесу — це гра на мільйони, де виграють на деталях. Ведемо вас до закриття.",
    "migration-law": "Дозвіл на працю, посвідка, громадянство. Проведемо крізь міграційну бюрократію — без відмов і зайвих місяців очікування.",
  };

  /* Directions grouped for the filter chips ("Усі практики", "Бізнесу" тощо). */
  const practiceGroups = [
    { id: "business", title: "Бізнесу", slugs: ["corporate-law", "m-and-a", "investment", "it-law", "tax-law"] },
    { id: "defense", title: "Захист і спори", slugs: ["criminal-business", "litigation", "military-law"] },
    { id: "assets", title: "Майно та активи", slugs: ["real-estate", "land-law", "ip-law"] },
    { id: "private", title: "Приватним клієнтам", slugs: ["family-law", "migration-law"] },
  ];

  const practiceCard = (p, groupId) => `<a class="card reveal" data-group="${groupId}" href="/practices/${p.slug}/">
        ${practiceIcon[p.icon] || icons.scale}
        <h3>${esc(p.shortTitle)}</h3>
        <p>${esc(pitch[p.slug] || p.summary)}</p>
        <span class="card__link">Детальніше</span>
      </a>`;

  const practiceFilterBar = `<div class="case-filter" data-practice-filter>
      <button type="button" class="case-filter__btn is-active" data-filter="all">Усі практики</button>
      ${practiceGroups.map((g) => `<button type="button" class="case-filter__btn" data-filter="${g.id}">${esc(g.title)}</button>`).join("")}
    </div>`;
  const practiceCards = practiceGroups
    .flatMap((g) => g.slugs.map((s) => bySlug[s]).filter(Boolean).map((p) => practiceCard(p, g.id)))
    .join("");

  const mosaicTiles = `
    <a class="tile tile--dark tile--tall" href="/about/">
      <div><h3>Партнери ведуть кожну справу особисто</h3><p>Над вашим проєктом працює партнер або старший юрист — без передачі помічникам.</p></div>
      <span class="tile__cta">Про компанію →</span>
    </a>
    <a class="tile tile--red" href="/cases/">
      <div><span class="tile__big">${site.stats.winRate}</span><p>виграних справ — стратегія на основі реальних шансів, а не обіцянок</p></div>
      <span class="tile__cta">Кейси →</span>
    </a>
    <a class="tile tile--light" href="/team/">
      <div><span class="tile__big">${site.stats.lawyers}</span><p>юристів у ${practices.length} практиках — від M&amp;A до військового права</p></div>
      <span class="tile__cta">Команда →</span>
    </a>
    <a class="tile tile--gray" href="/about/">
      <div><span class="tile__big">${site.rating.value}</span><p>середній рейтинг на основі ${site.rating.count} відгуків клієнтів</p></div>
      <span class="tile__cta">Про нас →</span>
    </a>
    <div class="tile tile--quote">
      <div><span class="q">“</span><h3>Ми знаємо, як вирішити вашу справу — і доводимо її до результату.</h3></div>
    </div>
    <a class="tile tile--dark" href="/practices/">
      <div><span class="tile__big">${site.stats.years}</span><p>років практики у складних та кризових справах</p></div>
      <span class="tile__cta">Практики →</span>
    </a>
    <a class="tile tile--red tile--tall" href="/contacts/">
      <div><h3>Регіональне покриття: Київ та вся Україна</h3><p>Зустріч в офісі або онлайн. Гаряча лінія 24/7 для невідкладних ситуацій — обшук, затримання, арешт рахунків.</p></div>
      <span class="tile__cta">Контакти →</span>
    </a>`;

  const featuredCases = cases.slice(0, 12);
  const caseFilters = [...new Map(featuredCases.map((c) => [c.practice, c.practiceLabel])).entries()];
  const caseFilterBar = `<div class="case-filter" data-case-filter>
      <button type="button" class="case-filter__btn is-active" data-filter="all">Усі напрями</button>
      ${caseFilters.map(([slug, label]) => `<button type="button" class="case-filter__btn" data-filter="${esc(slug)}">${esc(label)}</button>`).join("")}
    </div>`;
  const caseCards = featuredCases
    .map(
      (c) => `<a class="case-card reveal" data-practice="${esc(c.practice)}" href="/cases/#${c.slug}">
        <div class="case-card__body">
          <span class="tag">${esc(c.practiceLabel || c.tag)} · ${c.year}</span>
          <h3 style="font-size:1.15rem">${esc(c.title)}</h3>
          <p style="color:var(--c-slate);font-size:.92rem">${esc(c.problem)}</p>
          <div class="case-card__result">${icons.check}<span>${esc(c.metric || c.result)}</span></div>
        </div></a>`
    )
    .join("");

  const teamCards = team
    .map(
      (m) => `<a class="team-card reveal" href="/team/${m.slug}/">
        <div class="team-card__photo"><img src="${m.photo}" width="300" height="400" loading="lazy" decoding="async" alt="${esc(m.displayName || m.name)} — ${esc(m.role)}"></div>
        <h3>${esc(m.displayName || m.name)}</h3><div class="role">${esc(m.role)}</div>
      </a>`
    )
    .join("");

  const postCards = articles
    .slice(0, 3)
    .map(
      (a) => `<a class="post-card reveal" href="/blog/${a.slug}/">
        <div class="post-card__img"></div>
        <div class="post-card__body">
          <span class="post-card__meta">${esc(a.practiceLabel || "Блог")} · ${(a.readMins || 6)} хв</span>
          <h3>${esc(a.title)}</h3>
          <p class="post-card__excerpt">${esc(a.excerpt)}</p>
          <span class="card__link">Читати</span>
        </div></a>`
    )
    .join("");

  const reviewCards = testimonials
    .slice(0, 9)
    .map(
      (t) => `<div class="quote-card reveal">
        <div class="quote-card__stars">★★★★★</div>
        <blockquote>${esc(t.text)}</blockquote>
        <div class="quote-card__author">${esc(t.name)}<span>${esc(t.role)}</span></div>
      </div>`
    )
    .join("");

  return `
<section class="hero">
  <div class="hero__glow"></div>
  <div class="hero__mark" aria-hidden="true">LEGIUS</div>
  <div class="container hero__inner">
    <div class="reveal stack">
      <span class="eyebrow">${esc(site.tagline)} · Київ</span>
      <h1>Правова <span class="accent">перевага</span> для вашого бізнесу</h1>
      <p class="hero__sub">${esc(site.legalName)} — команда адвокатів і юристів, яка веде складні справи у корпоративному, податковому, сімейному та військовому праві. Перша консультація — безкоштовно.</p>
      <div class="hero__actions">
        <a class="btn btn--primary" href="#hero-form">Безкоштовна консультація</a>
        <a class="btn btn--ghost" style="color:#fff" href="/practices/">Наші практики</a>
      </div>
      <div class="hero__trust">
        <div class="stat"><strong>${site.stats.years}</strong><span>років практики</span></div>
        <div class="stat"><strong>${site.stats.cases}</strong><span>виграних справ</span></div>
        <div class="stat"><strong>${site.stats.lawyers}</strong><span>юристів у команді</span></div>
        <div class="stat"><strong>${site.stats.winRate}</strong><span>успішних рішень</span></div>
      </div>
    </div>
    <div class="reveal">${leadForm({ id: "hero-form", title: "Безкоштовна консультація", source: "hero" })}</div>
  </div>
  <a class="hero__scrollcue" href="#about" aria-label="Гортати далі"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 5v14M6 13l6 6 6-6"/></svg></a>
</section>

<section class="section" id="about"><div class="container">
  <div class="split">
    <div class="reveal stack">
      <span class="eyebrow">Про компанію</span>
      <h2>Юридична фірма, якій довіряють найскладніше</h2>
      <p class="about-text">З ${site.founded} року ми супроводжуємо угоди, захищаємо в судах та вирішуємо кризові ситуації для українського й міжнародного бізнесу, власників та родин.</p>
      <p class="about-text">Ми не беремося за все підряд. Наша модель — глибока спеціалізація у ${practices.length} практиках, де кожну справу веде профільний партнер. Це дає прогнозований результат, контрольований бюджет і повну конфіденційність.</p>
      <a class="btn btn--dark" href="/about/">Дізнатися більше про нас</a>
    </div>
    <div class="reveal media-frame"><img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=70" width="640" height="480" loading="lazy" decoding="async" alt="Офіс юридичної компанії LEGIUS у центрі Києва"></div>
  </div>
</div></section>

<section class="section section--soft"><div class="container">
  <div class="section__head section__head--center"><span class="eyebrow">Практики</span><h2>${practices.length} напрямів юридичної експертизи</h2><p class="lead">Оберіть напрям — і ознайомтеся з послугами, процесом роботи та реальними кейсами.</p></div>
  ${practiceFilterBar}
  <div class="grid grid--3" data-practice-grid>${practiceCards}</div>
</div></section>

<section class="section"><div class="container">
  <div class="section__head"><span class="eyebrow">Наші переваги</span><h2>Чому клієнти обирають LEGIUS</h2></div>
  <div class="mosaic reveal">${mosaicTiles}</div>
</div></section>

<section class="section section--soft"><div class="container">
  <div class="section__head section__head--center"><span class="eyebrow">Кейси</span><h2>Результати, які говорять самі за себе</h2><p class="lead">Окремі приклади справ, які ми довели до успішного результату.</p></div>
  ${caseFilterBar}
  <div class="grid grid--3" data-case-grid>${caseCards}</div>
  <div class="text-center mt-3"><a class="btn btn--dark" href="/cases/">Усі кейси</a></div>
</div></section>

<section class="section"><div class="container">
  <div class="section__head section__head--center"><span class="eyebrow">Команда</span><h2>Адвокати та юристи, які будуть вести ваші справи</h2></div>
  <div class="grid grid--3">${teamCards}</div>
  <div class="text-center mt-3"><a class="btn btn--dark" href="/team/">Уся команда</a></div>
</div></section>

<section class="section section--soft"><div class="container">
  <div class="section__head section__head--center"><span class="eyebrow">Блог</span><h2>Останні публікації</h2><p class="lead">Практичні роз’яснення законодавства від наших юристів.</p></div>
  <div class="grid grid--3">${postCards}</div>
  <div class="text-center mt-3"><a class="btn btn--dark" href="/blog/">Усі статті</a></div>
</div></section>

<section class="section"><div class="container">
  <div class="section__head section__head--center"><span class="eyebrow">Відгуки</span><h2>Що кажуть наші клієнти</h2><p class="lead">Рейтинг ${site.rating.value} / 5 на основі ${site.rating.count} відгуків.</p></div>
  <div class="carousel" data-carousel>
    <button class="carousel__nav carousel__nav--prev" type="button" data-carousel-prev aria-label="Попередні відгуки">‹</button>
    <div class="hscroll" data-hscroll>${reviewCards}</div>
    <button class="carousel__nav carousel__nav--next" type="button" data-carousel-next aria-label="Наступні відгуки">›</button>
  </div>
  ${site.reviewsUrl ? `<div class="text-center mt-3"><a class="btn btn--dark" href="${site.reviewsUrl}" target="_blank" rel="noopener">Усі відгуки в Google</a></div>` : ""}
</div></section>

${renderFaq(homeFaq, "Поширені запитання")}

${ctaBand()}`;
}
