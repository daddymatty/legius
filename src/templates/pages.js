/* About, Contacts, Privacy, 404. */
import { site } from "../data/site.js";
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
    [String(site.founded), "Заснування компанії у Києві та запуск корпоративної і кримінальної практик"],
    ["2012", "Відкриття практики податкового права"],
    ["2016", "Запуск цивільної практики"],
    ["2025", `${site.stats.cases} проведених справ`],
  ]
    .map(([y, t]) => `<div class="feature reveal"><div class="feature__num">${y}</div><div><p style="color:var(--c-ink);font-weight:600">${esc(t)}</p></div></div>`)
    .join("");

  return `
${breadcrumbs(crumbs)}
<section class="page-hero"><div class="container">
  <span class="eyebrow">Про компанію</span>
  <h1>${esc(site.legalName)}</h1>
  <p>Юридична компанія в Києві. ${site.stats.years} років захищаємо інтереси бізнесу, інвесторів та приватних клієнтів у найскладніших справах.</p>
</div></section>

<section class="section"><div class="container">
  <div class="split">
    <div class="reveal stack">
      <span class="eyebrow">Хто ми</span>
      <h2>Юридичний партнер, а не просто підрядник</h2>
      <p class="lead">LEGIUS — це команда з ${site.stats.lawyers} адвокатів і юристів, об’єднаних навколо ${practices.length} практик. Ми супроводжуємо клієнтів на всіх етапах: від превентивного консалтингу до представництва у Верховному Суді.</p>
      <p style="color:var(--c-slate)">Наша філософія проста: глибока спеціалізація замість універсальності. Ми беремося лише за справи, у яких бачимо реальну стратегію, і доводимо їх до результату.</p>
    </div>
    <div class="reveal media-frame"><img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=70" srcset="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=480&q=70 480w, https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=70 800w, https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=70 1200w" sizes="(max-width: 700px) 92vw, 600px" width="640" height="480" loading="lazy" decoding="async" alt="Офіс LEGIUS"></div>
  </div>
</div></section>

<section class="section section--navy"><div class="container">
  <div class="grid grid--4">
    <div><div class="feature__num" style="font-size:2.4rem">${site.stats.years}</div><p>років практики</p></div>
    <div><div class="feature__num" style="font-size:2.4rem">${site.stats.cases}</div><p>проведених справ</p></div>
    <div><div class="feature__num" style="font-size:2.4rem">${site.stats.lawyers}</div><p>юристів</p></div>
    <div><div class="feature__num" style="font-size:2.4rem">${site.rating.value}</div><p>рейтинг у Google</p></div>
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
  <div class="prose reveal" style="max-width:var(--w-prose, 72ch)">
    <h2>Як влаштована робота над справою</h2>
    <p>Ми не починаємо з договору. Спершу — розмова, у якій треба зрозуміти, що саме сталося, які документи вже є, і чи взагалі потрібен адвокат. Частина звернень закривається однією консультацією: людині достатньо пояснити порядок дій, і далі вона справляється сама. Ми про це кажемо прямо й не беремо гроші за роботу, якої не буде.</p>
    <p>Якщо справа наша, далі йде оцінка перспективи. Це не оптимістичний прогноз, а розбір: які докази є, яких бракує, що каже судова практика Верховного Суду в подібних правовідносинах, скільки часу займе кожна стадія і де ризик програти. Клієнт має ухвалювати рішення, знаючи і сильні, і слабкі місця своєї позиції.</p>
    <p>Тільки після цього узгоджуємо стратегію, обсяг робіт і вартість. Ми розбиваємо роботу на етапи з окремою ціною кожного — так видно, за що саме йде оплата, і клієнт може зупинитися між етапами, якщо обставини змінилися.</p>
    <h2>Спеціалізація замість універсальності</h2>
    <p>У компанії ${practices.length} практик, і кожну веде профільний фахівець. Це принципова позиція: адвокат, який сьогодні розлучає подружжя, завтра оскаржує податкове повідомлення-рішення, а післязавтра захищає в кримінальному провадженні, не може глибоко знати жодну з цих сфер.</p>
    <p>Тому справу веде той, хто веде саме такі справи регулярно. Якщо питання лежить на межі кількох напрямів — а так буває часто, наприклад коли поділ майна зачіпає корпоративні права в ТОВ, — до роботи підключається другий фахівець, і клієнт не бігає між консультантами.</p>
    <h2>Скільки це коштує</h2>
    <p>Первинна консультація безкоштовна. Далі можливі три моделі, і ми обираємо ту, що чесніша для конкретної ситуації.</p>
    <ul>
      <li><b>Фіксована вартість за етап</b> — коли обсяг роботи зрозумілий наперед: підготовка позову, супровід угоди, реєстраційна дія.</li>
      <li><b>Абонентське обслуговування</b> — для бізнесу з постійним потоком питань: договори, кадри, перевірки, поточні консультації.</li>
      <li><b>Погодинна оплата</b> — для нетипових справ, де обсяг заздалегідь не визначити.</li>
    </ul>
    <p>Чого ми не робимо — так це не називаємо суму до того, як подивилися документи. Ціна, озвучена по телефону наосліп, або завищена про запас, або занижена, щоб клієнт прийшов, а потім зростає.</p>
    <h2>Конфіденційність — не декларація</h2>
    <p>Усе, що клієнт розповідає адвокату, є адвокатською таємницею за Законом України «Про адвокатуру та адвокатську діяльність». Це не ввічлива формула, а режим із юридичними наслідками: адвоката не можна допитати про обставини, які стали йому відомі у зв'язку з наданням правової допомоги, а вилучення таких документів має окремий, суворіший порядок.</p>
    <p>Практично це означає, що з нами можна говорити про справжній стан речей, а не про його зручну версію. Адвокат, який не знає слабких місць справи, дізнається про них у судовому засіданні — від опонента.</p>
    <h2>Коли ми відмовляємо</h2>
    <p>Ми не беремося за справу, якщо не бачимо в ній правової стратегії. Іноді клієнт має рацію по суті, але пропущені строки, знищені докази або усна домовленість без жодного письмового сліду роблять судову перспективу примарною. У такому разі чесніше сказати це на консультації, ніж узяти гонорар і півтора року імітувати процес.</p>
    <p>Так само ми не беремо справи, де від нас очікують результату всупереч закону. Це не питання обережності — за такі дії адвокат втрачає свідоцтво, і жоден гонорар цього не вартий.</p>
  </div>
</div></section>

${site.showTeam ? `<section class="section"><div class="container">
  <div class="section__head section__head--center"><span class="eyebrow">Команда</span><h2>Люди, які створюють LEGIUS</h2></div>
  <div class="grid grid--3">${team
    .map((m) => `<a class="team-card reveal" href="/team/${m.slug}/"><div class="team-card__photo"><img src="${m.photo}" width="300" height="400" loading="lazy" decoding="async" alt="${esc(m.displayName || m.name)}"></div><h3>${esc(m.displayName || m.name)}</h3><div class="role">${esc(m.role)}</div></a>`)
    .join("")}</div>
