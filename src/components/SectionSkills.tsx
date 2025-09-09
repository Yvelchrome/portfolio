import * as motion from "motion/react-client";
import { fadeInFromTop } from "lib/animationsVariants";

import { AddUnorderedList, SectionHeader } from "components";

export default function SectionSkills() {
  return (
    <motion.div variants={fadeInFromTop}>
      <SectionHeader number={"02"} intlTitle={"skills"} />
      <div className="font-satoshi flex gap-24 px-8">
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
            listClassName="text-4xl leading-tight"
          />
        }
        {
          <AddUnorderedList
            intlTitle="skills_category_2"
            items={["Git", "Visual Studio Code", "Figma", "Adobe Photoshop"]}
            listClassName="text-4xl leading-tight"
          />
        }
      </div>
    </motion.div>
  );
}
