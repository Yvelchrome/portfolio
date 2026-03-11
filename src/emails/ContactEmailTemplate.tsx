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

import { getBaseUrl } from "utils/GetBaseUrl";

interface EmailProps {
  name?: string | undefined;
  company_name?: string | undefined;
  email: string;
  message: string;
}

const ContactEmailTemplate = ({
  name,
  company_name,
  email,
  message,
}: EmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>New message from portfolio</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-10 max-w-xl rounded border border-solid border-[#eaeaea] p-5">
            <Section className="mt-8">
              <Img
                src={`${getBaseUrl()}/logo.png`}
                alt="Logo"
                title="Logo"
                width="40"
                height="75"
                className="mx-auto my-0 block"
              />
            </Section>
            <Heading className="text-primary-text-light mx-0 my-7.5 p-0 text-center text-[24px] font-normal">
              <strong>Email: {email}</strong>
              {name && (
                <>
                  <br />
                  <strong>Name: {name}</strong>
                </>
              )}
              {company_name && (
                <>
                  <br />
                  <strong>Company name: {company_name}</strong>
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

export default ContactEmailTemplate;
