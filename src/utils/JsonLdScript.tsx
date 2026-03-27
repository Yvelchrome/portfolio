import { getTranslations } from "next-intl/server";
import type {
  BreadcrumbList,
  ContactPage,
  Person,
  Service,
  WebApplication,
  WebSite,
  WithContext,
} from "schema-dts";

import { getBaseUrl } from "utils/GetBaseUrl";

const BASE_URL = getBaseUrl();
const email = process.env["TARGET_EMAIL"] ?? "";
const phone = process.env["TARGET_PHONE"] ?? "";

type JsonLdSchemaName =
  | "personJsonLd"
  | "websiteJsonLd"
  | "portfolioJsonLd"
  | "serviceJsonLd"
  | "contactPageJsonLd"
  | "negatifplusJsonLd"
  | "blockfireJsonLd"
  | "stentorJsonLd"
  | "zefirentJsonLd";

type BreadcrumbItem = {
  name: string;
  url: string;
};

export type BreadcrumbConfig = {
  items: BreadcrumbItem[];
};

const createBreadcrumbList = (
  config: BreadcrumbConfig,
): WithContext<BreadcrumbList> => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: config.items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

type JsonLdScriptProps = {
  schemas: JsonLdSchemaName[];
  breadcrumb?: BreadcrumbConfig;
};

const webAppSchemasConfig: Record<
  Exclude<
    JsonLdSchemaName,
    | "personJsonLd"
    | "websiteJsonLd"
    | "portfolioJsonLd"
    | "serviceJsonLd"
    | "contactPageJsonLd"
  >,
  {
    namespace: string;
    url: string;
    datePublished: string;
    featureList: string[];
  }
> = {
  negatifplusJsonLd: {
    namespace: "Works.negatifplus",
    url: "https://www.negatifplus.com/",
    datePublished: "2024",
    featureList: ["JavaScript", "SCSS", "GSAP", "PrestaShop", "PHP", "MySQL"],
  },
  zefirentJsonLd: {
    namespace: "Works.zefirent",
    url: "https://zefirent.com",
    datePublished: "2024",
    featureList: ["JavaScript", "SCSS", "Drupal", "PHP", "MySQL"],
  },
  blockfireJsonLd: {
    namespace: "Works.blockfire",
    url: "https://www.blockfire.fr/",
    datePublished: "2023",
    featureList: ["JavaScript", "SCSS", "GSAP", "WordPress", "PHP", "MySQL"],
  },
  stentorJsonLd: {
    namespace: "Works.stentor",
    url: "https://www.groupestentor.fr/",
    datePublished: "2022",
    featureList: ["JavaScript", "SCSS", "GSAP", "WordPress", "PHP", "MySQL"],
  },
};

const createWebAppSchema = (
  t: (key: string) => string,
  config: {
    url: string;
    datePublished: string;
    featureList: string[];
  },
): WithContext<WebApplication> => ({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: t("title"),
  description: t("about_paragraph"),
  url: config.url,
  applicationCategory: "WebApplication",
  operatingSystem: "Web Browser",
  browserRequirements:
    "Requires modern web browser (Chrome, Firefox, Safari, Edge)",
  datePublished: config.datePublished,
  creator: {
    "@type": "Organization",
    name: "Subskill",
    url: "https://www.subskill.com/",
  },
  contributor: {
    "@type": "Person",
    name: "Steven Godin",
    url: BASE_URL,
  },
  about: {
    "@type": "Thing",
    name: t("subtitle"),
  },
  featureList: config.featureList,
});

