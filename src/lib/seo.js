/* Structured-data (JSON-LD) builders — Schema.org. */
import { site } from "../data/site.js";

const abs = (p) => (p && p.startsWith("http") ? p : site.domain + (p || "/"));

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "@id": site.domain + "/#organization",
    name: site.legalName,
    alternateName: site.name,
    url: site.domain + "/",
    logo: abs("/assets/img/logo.svg"),
    image: abs("/assets/img/og-default.svg"),
    description:
      "Юридична компанія преміум-класу в Києві: корпоративне, сімейне, військове, податкове право, M&A, IT Law, судові спори та кримінальний захист бізнесу.",
    telephone: site.phoneDisplay,
    email: site.email,
    priceRange: "$$$",
    foundingDate: String(site.founded),
    areaServed: ["Київ", "Київська область", "Україна"],
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postal,
      addressCountry: site.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: site.address.lat, longitude: site.address.lng },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "19:00",
    },
    sameAs: Object.values(site.social),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: site.rating.value,
      reviewCount: site.rating.count,
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": site.domain + "/#website",
    url: site.domain + "/",
    name: site.name,
    inLanguage: "uk-UA",
    publisher: { "@id": site.domain + "/#organization" },
    potentialAction: {
      "@type": "SearchAction",
      target: site.domain + "/blog/?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: abs(it.href),
    })),
  };
}

export function faqSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function serviceSchema(practice) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: practice.h1,
    provider: { "@id": site.domain + "/#organization" },
    areaServed: { "@type": "City", name: "Київ" },
    name: practice.h1,
    description: practice.metaDescription,
    url: abs("/practices/" + practice.slug + "/"),
  };
}

export function articleSchema(article) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.h1 || article.title,
    description: article.metaDescription,
    inLanguage: "uk-UA",
    datePublished: article.date,
    dateModified: article.modified || article.date,
    author: { "@type": "Organization", name: site.legalName, "@id": site.domain + "/#organization" },
    publisher: { "@id": site.domain + "/#organization" },
    mainEntityOfPage: abs("/blog/" + article.slug + "/"),
    image: abs("/assets/img/og-default.svg"),
  };
}

export function personSchema(member) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: member.name,
    jobTitle: member.role,
    worksFor: { "@id": site.domain + "/#organization" },
    image: abs(member.photo),
    url: abs("/team/" + member.slug + "/"),
    knowsAbout: member.specialization,
    alumniOf: member.education?.map((e) => e.org),
  };
}

export function localBusinessSchema(loc) {
  return {
    "@context": "https://schema.org",
    "@type": "Attorney",
    name: site.name + " — " + loc.h1,
    description: loc.metaDescription,
    url: abs("/" + loc.slug + "/"),
    telephone: site.phoneDisplay,
    priceRange: "$$$",
    areaServed: loc.areaServed || "Київ",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postal,
      addressCountry: site.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: site.address.lat, longitude: site.address.lng },
    parentOrganization: { "@id": site.domain + "/#organization" },
  };
}
