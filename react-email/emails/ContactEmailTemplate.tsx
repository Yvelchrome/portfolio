import * as React from "react";

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface EmailProps {
  name?: string | undefined;
  company_name?: string | undefined;
  email: string;
  message: string;
}

export const ContactEmailTemplate = ({
  name,
  company_name,
  email,
  message,
}: EmailProps) => {
  const vercelUrl = process.env["VERCEL_URL"];
  const baseUrl = vercelUrl ? `https://${vercelUrl}` : "";

  return (
    <Html>
      <Head />
      <Preview>New message from portfolio</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-10 max-w-xl rounded border border-solid border-[#eaeaea] p-5">
            <Section className="mt-8">
              <Img
                src={`${baseUrl}/static/logo.svg`}
                width="40"
                height="75"
                className="mx-auto my-0"
              />
            </Section>
            <Heading className="text-primary-text-light mx-0 my-[30px] p-0 text-center text-[24px] font-normal">
              <strong>Email: {email}</strong>
              {name && (
                <>
                  <br />
                  <strong>Name: {name ?? "Anonymous"}</strong>
                </>
              )}
              {company_name && (
                <>
                  <br />
                  <strong>Company name: {company_name ?? "Anonymous"}</strong>
                </>
              )}
            </Heading>
            <Text className="text-primary-text-light text-base leading-6">
              {message}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

ContactEmailTemplate.PreviewProps = {
  name: "John Doe",
  company_name: "Organization",
  email: "your@email.com",
  message: "This is a test message.",
} as EmailProps;

export default ContactEmailTemplate;
