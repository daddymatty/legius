/* Per-service pages: derive a slug + structured content for each practice service. */
import { serviceOverrides } from "../data/services/index.js";

const MAP = { а:"a",б:"b",в:"v",г:"h",ґ:"g",д:"d",е:"e",є:"ye",ж:"zh",з:"z",и:"y",і:"i",ї:"yi",й:"y",к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",х:"kh",ц:"ts",ч:"ch",ш:"sh",щ:"shch",ь:"",ю:"yu",я:"ya"," ":"-","'":"","’":"" };

export function serviceSlug(title) {
  return title.toLowerCase().split("").map((c) => (MAP[c] !== undefined ? MAP[c] : c)).join("")
    .replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
}

/** Returns service objects for a practice: { title, slug, summary } */
export function practiceServices(p) {
  return (p.services || []).map((title) => ({
    title,
    slug: serviceSlug(title),
    summary: `Повний супровід напряму «${title}» у межах практики «${p.shortTitle}». Профільний адвокат, прозора вартість, конфіденційність.`,
  }));
}

/** Structured content for one service page. Uses a unique override when present,
 *  otherwise falls back to the structured template below. */
export function serviceContent(p, svc) {
  const t = svc.title;
  const override = (serviceOverrides[p.slug] || {})[svc.slug];
  const template = {
    heroSub: `«${t}» — напрям практики «${p.shortTitle}» у LEGIUS. Супроводжуємо під ключ: від аналізу ситуації до результату.`,
    sections: [
      {
        h2: `Послуга «${t}»`,
        html: `<p>${t} — один із ключових напрямів практики «${p.shortTitle}» у юридичній компанії LEGIUS. Ми супроводжуємо клієнтів у Києві та по всій Україні на всіх етапах: від першої консультації й аналізу документів до досягнення конкретного результату.</p>
<p>Кожну справу веде профільний адвокат, який спеціалізується саме на цьому напрямі. Ще до старту ми оцінюємо перспективи, узгоджуємо стратегію, етапи роботи та прозору вартість, тож ви завжди розумієте, за що платите і чого очікувати.</p>`,
      },
      {
        h2: "Що входить у послугу",
        html: `<ul>
<li>детальний аналіз вашої ситуації та наявних документів;</li>
<li>оцінка ризиків і реалістичних сценаріїв вирішення;</li>
<li>розробка правової стратегії під вашу мету;</li>
<li>підготовка заяв, договорів, звернень та процесуальних документів;</li>
<li>представництво інтересів у переговорах, державних органах та суді;</li>
<li>супровід до отримання кінцевого результату.</li>
</ul>`,
      },
      {
        h2: "Як ми працюємо",
        html: `<ol>
<li><strong>Консультація.</strong> Аналізуємо ситуацію та відповідаємо на ваші запитання.</li>
<li><strong>Стратегія.</strong> Формуємо план дій і узгоджуємо вартість та строки.</li>
<li><strong>Документи.</strong> Готуємо всі необхідні документи й докази.</li>
<li><strong>Дії та представництво.</strong> Діємо у переговорах, органах і суді.</li>
<li><strong>Результат.</strong> Доводимо справу до завершення та звітуємо на кожному етапі.</li>
</ol>`,
      },
      {
        h2: "Чому це доручають LEGIUS",
        html: `<ul>
<li>профільний адвокат, що веде саме такі справи;</li>
<li>прозора вартість і зрозумілі етапи без прихованих платежів;</li>
<li>повна конфіденційність та адвокатська таємниця;</li>
<li>досвід у складних, нетипових і конфліктних ситуаціях.</li>
</ul>
<p>Детальніше про напрям читайте на сторінці практики <a href="/practices/${p.slug}/">«${p.shortTitle}»</a> або одразу <a href="#consult">залиште заявку</a> — відповімо протягом 15 хвилин.</p>`,
      },
    ],
    faq: [
      { q: `Скільки коштує послуга «${t}»?`, a: "Вартість залежить від складності справи та обсягу роботи. Після безкоштовної первинної консультації ми надаємо прозорий розрахунок і узгоджуємо етапи оплати." },
      { q: "Скільки часу займає вирішення питання?", a: "Строки залежать від конкретної ситуації та завантаженості органів. На консультації ми озвучуємо реалістичні строки саме для вашого випадку." },
      { q: "Чи можна отримати послугу дистанційно?", a: "Так. Ми працюємо в офісі в центрі Києва та онлайн — повний супровід можливий по всій Україні." },
    ],
  };

  if (!override) return template;
  return {
    heroSub: override.heroSub || template.heroSub,
    sections: override.sections && override.sections.length ? override.sections : template.sections,
    faq: override.faq && override.faq.length ? override.faq : template.faq,
  };
}
