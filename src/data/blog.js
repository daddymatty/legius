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
import clusterMigration, { pillar as pillarMigration } from "./blog/cluster-migration-law.js";

const extraClusters = [clusterLitigation, clusterRealEstate, clusterLandLaw, clusterIpLaw, clusterInvestment, clusterItLaw, clusterMandA, clusterCriminal, clusterMigration];
const extraPillars = [pillarLitigation, pillarRealEstate, pillarLandLaw, pillarIpLaw, pillarInvestment, pillarItLaw, pillarMandA, pillarCriminal, pillarMigration].filter(Boolean);

/* Batch 2: more articles deepening the newer practice clusters. */
import clusterLitigation2 from "./blog/cluster-litigation-2.js";
import clusterRealEstate2 from "./blog/cluster-real-estate-2.js";
import clusterLandLaw2 from "./blog/cluster-land-law-2.js";
import clusterIpLaw2 from "./blog/cluster-ip-law-2.js";
import clusterInvestment2 from "./blog/cluster-investment-2.js";
import clusterItLaw2 from "./blog/cluster-it-law-2.js";
import clusterMandA2 from "./blog/cluster-m-and-a-2.js";
import clusterCriminal2 from "./blog/cluster-criminal-business-2.js";
const extraClusters2 = [clusterLitigation2, clusterRealEstate2, clusterLandLaw2, clusterIpLaw2, clusterInvestment2, clusterItLaw2, clusterMandA2, clusterCriminal2];

export const pillars = [...basePillars, ...extraPillars];
export const articles = [
  ...clusterFamily,
  ...clusterMilitary,
  ...clusterCorporate,
  ...clusterTax,
  ...generatedArticles,
  ...extraClusters.flatMap((c) => c || []),
  ...extraClusters2.flatMap((c) => c || []),
];

export const articleBySlug = Object.fromEntries(articles.map((a) => [a.slug, a]));
export const pillarBySlug = Object.fromEntries(pillars.map((p) => [p.slug, p]));