</div></section>` : ""}

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
        <li><span class="ico">${icons.phone}</span><div><strong>Телефон</strong><br><a href="tel:${site.phoneHref}">${esc(site.phoneDisplay)}</a></div></li>
        <li><span class="ico">${icons.mail}</span><div><strong>E-mail</strong><br><a href="mailto:${site.email}">${esc(site.email)}</a></div></li>
        <li><span class="ico">${icons.clock}</span><div><strong>Графік роботи</strong><br>${esc(site.hours)}</div></li>
      </ul>
      <div class="chips mt-2">
        <a class="chip" href="${site.messengers.telegram}" target="_blank" rel="noopener">Telegram</a>
        <a class="chip" href="${site.messengers.whatsapp}" target="_blank" rel="noopener">WhatsApp</a>
        <a class="chip" href="${site.messengers.viber}" target="_blank" rel="noopener">Viber</a>
      </div>
      <div class="map-frame mt-3"><iframe title="Мапа офісу LEGIUS (Google Maps)" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen src="https://www.google.com/maps?q=${encodeURIComponent(`LEGIUS, ${site.address.street}, ${site.address.locality}`)}&hl=uk&z=16&output=embed"></iframe></div>
    </div>
    <div class="reveal" id="consult">${leadForm({ id: "contacts-form", title: "Записатися на консультацію", source: "contacts" })}</div>
  </div>
</div></section>

<section class="section section--soft"><div class="container">
  <div class="prose reveal" style="max-width:var(--w-prose, 72ch)">
    <h2>Як нас знайти</h2>
    <p>Офіс розташований на лівому березі Києва, у бізнес-центрі «Новий» на вулиці Євгена Сверстюка, 11-А — за кілька хвилин пішки від станції метро «Лівобережна». На вході до бізнес-центру працює пропускна система: назвіть охороні, що ви до ${esc(site.legalName)}, офіс 1203.</p>
    <p>Поруч є паркування, але в робочі години місць буває мало — якщо їдете автомобілем, закладіть кілька зайвих хвилин.</p>
    <h2>Формати консультації</h2>
    <p><b>В офісі.</b> Оптимально, коли є оригінали документів або справа складна й потребує детального розбору. Зустріч триває, як правило, від сорока хвилин до години.</p>
    <p><b>Онлайн.</b> Відеозв'язок або телефон — для клієнтів з інших міст і для випадків, коли документи можна надіслати заздалегідь. За форматом і глибиною розбору онлайн-консультація не відрізняється від очної; ми ведемо справи по всій Україні.</p>
    <p><b>Месенджери.</b> Telegram, WhatsApp і Viber — для коротких питань і для того, щоб надіслати документи перед зустріччю. Для розбору справи цей формат не підходить: письмово неможливо поставити ті уточнювальні питання, від яких залежить відповідь.</p>
    <h2>Що взяти на консультацію</h2>
    <p>Чим більше документів ви покажете на першій зустрічі, тим точнішою буде оцінка. Корисно взяти:</p>
    <ul>
      <li>усе листування зі стороною конфлікту чи з органом — навіть те, що здається неважливим;</li>
      <li>договори, акти, рахунки, розписки — оригінали або чіткі копії;</li>
      <li>отримані рішення, ухвали, повідомлення, вимоги — з конвертами, якщо вони збереглися: дата на штемпелі часто вирішує питання строків;</li>
      <li>виписки з реєстрів, якщо йдеться про нерухомість, землю чи корпоративні права.</li>
    </ul>
    <p>Якщо документів немає або вони недоступні — приходьте так. Частину ми зможемо витребувати самі, у тому числі через адвокатський запит.</p>
    <h2>Скільки чекати відповіді</h2>
    <p>На заявки з сайту й повідомлення в месенджери відповідаємо протягом п'ятнадцяти хвилин у робочий час: ${esc(site.hours)}. Звернення, що надійшли ввечері або у вихідні, опрацьовуємо на початку наступного робочого дня.</p>
    <p>Якщо ситуація термінова — обшук, затримання, спливає процесуальний строк — телефонуйте. Такі звернення ми беремо в роботу поза чергою.</p>
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

  const main = ["/ Головна", "/practices/ Усі практики", "/about/ Про компанію", ...(site.showTeam ? ["/team/ Команда"] : []), "/cases/ Кейси", "/blog/ Блог", "/contacts/ Контакти", "/privacy/ Політика конфіденційності"]
    .map((s) => { const i = s.indexOf(" "); return li(s.slice(0, i), s.slice(i + 1)); }).join("");

  const practiceBlocks = practices.map((p) => {
    const svc = practiceServices(p).map((s) => li(`/practices/${p.slug}/${s.slug}/`, s.title)).join("");
    return `<div class="sitemap-col"><h3><a href="/practices/${p.slug}/">${esc(p.shortTitle)}</a></h3><ul>${svc}</ul></div>`;
  }).join("");

  const locLinks = locations.map((l) => li(`/${l.slug}/`, l.navLabel || l.metaTitle)).join("");
  const teamLinks = site.showTeam ? team.map((m) => li(`/team/${m.slug}/`, m.displayName || m.name)).join("") : "";

  const blogBlocks = pillars.map((p) => {
    const arts = articles.filter((a) => a.cluster === p.cluster).map((a) => li(`/blog/${a.slug}/`, a.title)).join("");
    return arts ? `<div class="sitemap-col"><h3><a href="/blog/${p.slug}/">${esc(p.title)}</a></h3><ul>${arts}</ul></div>` : "";
  }).join("");

  return `
${breadcrumbs(crumbs)}
<section class="page-hero"><div class="container">
  <span class="eyebrow">Навігація</span>
  <h1>Карта сайту</h1>
  <p>Усі розділи LEGIUS в одному місці — практики, послуги, статті блогу та інформація про компанію.</p>
</div></section>
<section class="section"><div class="container sitemap">
  <div class="sitemap-col"><h2>Основні сторінки</h2><ul>${main}</ul></div>
  ${locLinks ? `<div class="sitemap-col"><h2>Юристи по районах Києва</h2><ul>${locLinks}</ul></div>` : ""}
  ${teamLinks ? `<div class="sitemap-col"><h2>Команда</h2><ul>${teamLinks}</ul></div>` : ""}
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
