"use client";

import { useMounted } from "lib/hooks/useMounted";
import { useCsrfToken } from "lib/hooks/useCsrfToken";

import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  ContactFormSchema,
  type ContactFormData,
  parseJsonWithZod,
  ApiResponseSchema,
  type ApiResponse,
} from "lib/schemas";

import { toast } from "sonner";
import { Button } from "components/shadcn/button";
import { Input } from "components/shadcn/input";
import { Textarea } from "components/shadcn/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "components/shadcn/form";

export const ContactForm = () => {
  const t = useTranslations("Contact");
  const tT = useTranslations("Toast");
  const isMounted = useMounted();
  const { csrfToken } = useCsrfToken();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: {
      honeypot: "",
      name: "",
      company_name: "",
      email: "",
      message: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(data: ContactFormData) {
    if (data.honeypot) {
      form.reset();
      return;
    }

    try {
      const response = await fetch("api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken ?? "",
        },
        body: JSON.stringify(data),
      });

      let result: ApiResponse;
      try {
        result = await parseJsonWithZod(response, ApiResponseSchema);
      } catch (parseError) {
        console.error("Failed to parse API response:", parseError);
        throw new Error("Invalid response from server");
      }

      if (result.error) {
        throw new Error(result.error);
      }

      toast(tT("contact_form_success_title"), {
        description: tT("contact_form_success_description"),
      });

      form.reset();
    } catch (error) {
      toast(tT("contact_form_error_title"), {
        description: tT("contact_form_error_description"),
      });

      console.error("Form submission error:", error);
    }
  }

  if (!isMounted) return null;

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void form.handleSubmit(onSubmit)();
        }}
        className="max-w-2xl space-y-6"
        aria-label="Contact form"
      >
        {/* Honeypot Field - Hidden from users */}
        <div className="sr-only" aria-hidden="true">
          <FormField
            control={form.control}
            name="honeypot"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("honeypot")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("name")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={t("form_field_name")}
                    autoComplete="name"
                    maxLength={100}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="company_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("company_name")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={t("form_field_company_name")}
                    autoComplete="organization"
                    maxLength={100}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("email")} <span className="text-red-600">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder={t("form_field_email")}
                  required
                  autoComplete="email"
                  maxLength={254}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("message")} <span className="text-red-600">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder={t("form_field_message")}
                  className="max-h-120 min-h-30"
                  required
                  maxLength={5000}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full cursor-pointer md:w-auto"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? t("send_pending") : t("send")}
        </Button>
      </form>
    </Form>
  );
};
