/* Resolve a real attorney as the author of a blog article (E-E-A-T).
   Each practice is mapped to the partner who actually leads it; the
   managing partner is the default fallback. */
import { team } from "../data/team.js";

const bySlug = Object.fromEntries(team.map((m) => [m.slug, m]));

/* practice slug → team member slug */
const PRACTICE_AUTHOR = {
  "family-law": "maksym-slobodianin",
  "tax-law": "maksym-slobodianin",
  "real-estate": "maksym-slobodianin",
  "land-law": "maksym-slobodianin",
  "litigation": "mykhailo-kobylianskyi",
  "criminal-business": "mykhailo-kobylianskyi",
  "military-law": "mykhailo-kobylianskyi",
  "corporate-law": "oleksandr-hordiienko",
  "m-and-a": "oleksandr-hordiienko",
  "investment": "oleksandr-hordiienko",
  "it-law": "oleksandr-hordiienko",
  "ip-law": "oleksandr-hordiienko",
  "migration-law": "oleksandr-hordiienko",
};

const DEFAULT_AUTHOR = "maksym-slobodianin";

export function articleAuthor(article) {
  const slug = PRACTICE_AUTHOR[article && article.practice] || DEFAULT_AUTHOR;
  return bySlug[slug] || bySlug[DEFAULT_AUTHOR];
}
