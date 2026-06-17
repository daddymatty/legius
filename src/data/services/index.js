/* Aggregates per-practice service-content overrides keyed by practice slug. */
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

export const serviceOverrides = {
  "family-law": familyLaw,
  "criminal-business": criminalBusiness,
  "corporate-law": corporateLaw,
  "military-law": militaryLaw,
  "tax-law": taxLaw,
  "litigation": litigation,
  "real-estate": realEstate,
  "land-law": landLaw,
  "ip-law": ipLaw,
  "investment": investment,
  "it-law": itLaw,
  "m-and-a": mAndA,
};
