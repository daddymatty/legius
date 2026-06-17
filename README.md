# LEGIUS — корпоративний сайт юридичної компанії преміум-класу

Повністю готовий до запуску статичний сайт юридичної фірми (Київ), орієнтований на ТОП-10 Google за юридичними запитами. Реалізовано на **чистому HTML5, CSS3 та JavaScript** — без конструкторів та CMS. HTML генерується власним статичним генератором із структурованого контенту (data-driven), результат — звичайні статичні файли у `dist/`.

## ✨ Ключові характеристики

- **Mobile First**, повна адаптивність: 320 / 375 / 768 / 1024 / 1440 px.
- **Core Web Vitals / PageSpeed 95+**: критичний CSS один файл, JS із `defer`, inline-SVG (нуль зайвих запитів), `loading="lazy"`, без зовнішніх шрифтів і важких бібліотек.
- **Преміальний дизайн**: графіт/темно-синій + стриманий золотий акцент, багато білого простору, серифні заголовки.
- **Повне технічне SEO**: semantic HTML, Open Graph, Twitter Cards, JSON-LD (Organization, WebSite, LegalService, Service, Article, FAQPage, BreadcrumbList, Person, Attorney/LocalBusiness), canonical, XML Sitemap, robots.txt, ЧПУ-структура URL, ієрархія заголовків, наскрізна перелінковка.
- **Конверсія**: форми захоплення лідів на кожній сторінці, sticky-CTA для мобільних, плаваючі кнопки Telegram/WhatsApp/Viber, кнопка дзвінка.

## 📁 Структура проєкту

```
legius/
├── build.js                  # генератор: дані + шаблони → dist/
├── package.json
├── src/
│   ├── assets/               # css, js, (зображення генеруються при збірці)
│   ├── data/                 # увесь контент як ES-модулі
│   │   ├── site.js           # глобальна конфігурація, контакти, навігація
│   │   ├── practices.js      # агрегатор 12 практик
│   │   ├── practices/*.js    # 12 практик (по 1500–2000 слів)
│   │   ├── team.js           # профілі команди (5 ролей)
│   │   ├── cases.js          # 20+ кейсів
│   │   ├── locations.js      # 9 локальних посадкових сторінок
│   │   ├── testimonials.js   # відгуки
│   │   ├── faq.js            # FAQ головної
│   │   ├── blog.js           # агрегатор блогу
│   │   └── blog/             # 4 стовпові + ~100 кластерних статей
│   ├── lib/seo.js            # генератори JSON-LD Schema.org
│   └── templates/            # HTML-шаблони (функції, що повертають рядок)
├── tools/
│   ├── generate-article.js   # AI-генерація нових SEO-статей (Claude API)
│   ├── placeholders.js       # SVG-заглушки (лого, аватари, OG, офіс)
│   └── serve.js              # локальний сервер для перегляду / Lighthouse
├── seo/
│   ├── semantic-core.csv     # семантичне ядро (1000+ запитів)
│   ├── content-plan-12m.md   # контент-план на 12 місяців
│   ├── interlinking-map.md   # карта перелінковки
│   └── seo-strategy.md       # стратегія виходу в ТОП-10 за 6–12 міс.
└── dist/                     # згенерований сайт (для деплою)
```

## 🚀 Швидкий старт

```bash
npm run build      # згенерувати сайт у dist/
npm run serve      # підняти локальний сервер на http://localhost:8080
npm run dev        # build + serve
```

Жодних залежностей встановлювати не потрібно — потрібен лише **Node.js ≥ 18**.

## 🤖 AI-система створення статей

`tools/generate-article.js` аналізує пошуковий намір і конкурентів, формує структуру, генерує Meta Title/Description, H1–H3, FAQ, alt-тексти, внутрішні посилання та повноцінний матеріал на 2000–5000 слів за допомогою Claude API.

```bash
# Сухий прогон (без ключа) — покаже промпт і структуру:
node tools/generate-article.js --topic "Як оскаржити рішення ТЦК" --cluster viyskove-pravo --practice military-law --dry

# Реальна генерація:
ANTHROPIC_API_KEY=sk-... node tools/generate-article.js \
  --topic "Поділ бізнесу при розлученні" \
  --cluster simeyne-pravo --practice family-law --words 3000
```

Готова стаття зберігається у `src/data/blog/generated/<slug>.js`. Щоб опублікувати — імпортуйте її у блог-агрегатор і перезапустіть `npm run build`.

## 🔌 Підключення форм до CRM/бекенду

Форми працюють на фронтенді (захоплення у `localStorage` + `dataLayer` для GTM). Точка інтеграції — у `src/assets/js/main.js` (коментар `Hook point`): додайте `fetch('/api/lead', …)` або виклик вашого CRM.

## 🌐 Деплой

`dist/` — статика, яку можна розмістити будь-де: Nginx, Cloudflare Pages, Netlify, GitHub Pages, S3+CloudFront. Перед продакшеном замініть домен/контакти у `src/data/site.js`, додайте реальні фото команди замість SVG-заглушок та підключіть аналітику.

## 📈 SEO-просування

Дивіться теку `seo/`: семантичне ядро, контент-план на рік, карта перелінковки та покрокова стратегія досягнення ТОП-10 Google за 6–12 місяців.
