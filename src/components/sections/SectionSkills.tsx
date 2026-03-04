import * as motion from "motion/react-client";
import { fadeInFromBottom } from "lib/animationsVariants";

import { AddUnorderedList, SectionHeader } from "components";

export const SectionSkills = () => {
  return (
    <motion.section
      variants={fadeInFromBottom}
      className="bg-background relative pb-12"
    >
      <SectionHeader number={"03"} intlTitle={"skills"} />
      <div className="flex flex-col gap-x-22 gap-y-6 px-4 sm:flex-row sm:px-8">
        {
          <AddUnorderedList
            intlTitle="skills_category_1"
            items={[
              "React",
              "Next.js",
              "TypeScript",
              "TailwindCSS",
              "SCSS",
              "Framer Motion",
            ]}
            listClassName="text-fluid-4xl"
          />
        }
        {
          <AddUnorderedList
            intlTitle="skills_category_2"
            items={["Zod", "Vitest", "Testing Library"]}
            listClassName="text-fluid-4xl"
          />
        }
        {
          <AddUnorderedList
            intlTitle="skills_category_3"
            items={["Git", "Figma"]}
            listClassName="text-fluid-4xl"
          />
        }
      </div>
    </motion.section>
  );
};
