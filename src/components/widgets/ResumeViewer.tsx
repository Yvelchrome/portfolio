"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "components/shadcn/dialog";
import { CustomButton } from "components";

import { LenisControl } from "utils";
import { useLocale, useTranslations } from "next-intl";

export const ResumeViewer = () => {
  const locale = useLocale();
  const t = useTranslations("Homepage");

  const websiteDomain = "https://steven-godin-resume.netlify.app";
  const resumePath = `${websiteDomain}/steven_godin_${t("resume_file_job_title")}_cv_${locale}.pdf`;

  return (
    <Dialog
      onOpenChange={(val) => {
        if (val) LenisControl.stop();
        else LenisControl.start();
      }}
    >
      <DialogTrigger>
        <CustomButton
          text={t("resume")}
          arrowRotationDegree={-45}
          yAnimate={true}
        />
      </DialogTrigger>
      <DialogContent className="flex h-5/6 flex-col border-0 sm:max-w-(--breakpoint-lg)">
        <DialogHeader>
          <DialogTitle className="font-bold">{t("resume")}</DialogTitle>
          <DialogDescription className="sr-only">
            Find my resume here : <a href={resumePath}>View Resume</a>
          </DialogDescription>
        </DialogHeader>
        <iframe className="h-full w-auto" src={resumePath} />
      </DialogContent>
    </Dialog>
  );
};
