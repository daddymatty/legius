/* Blog content hub — Pillar Pages + Topic Clusters (E-E-A-T).
   Aggregates pillar pages and cluster articles from modules.

   Pillar shape:
   { slug, pillar:true, cluster (=slug), practice, title, h1, metaTitle,
     metaDescription, excerpt, date, modified, intro(html),
     sections:[{id,h2,html}], faq:[{q,a}], keywords:[], hub:[articleSlug...] }

   Article shape:
   { slug, cluster (pillar slug), practice, title, h1, metaTitle,
     metaDescription, excerpt, date, modified, readMins,
     toc:[{id,label}], sections:[{id,h2,html}], faq:[{q,a}],
     related:[slug], keywords:[], expand:"recommendation text" }
*/
import { pillars } from "./blog/pillars.js";
import clusterFamily from "./blog/cluster-family.js";
import clusterMilitary from "./blog/cluster-military.js";
import clusterCorporate from "./blog/cluster-corporate.js";
import clusterTax from "./blog/cluster-tax.js";
import { generatedArticles } from "./blog/generated/index.js";

export { pillars };
export const articles = [
  ...clusterFamily,
  ...clusterMilitary,
  ...clusterCorporate,
  ...clusterTax,
  ...generatedArticles,
];

export const articleBySlug = Object.fromEntries(articles.map((a) => [a.slug, a]));
export const pillarBySlug = Object.fromEntries(pillars.map((p) => [p.slug, p]));
