import { getTranslations } from "next-intl/server";
import type { Person, WebApplication, WebSite, WithContext } from "schema-dts";

import { getBaseUrl } from "utils/GetBaseUrl";

const BASE_URL = getBaseUrl();

type JsonLdSchemaName =
  | "personJsonLd"
  | "websiteJsonLd"
  | "negatifplusJsonLd"
  | "blockfireJsonLd"
  | "stentorJsonLd"
  | "zefirentJsonLd";

type JsonLdScriptProps = {
  schemas: JsonLdSchemaName[];
};

const webAppSchemasConfig: Record<
  Exclude<JsonLdSchemaName, "personJsonLd" | "websiteJsonLd">,
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
  producer: {
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
  worksFor: {
    "@type": "Organization",
    name: "Freelance",
  },
  alumniOf: [
    {
      "@type": "EducationalOrganization",
      name: "HETIC",
    },
  ],
  url: BASE_URL,
  jobTitle: "Front-End Developer",
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
};

const websiteJsonLd: WithContext<WebSite> = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Steven Godin",
  producer: {
    "@type": "Person",
    name: "Steven Godin",
    url: "https://svgd.vercel.app",
  },
  description:
    "Portfolio of Steven Godin, Front-End Developer specializing in React, TypeScript, Next.js. Designs high-performance, well-crafted web interfaces.",
  inLanguage: "en",
  url: BASE_URL,
};

const staticSchemas = {
  personJsonLd,
  websiteJsonLd,
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

export async function JsonLdScript({ schemas }: JsonLdScriptProps) {
  const schemaDataArray = await Promise.all(schemas.map(getSchemaData));

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
    </>
  );
}
