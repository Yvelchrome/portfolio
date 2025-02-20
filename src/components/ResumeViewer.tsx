import { useLocale, useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "components/shadcn/dialog";

import { CustomButton } from "components";

const ResumeViewer = () => {
  const locale = useLocale();
  const t = useTranslations("Homepage");

  const websiteDomain = "https://steven-godin-resume.netlify.app";
  const resumePath = `${websiteDomain}/steven_godin_${t("resume_file_job_title")}_cv_${locale}.pdf`;

  return (
    <Dialog>
      <DialogTrigger>
        <CustomButton text={t("resume")} arrowRotationDegree={-45} />
      </DialogTrigger>
      <DialogContent className="flex h-5/6 max-w-screen-lg flex-col border-0">
        <DialogHeader>
          <DialogTitle className="font-bold">{t("resume")}</DialogTitle>
        </DialogHeader>
        <iframe className="h-full w-auto" src={resumePath} />
      </DialogContent>
    </Dialog>
  );
};

export default ResumeViewer;
