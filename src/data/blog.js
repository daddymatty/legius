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
import { pillars as basePillars } from "./blog/pillars.js";
import clusterFamily from "./blog/cluster-family.js";
import clusterMilitary from "./blog/cluster-military.js";
import clusterCorporate from "./blog/cluster-corporate.js";
import clusterTax from "./blog/cluster-tax.js";
import { generatedArticles } from "./blog/generated/index.js";

/* New practice clusters: each module default-exports its articles[] and
   named-exports `pillar` (or null until written). */
import clusterLitigation, { pillar as pillarLitigation } from "./blog/cluster-litigation.js";
import clusterRealEstate, { pillar as pillarRealEstate } from "./blog/cluster-real-estate.js";
import clusterLandLaw, { pillar as pillarLandLaw } from "./blog/cluster-land-law.js";
import clusterIpLaw, { pillar as pillarIpLaw } from "./blog/cluster-ip-law.js";
import clusterInvestment, { pillar as pillarInvestment } from "./blog/cluster-investment.js";
import clusterItLaw, { pillar as pillarItLaw } from "./blog/cluster-it-law.js";
import clusterMandA, { pillar as pillarMandA } from "./blog/cluster-m-and-a.js";
import clusterCriminal, { pillar as pillarCriminal } from "./blog/cluster-criminal-business.js";

const extraClusters = [clusterLitigation, clusterRealEstate, clusterLandLaw, clusterIpLaw, clusterInvestment, clusterItLaw, clusterMandA, clusterCriminal];
const extraPillars = [pillarLitigation, pillarRealEstate, pillarLandLaw, pillarIpLaw, pillarInvestment, pillarItLaw, pillarMandA, pillarCriminal].filter(Boolean);

export const pillars = [...basePillars, ...extraPillars];
export const articles = [
  ...clusterFamily,
  ...clusterMilitary,
  ...clusterCorporate,
  ...clusterTax,
  ...generatedArticles,
  ...extraClusters.flatMap((c) => c || []),
];

export const articleBySlug = Object.fromEntries(articles.map((a) => [a.slug, a]));
export const pillarBySlug = Object.fromEntries(pillars.map((p) => [p.slug, p]));
