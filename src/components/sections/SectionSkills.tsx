import * as motion from "motion/react-client";
import { fadeInFromBottom } from "lib/animationsVariants";

import { AddUnorderedList, SectionHeader } from "components";

export default function SectionSkills() {
  return (
    <motion.section
      variants={fadeInFromBottom}
      className="bg-background relative pb-12"
    >
      <SectionHeader number={"03"} intlTitle={"skills"} />
      <div className="flex flex-wrap gap-x-24 gap-y-6 px-4 sm:gap-y-12 sm:px-8">
        {
          <AddUnorderedList
            intlTitle="skills_category_1"
            items={[
              "SCSS",
              "TailwindCSS",
              "TypeScript",
              "Next.js",
              "React",
              "React Native",
              "PhP",
              "SQL",
            ]}
            listClassName="text-fluid-4xl "
          />
        }
        {
          <AddUnorderedList
            intlTitle="skills_category_2"
            items={["Git", "Visual Studio Code", "Figma", "Adobe Photoshop"]}
            listClassName="text-fluid-4xl"
          />
        }
      </div>
    </motion.section>
  );
}
