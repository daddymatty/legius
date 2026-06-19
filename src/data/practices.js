/* Practice areas — aggregated from individual modules for maintainability.
   Each module default-exports an object with this shape:
   {
     slug, icon, navLabel, shortTitle,
     metaTitle, metaDescription, h1, heroSub, summary,
     services: [string],
     sections: [{ h2, html }],         // main SEO body, 1500–2000 words total
     faq: [{ q, a }],                  // 5–7 items
     related: [slug],                  // interlinking
     keywords: [string],
   }
*/
import familyLaw from "./practices/family-law.js";
import militaryLaw from "./practices/military-law.js";
import corporateLaw from "./practices/corporate-law.js";
import taxLaw from "./practices/tax-law.js";
import landLaw from "./practices/land-law.js";
import realEstate from "./practices/real-estate.js";
import litigation from "./practices/litigation.js";
import criminalBusiness from "./practices/criminal-business.js";
import ipLaw from "./practices/ip-law.js";
import investment from "./practices/investment.js";
import itLaw from "./practices/it-law.js";
import mAndA from "./practices/m-and-a.js";
import migrationLaw from "./practices/migration-law.js";

export const practices = [
  familyLaw, criminalBusiness, corporateLaw, militaryLaw, taxLaw, litigation,
  realEstate, landLaw, ipLaw, investment, itLaw, mAndA, migrationLaw,
];

export const practiceBySlug = Object.fromEntries(practices.map((p) => [p.slug, p]));
