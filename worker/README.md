# LEGIUS — підключення форми до Telegram (Cloudflare Worker)

Цей Worker приймає заявки з форм сайту й пересилає їх у Telegram.
Токен бота зберігається як **секрет** на боці Cloudflare і **ніколи не потрапляє в код сайту**.

## Крок 1. Бот і chat_id
1. У Telegram відкрий **@BotFather** → `/newbot` (або `/revoke` для нового токена існуючого бота). Скопіюй **токен**.
2. Додай бота у групу юристів (або напиши йому особисто) і надішли будь-яке повідомлення.
3. Дізнайся **chat_id**: відкрий у браузері
   `https://api.telegram.org/bot<ТВІЙ_ТОКЕН>/getUpdates`
   і знайди `"chat":{"id": ... }`. Для групи id зазвичай від'ємний (напр. `-100123...`).

## Крок 2. Створити Worker (через сайт Cloudflare — без термінала)
1. Зареєструйся на https://dash.cloudflare.com (безкоштовно) → **Workers & Pages** → **Create** → **Create Worker**.
2. Назви, напр., `legius-lead`. Натисни **Deploy**, потім **Edit code**.
3. Видали шаблон і встав вміст файлу [`lead-telegram.js`](./lead-telegram.js). **Save and deploy**.
4. **Settings → Variables and Secrets → Add**:
   - `BOT_TOKEN` (тип **Secret**) = токен бота
   - `CHAT_ID` (тип **Secret** або Text) = твій chat_id
   - *(необовʼязково)* `ALLOWED_ORIGINS` = `https://legius.com.ua,https://www.legius.com.ua`
5. Скопіюй URL воркера (вигляду `https://legius-lead.<твій-субдомен>.workers.dev`).

## Крок 3. Підключити до сайту
Надішли мені цей URL — я впишу його у `src/data/site.js` (`leadEndpoint`), пересоберу й запушу.
Після цього всі форми сайту відправлятимуть заявки у Telegram за кілька секунд.

## Перевірка
Після підключення заповни форму на сайті — у чат має миттєво прийти повідомлення
«🟢 Нова заявка — LEGIUS». Якщо ні — перевір секрети `BOT_TOKEN`/`CHAT_ID`
та що бот доданий у потрібний чат.

## Альтернатива через термінал (wrangler)
```bash
npm i -g wrangler
wrangler login
wrangler deploy worker/lead-telegram.js --name legius-lead
wrangler secret put BOT_TOKEN   # вставити токен
wrangler secret put CHAT_ID     # вставити chat_id
```
