/* Aggregates per-practice service-content overrides keyed by practice slug.
   Each practice merges its base file with an extended (-ext) file so additional
   services can be authored without touching the original content. */
import familyLaw from "./family-law.js";
import criminalBusiness from "./criminal-business.js";
import corporateLaw from "./corporate-law.js";
import militaryLaw from "./military-law.js";
import taxLaw from "./tax-law.js";
import litigation from "./litigation.js";
import realEstate from "./real-estate.js";
import landLaw from "./land-law.js";
import ipLaw from "./ip-law.js";
import investment from "./investment.js";
import itLaw from "./it-law.js";
import mAndA from "./m-and-a.js";

import familyLawExt from "./family-law-ext.js";
import criminalBusinessExt from "./criminal-business-ext.js";
import corporateLawExt from "./corporate-law-ext.js";
import militaryLawExt from "./military-law-ext.js";
import taxLawExt from "./tax-law-ext.js";
import litigationExt from "./litigation-ext.js";
import realEstateExt from "./real-estate-ext.js";
import landLawExt from "./land-law-ext.js";
import ipLawExt from "./ip-law-ext.js";
import investmentExt from "./investment-ext.js";
import itLawExt from "./it-law-ext.js";
import mAndAExt from "./m-and-a-ext.js";

export const serviceOverrides = {
  "family-law": { ...familyLaw, ...familyLawExt },
  "criminal-business": { ...criminalBusiness, ...criminalBusinessExt },
  "corporate-law": { ...corporateLaw, ...corporateLawExt },
  "military-law": { ...militaryLaw, ...militaryLawExt },
  "tax-law": { ...taxLaw, ...taxLawExt },
  "litigation": { ...litigation, ...litigationExt },
  "real-estate": { ...realEstate, ...realEstateExt },
  "land-law": { ...landLaw, ...landLawExt },
  "ip-law": { ...ipLaw, ...ipLawExt },
  "investment": { ...investment, ...investmentExt },
  "it-law": { ...itLaw, ...itLawExt },
  "m-and-a": { ...mAndA, ...mAndAExt },
};
