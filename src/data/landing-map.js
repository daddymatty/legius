/* Відповідність статей блогу комерційним посадковим сторінкам.
   Перше збіжне правило виграє; перевіряється slug статті.
   Мета — дати 269 статтям контекстні посилання на сторінки послуг:
   читач статті має бачити шлях до адвоката, а посадкові —
   отримувати внутрішню вагу з блогу. */
export const landingMap = {
  "military-law": [
    { re: /vlk|msek|nepridatnist|obmezheno-prydatnyy/, href: "/advokat-vlk-kyiv/", label: "Оскарження висновку ВЛК", ask: "Не згодні з висновком комісії?" },
    { re: /szch|dezertyrstvo/, href: "/advokat-szch-kyiv/", label: "Захист у справах про СЗЧ", ask: "Потрібен захист у справі про СЗЧ?" },
    { re: /vidstrochka/, href: "/advokat-vidstrochka-kyiv/", label: "Оформлення відстрочки", ask: "Потрібно оформити відстрочку?" },
    { re: /bronyuvannya|oblik-na-pidpryyemstvi/, href: "/advokat-bronyuvannya-kyiv/", label: "Бронювання працівників", ask: "Бронюєте працівників на підприємстві?" },
    { re: /zvilnennya-z-viyskovoyi|demobilizatsiya/, href: "/advokat-zvilnennya-z-sluzhby-kyiv/", label: "Звільнення з військової служби", ask: "Оформлюєте звільнення зі служби?" },
    { re: /tck|povistky|rozshuk|shtrafy|oblik|rezerv|peretyn/, href: "/advokat-tck-kyiv/", label: "Спори з ТЦК", ask: "Виник спір із ТЦК?" },
    { re: /./, href: "/viyskovyy-advokat-kyiv/", label: "Військовий адвокат у Києві", ask: "Потрібна допомога військового адвоката?" },
  ],
  "family-law": [
    { re: /spadk|zapovit|obovyazkova-chastka|cherhy/, href: "/advokat-po-spadshchyni-kyiv/", label: "Адвокат по спадщині", ask: "Оформлюєте спадщину або є спір?" },
    { re: /aliment/, href: "/advokat-po-alimentakh-kyiv/", label: "Адвокат по аліментах", ask: "Потрібно стягнути аліменти?" },
    { re: /podil-mayna|podil-biznesu|podil-ipotech|pozovnoyi-davnosti/, href: "/advokat-podil-mayna-kyiv/", label: "Поділ майна подружжя", ask: "Ділите майно після розлучення?" },
    { re: /dytyn|batkivsk|vykhovann|opika|usynovlennya|batkivstva|haazka|prizvyshcha/, href: "/advokat-spory-pro-ditey-kyiv/", label: "Спори про дітей", ask: "Виник спір щодо дитини?" },
    { re: /rozluchen|rozirvannya|shlyub|nasylstvo|mediats|rozdilne/, href: "/advokat-po-rozluchennyu-kyiv/", label: "Адвокат по розлученню", ask: "Плануєте розірвання шлюбу?" },
    { re: /./, href: "/simeynyy-advokat-kyiv/", label: "Сімейний адвокат у Києві", ask: "Потрібна допомога сімейного адвоката?" },
  ],
  "corporate-law": [
    { re: /fop|bukhhalter/, href: "/obsluhovuvannya-fop-kyiv/", label: "Обслуговування ФОП", ask: "Потрібен супровід ФОП?" },
    { re: /likvidatsiya|bankrutstvo/, href: "/yuryst-likvidatsiya-tov-kyiv/", label: "Ліквідація ТОВ", ask: "Плануєте закриття компанії?" },
    { re: /spory|reyderstv|dyrektor|uchasnyk|chastky/, href: "/advokat-korporatyvni-spory-kyiv/", label: "Корпоративні спори", ask: "Конфлікт учасників або загроза захоплення?" },
    { re: /reyestratsiya|statut|gromadsk|asotsiats|spilka|nepributkovyy|nerezydent|kapital|zbory|mistseznakhodzhennya|benefitsiar/, href: "/reyestratsiya-biznesu-kyiv/", label: "Реєстрація бізнесу", ask: "Реєструєте компанію чи вносите зміни?" },
    { re: /./, href: "/yuryst-dlya-biznesu-kyiv/", label: "Юрист для бізнесу", ask: "Потрібен юрист для компанії?" },
  ],
  "tax-law": [
    { re: /./, href: "/podatkovyy-advokat-kyiv/", label: "Податковий адвокат", ask: "Перевірка, донарахування або блокування накладних?" },
  ],
};

/* Повертає посадкову, найрелевантнішу статті, або null. */
export function landingFor(article) {
  const rules = landingMap[article.practice];
  if (!rules) return null;
  const slug = article.slug || "";
  return rules.find((r) => r.re.test(slug)) || null;
}
