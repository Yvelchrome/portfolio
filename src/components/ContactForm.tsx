"use client";

import { useActionState, useEffect, useMemo, useRef } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { type SendEmailState, sendEmail } from "app/actions/send-email";
import { Button } from "components/shadcn/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "components/shadcn/form";
import { Input } from "components/shadcn/input";
import { Textarea } from "components/shadcn/textarea";
import { useMounted } from "hooks/useMounted";
import { type ContactFormData, ContactFormSchema } from "lib/schemas";

const initialState: SendEmailState = {
  success: false,
  error: undefined,
  errors: undefined,
};

export const ContactForm = () => {
  const t = useTranslations("Contact");
  const tT = useTranslations("Toast");
  const isMounted = useMounted();

  const [state, formAction, pending] = useActionState(sendEmail, initialState);
  const prevStateRef = useRef(state);

  const zodSchema = useMemo(() => ContactFormSchema(t), [t]);
  const prevZodSchemaRef = useRef(zodSchema);
  const form = useForm<ContactFormData>({
    resolver: zodResolver(zodSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      honeypot: "",
      name: "",
      company_name: "",
      email: "",
      message: "",
    },
  });

  const {
    trigger,
    formState: { errors },
    reset,
  } = form;

  // Re-validate fields when schema changes (e.g., language switch)
  useEffect(() => {
    const errorFields = Object.keys(errors) as (keyof ContactFormData)[];
    const schemaChanged = prevZodSchemaRef.current !== zodSchema;

    if (schemaChanged && errorFields.length > 0) {
      void trigger(errorFields);
    }

    prevZodSchemaRef.current = zodSchema;
  }, [zodSchema, trigger, errors]);

  const handleSubmit = (formData: FormData) => {
    if (formData.get("honeypot")) {
      reset();
      return;
    }

    formAction(formData);
  };

  useEffect(() => {
    if (prevStateRef.current === state) return;
    prevStateRef.current = state;

    if (!state.success) {
      toast(tT("contact_form_error_title"), {
        description: tT("contact_form_error_description"),
      });

      return;
    }

    toast(tT("contact_form_success_title"), {
      description: tT("contact_form_success_description"),
    });

    reset();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  if (!isMounted) return null;

  return (
    <Form {...form}>
      <form
        action={handleSubmit}
        className="max-w-2xl space-y-6"
        aria-label="Contact form"
        noValidate
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
          render={({ field, fieldState }) => (
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
                  aria-invalid={fieldState.invalid}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field, fieldState }) => (
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
                  aria-invalid={fieldState.invalid}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full cursor-pointer md:w-auto"
          disabled={pending}
          aria-busy={pending}
        >
          {pending ? t("send_pending") : t("send")}
        </Button>
      </form>
    </Form>
  );
};
