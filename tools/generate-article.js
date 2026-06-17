/* ============================================================
   LEGIUS — AI-система автоматичного створення SEO-статей.

   Аналізує пошуковий намір, формує структуру, генерує
   Meta Title, Meta Description, H1–H3, FAQ, Alt-тексти,
   внутрішні посилання та повноцінний матеріал 2000–5000 слів,
   після чого зберігає готовий ES-модуль у src/data/blog/generated/.

   Використання:
     ANTHROPIC_API_KEY=... node tools/generate-article.js \
       --topic "Як оскаржити рішення ТЦК" \
       --cluster viyskove-pravo \
       --practice military-law \
       [--words 3000] [--competitors "url1,url2"] [--dry]

   Модель за замовчуванням: claude-opus-4-8 (можна змінити через --model).
   Без ключа працює у режимі --dry (друкує запит/структуру без виклику API).
   ============================================================ */
import { writeFile, mkdir, appendFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const CLUSTER_LABELS = {
  "simeyne-pravo": "Сімейне право",
  "viyskove-pravo": "Військове право",
  "korporatyvne-pravo": "Корпоративне право",
  "podatkove-pravo": "Податкове право",
};

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (!next || next.startsWith("--")) args[key] = true;
      else { args[key] = next; i++; }
    }
  }
  return args;
}

function slugify(s) {
  const map = { а:"a",б:"b",в:"v",г:"h",ґ:"g",д:"d",е:"e",є:"ye",ж:"zh",з:"z",и:"y",і:"i",ї:"yi",й:"y",к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",х:"kh",ц:"ts",ч:"ch",ш:"sh",щ:"shch",ь:"",ю:"yu",я:"ya"," ":"-" };
  return s.toLowerCase().split("").map((c) => (map[c] !== undefined ? map[c] : c)).join("")
    .replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 70);
}

/* ---- The prompt that drives intent analysis + full content ---- */
function buildPrompt({ topic, cluster, practice, words, competitors }) {
  return `Ти — провідний SEO-копірайтер та юрист української юридичної компанії LEGIUS (Київ).
Створи ПОВНІСТЮ ОРИГІНАЛЬНУ, експертну статтю українською мовою на тему: «${topic}».

Контекст для ранжування у Google Україна:
- Тематичний кластер: ${CLUSTER_LABELS[cluster] || cluster} (стовпова сторінка /blog/${cluster}/)
- Профільна практика: /practices/${practice}/
${competitors ? `- Проаналізуй наміри, що стоять за запитами, які покривають конкуренти: ${competitors}\n` : ""}
Вимоги:
1. Спочатку визнач пошуковий намір (informational/commercial/transactional) і цільову аудиторію.
2. Обсяг основного тексту: ${words} слів (±10%). Глибоко, з прикладами, покроково, з посиланнями на чинне законодавство України (без вигаданих номерів справ).
3. Структура: H1, 6–12 секцій H2, де доречно — H3, марковані/нумеровані списки, щонайменше одна таблиця.
4. Додай 6 запитань FAQ з відповідями (2–4 речення).
5. Додай 4–8 внутрішніх посилань: на стовпову /blog/${cluster}/, на практику /practices/${practice}/ та на суміжні статті /blog/{slug}/ (запропонуй релевантні slug).
6. E-E-A-T: демонструй досвід, експертизу, авторитет, довіру. Тон — преміальний, впевнений, корисний.
7. Поверни СУВОРО валідний JSON (без markdown-огорожі) за схемою:
{
  "slug": "латиницею-через-дефіс",
  "title": "...",
  "h1": "...",
  "metaTitle": "50-60 символів",
  "metaDescription": "150-160 символів",
  "excerpt": "~25 слів",
  "readMins": число,
  "keywords": ["...", ...],
  "altTexts": ["alt для зображення 1", "alt для зображення 2"],
  "toc": [{"id":"s1","label":"..."}, ...],
  "sections": [{"id":"s1","h2":"...","html":"<p>...</p><h3>...</h3><ul><li>...</li></ul>..."}, ...],
  "faq": [{"q":"...","a":"..."}, ...],
  "related": ["slug1","slug2","slug3"],
  "expand": "рекомендація щодо подальшого розширення"
}
HTML у полях html має містити лише <p>,<h3>,<ul>,<ol>,<li>,<blockquote>,<table>,<tr>,<th>,<td>,<a href="/...">. Жодних <script>. Усередині використовуй українські лапки «» та апостроф ’.`;
}

async function callClaude({ prompt, model, apiKey, maxTokens }) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic API ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.content.map((c) => c.text || "").join("");
}

function toModule(article) {
  return `/* Автоматично згенеровано AI-системою LEGIUS — ${new Date().toISOString()} */\nexport default ${JSON.stringify(article, null, 2)};\n`;
}

async function main() {
  const args = parseArgs(process.argv);
  const topic = args.topic;
  const cluster = args.cluster || "korporatyvne-pravo";
  const practice = args.practice || "corporate-law";
  const words = Number(args.words || 3000);
  const model = args.model || "claude-opus-4-8";
  const competitors = args.competitors || "";
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const dry = args.dry || !apiKey;

  if (!topic) {
    console.error('Помилка: вкажіть --topic "Тема статті"');
    process.exit(1);
  }

  const prompt = buildPrompt({ topic, cluster, practice, words, competitors });

  if (dry) {
    console.log("=== DRY-RUN (без виклику API) ===");
    console.log(`Тема: ${topic}\nКластер: ${cluster}\nПрактика: ${practice}\nОбсяг: ${words} слів\nМодель: ${model}\n`);
    console.log("Згенерований промпт:\n");
    console.log(prompt);
    if (!apiKey) console.log("\n⚠ ANTHROPIC_API_KEY не задано — реальна генерація пропущена. Задайте ключ, щоб створити статтю.");
    return;
  }

  console.log(`→ Генерація статті «${topic}» (${words} слів, ${model})…`);
  const raw = await callClaude({ prompt, model, apiKey, maxTokens: 16000 });
  let article;
  try {
    const json = raw.replace(/^```json?\s*/i, "").replace(/```\s*$/i, "").trim();
    article = JSON.parse(json);
  } catch (e) {
    console.error("✗ Не вдалося розпарсити JSON-відповідь. Сирий вивід збережено у tools/last-output.txt");
    await writeFile(path.join(__dirname, "last-output.txt"), raw, "utf8");
    process.exit(1);
  }

  article.slug = article.slug || slugify(topic);
  article.cluster = cluster;
  article.practice = practice;
  article.date = new Date().toISOString().slice(0, 10);
  article.modified = article.date;

  const outDir = path.join(ROOT, "src/data/blog/generated");
  await mkdir(outDir, { recursive: true });
  const outFile = path.join(outDir, `${article.slug}.js`);
  await writeFile(outFile, toModule(article), "utf8");

  /* register in a manifest so a wiring step can import it */
  await appendFile(
    path.join(outDir, "_manifest.txt"),
    `${article.slug} | ${cluster} | ${practice} | ${article.date}\n`,
    "utf8"
  );

  console.log(`✓ Збережено: ${path.relative(ROOT, outFile)}`);
  console.log(`  slug: ${article.slug} | секцій: ${article.sections?.length} | FAQ: ${article.faq?.length}`);
  console.log("  Щоб опублікувати — додайте import у src/data/blog/generated/index.js та перезапустіть build.");
}

main().catch((e) => { console.error("✗", e.message); process.exit(1); });
