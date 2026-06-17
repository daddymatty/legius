/* Homepage — Hero, About, Practices, Advantages, Cases, Team, Posts, Testimonials, FAQ, Contacts + form. */
import { site, trustBadges } from "../data/site.js";
import { icons, practiceIcon, leadForm, ctaBand } from "./components.js";
import { renderFaq, escape as esc } from "./render.js";

export function homePage({ practices, cases, team, articles, testimonials, homeFaq }) {
  const practiceCards = practices
    .map(
      (p) => `<a class="card reveal" href="/practices/${p.slug}/">
        ${practiceIcon[p.icon] || icons.scale}
        <h3>${esc(p.shortTitle)}</h3>
        <p>${esc(p.summary)}</p>
        <span class="card__link">Детальніше</span>
      </a>`
    )
    .join("");

  const advantages = [
    { n: "01", h: "Партнери ведуть ваш проєкт особисто", p: "Над кожною справою працює партнер або старший юрист — без передачі помічникам." },
    { n: "02", h: "Прогнозований результат і бюджет", p: "Фіксована вартість або зрозумілі етапи. Ви завжди знаєте, за що платите." },
    { n: "03", h: "Галузева експертиза", p: "Команда з 24 юристів у 12 практиках: від M&A до військового права." },
    { n: "04", h: "Повна конфіденційність", p: "Адвокатська таємниця, NDA та захищений документообіг за замовчуванням." },
    { n: "05", h: `${site.stats.winRate} виграних справ`, p: "Стратегія, заснована на судовій практиці та реальних шансах, а не на обіцянках." },
    { n: "06", h: "Швидка реакція 24/7", p: "Гаряча лінія для невідкладних ситуацій: обшук, затримання, арешт рахунків." },
  ]
    .map(
      (a) => `<div class="feature reveal"><div class="feature__num">${a.n}</div><div><h3>${esc(a.h)}</h3><p>${esc(a.p)}</p></div></div>`
    )
    .join("");

  const caseCards = cases
    .slice(0, 6)
    .map(
      (c) => `<a class="case-card reveal" href="/cases/#${c.slug}">
        <div class="case-card__body">
          <span class="tag">${esc(c.practiceLabel || c.tag)} · ${c.year}</span>
          <h3 style="font-size:1.15rem">${esc(c.title)}</h3>
          <p style="color:var(--c-slate);font-size:.92rem">${esc(c.problem)}</p>
          <div class="case-card__result">${icons.check} ${esc(c.metric || c.result)}</div>
        </div></a>`
    )
    .join("");

  const teamCards = team
    .map(
      (m) => `<a class="team-card reveal" href="/team/${m.slug}/">
        <div class="team-card__photo"><img src="${m.photo}" width="300" height="400" loading="lazy" alt="${esc(m.name)} — ${esc(m.role)}"></div>
        <h3>${esc(m.name)}</h3><div class="role">${esc(m.role)}</div>
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
    .slice(0, 6)
    .map(
      (t) => `<div class="quote-card reveal">
        <div class="quote-card__stars">★★★★★</div>
        <blockquote>${esc(t.text)}</blockquote>
        <div class="quote-card__author">${esc(t.name)}<span>${esc(t.role)}</span></div>
      </div>`
    )
    .join("");

  const trust = trustBadges.map((b) => `<span class="chip">${esc(b)}</span>`).join("");

  return `
<section class="hero">
  <div class="hero__glow"></div>
  <div class="hero__mark" aria-hidden="true">LEGIUS</div>
  <div class="container hero__inner">
    <div class="reveal">
      <span class="eyebrow">${esc(site.tagline)} · Київ</span>
      <h1>Правова <span class="accent">перевага</span> для вашого бізнесу</h1>
      <p class="hero__sub">${esc(site.legalName)} — команда адвокатів і юристів, яка веде складні справи у корпоративному, податковому, сімейному та військовому праві. Перша консультація — безкоштовно.</p>
      <div class="hero__actions">
        <a class="btn btn--primary" href="/contacts/#consult">Безкоштовна консультація</a>
        <a class="btn btn--ghost" style="color:#fff" href="/practices/">Наші практики</a>
      </div>
      <div class="hero__trust">
        <div class="stat"><strong>${site.stats.years}</strong><span>років практики</span></div>
        <div class="stat"><strong>${site.stats.cases}</strong><span>виграних справ</span></div>
        <div class="stat"><strong>${site.stats.lawyers}</strong><span>юристів у команді</span></div>
        <div class="stat"><strong>${site.stats.winRate}</strong><span>успішних рішень</span></div>
      </div>
    </div>
    <div class="reveal">
      ${leadForm({ id: "hero-form", title: "Отримати консультацію", source: "hero", compact: true })}
    </div>
  </div>
  <a class="hero__scrollcue" href="#" aria-label="Гортати далі"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 5v14M6 13l6 6 6-6"/></svg></a>
</section>

<section class="section"><div class="container">
  <div class="split">
    <div class="reveal">
      <span class="eyebrow">Про компанію</span>
      <h2>Юридична фірма, якій довіряють найскладніше</h2>
      <p class="lead">З ${site.founded} року ми супроводжуємо угоди, захищаємо в судах та вирішуємо кризові ситуації для українського й міжнародного бізнесу, власників та родин.</p>
      <p style="color:var(--c-slate)">Ми не беремося за все підряд. Наша модель — глибока спеціалізація у 12 практиках, де кожну справу веде профільний партнер. Це дає прогнозований результат, контрольований бюджет і повну конфіденційність.</p>
      <div class="chips mt-2">${trust}</div>
      <a class="btn btn--dark mt-3" href="/about/">Дізнатися більше про нас</a>
    </div>
    <div class="reveal media-frame"><img src="/assets/img/office.svg" width="640" height="480" loading="lazy" alt="Офіс юридичної компанії LEGIUS у центрі Києва"></div>
  </div>
</div></section>

<section class="section section--soft"><div class="container">
  <div class="section__head section__head--center"><span class="eyebrow">Практики</span><h2>12 напрямів юридичної експертизи</h2><p class="lead">Оберіть напрям — і ознайомтеся з послугами, процесом роботи та реальними кейсами.</p></div>
  <div class="grid grid--3">${practiceCards}</div>
</div></section>

<section class="section"><div class="container">
  <div class="section__head"><span class="eyebrow">Наші переваги</span><h2>Чому клієнти обирають LEGIUS</h2></div>
  <div class="features features--3">${advantages}</div>
</div></section>

<section class="section section--soft"><div class="container">
  <div class="section__head section__head--center"><span class="eyebrow">Кейси</span><h2>Результати, які говорять самі за себе</h2><p class="lead">Окремі приклади справ, які ми довели до успішного результату.</p></div>
  <div class="grid grid--3">${caseCards}</div>
  <div class="text-center mt-3"><a class="btn btn--dark" href="/cases/">Усі кейси</a></div>
</div></section>

<section class="section"><div class="container">
  <div class="section__head section__head--center"><span class="eyebrow">Команда</span><h2>Юристи, які ведуть вашу справу</h2></div>
  <div class="grid grid--4">${teamCards}</div>
  <div class="text-center mt-3"><a class="btn btn--dark" href="/team/">Уся команда</a></div>
</div></section>

<section class="section section--soft"><div class="container">
  <div class="section__head section__head--center"><span class="eyebrow">Блог</span><h2>Останні публікації</h2><p class="lead">Практичні роз’яснення законодавства від наших юристів.</p></div>
  <div class="grid grid--3">${postCards}</div>
  <div class="text-center mt-3"><a class="btn btn--dark" href="/blog/">Усі статті</a></div>
</div></section>

<section class="section"><div class="container">
  <div class="section__head section__head--center"><span class="eyebrow">Відгуки</span><h2>Що кажуть наші клієнти</h2><p class="lead">Рейтинг ${site.rating.value} / 5 на основі ${site.rating.count} відгуків.</p></div>
  <div class="grid grid--3">${reviewCards}</div>
</div></section>

${renderFaq(homeFaq, "Поширені запитання")}

${ctaBand()}

<section class="section" id="consult"><div class="container">
  <div class="split">
    <div class="reveal">
      <span class="eyebrow">Контакти</span>
      <h2>Залиште заявку — ми передзвонимо за 15 хвилин</h2>
      <p class="lead">Опишіть вашу ситуацію, і профільний юрист підготує первинну оцінку та план дій.</p>
      <ul class="contact-info mt-2">
        <li><span class="ico">${icons.pin}</span><div><strong>Офіс у Києві</strong><br>${esc(site.address.street)}</div></li>
        <li><span class="ico">${icons.phone}</span><div><strong>Телефон</strong><br><a href="tel:${site.phoneHref}">${esc(site.phoneDisplay)}</a></div></li>
        <li><span class="ico">${icons.mail}</span><div><strong>E-mail</strong><br><a href="mailto:${site.email}">${esc(site.email)}</a></div></li>
        <li><span class="ico">${icons.clock}</span><div><strong>Графік</strong><br>${esc(site.hours)}</div></li>
      </ul>
    </div>
    <div class="reveal">${leadForm({ id: "home-consult", title: "Безкоштовна консультація", source: "home-bottom" })}</div>
  </div>
</div></section>`;
}