const personJsonLd: WithContext<Person> = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Steven Godin",
  image: "https://steven-godin-resume.netlify.app/photo.png",
  url: BASE_URL,
  jobTitle: "Front-End Developer",
  worksFor: {
    "@type": "Organization",
    name: "Freelance",
    url: BASE_URL,
  },
  alumniOf: [
    {
      "@type": "EducationalOrganization",
      name: "HETIC",
    },
  ],
  sameAs: [
    "https://github.com/Yvelchrome",
    "https://www.linkedin.com/in/steven-godin/",
    "https://www.youtube.com/@yvelchrome",
  ],
  knowsAbout: [
    "React",
    "TypeScript",
    "Next.js",
    "JavaScript",
    "Frontend Development",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "professional",
    email: email,
    telephone: phone,
    url: BASE_URL,
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": BASE_URL,
  },
  address: {
    "@type": "PostalAddress",
    addressCountry: "FR",
  },
  birthDate: "2003-11-18",
};

const websiteJsonLd: WithContext<WebSite> = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Steven Godin Portfolio",
  url: BASE_URL,
  description:
    "Portfolio of Steven Godin, Front-End Developer specializing in React, TypeScript, Next.js. Designs high-performance, well-crafted web interfaces.",
  inLanguage: "en",
  creator: {
    "@type": "Person",
    name: "Steven Godin",
    url: BASE_URL,
  },
};

const portfolioJsonLd: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Steven Godin Portfolio",
  description:
    "Portfolio of Steven Godin, Front-End Developer specializing in React, TypeScript, Next.js. Designs high-performance, well-crafted web interfaces.",
  url: BASE_URL,
  applicationCategory: "WebApplication",
  operatingSystem: "Web Browser",
  browserRequirements:
    "Requires modern web browser (Chrome, Firefox, Safari, Edge)",
  datePublished: "2025-02-01",
  creator: {
    "@type": "Person",
    name: "Steven Godin",
    url: BASE_URL,
  },
  maintainer: {
    "@type": "Person",
    name: "Steven Godin",
    url: BASE_URL,
  },
  featureList: [
    "React",
    "TypeScript",
    "Next.js",
    "Tailwind CSS",
    "Framer Motion",
    "Zod",
    "Vitest",
    "Zustand",
  ],
  screenshot: {
    "@type": "ImageObject",
    url: `${BASE_URL}/opengraph-image.png`,
  },
};

const serviceJsonLd: WithContext<Service> = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Front-End Development Services",
  description:
    "Professional front-end development services specializing in React, TypeScript, and Next.js.",
  url: BASE_URL,
  serviceType: [
    "Front-End Development",
    "Web Development",
    "UI/UX Implementation",
  ],
  provider: {
    "@type": "Person",
    name: "Steven Godin",
    url: BASE_URL,
  },
  areaServed: "Worldwide",
  sameAs: [
    "https://github.com/Yvelchrome",
    "https://www.linkedin.com/in/steven-godin/",
    "https://www.youtube.com/@yvelchrome",
  ],
};

const contactPageJsonLd: WithContext<ContactPage> = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Steven Godin",
  description:
    "Get in touch for front-end development inquiries and collaborations.",
  url: `${BASE_URL}/contact`,
  mainEntity: {
    "@type": "Person",
    name: "Steven Godin",
    url: BASE_URL,
  },
};

const staticSchemas = {
  personJsonLd,
  websiteJsonLd,
  portfolioJsonLd,
  serviceJsonLd,
  contactPageJsonLd,
};

const getSchemaData = async (schemaName: JsonLdSchemaName) => {
  if (schemaName in staticSchemas) {
    return staticSchemas[schemaName as keyof typeof staticSchemas];
  }

  const config =
    webAppSchemasConfig[schemaName as keyof typeof webAppSchemasConfig];

  const t = await getTranslations(config.namespace);
  return createWebAppSchema(t, config);
};

export async function JsonLdScript({ schemas, breadcrumb }: JsonLdScriptProps) {
  const schemaDataArray = await Promise.all(schemas.map(getSchemaData));

  const breadcrumbSchema = breadcrumb ? createBreadcrumbList(breadcrumb) : null;

  return (
    <>
      {schemaDataArray.map((schemaData, index) => (
        <script
          key={schemas[index]}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaData).replace(/</g, "\\u003c"),
          }}
        />
      ))}
      {breadcrumbSchema && (
        <script
          key="breadcrumb"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c"),
          }}
        />
      )}
    </>
  );
}
