import { createTranslator } from "next-intl";

import { getUserLocale } from "services/locale";

import enMessages from "../../messages/en.json";

type MessagesJson = typeof enMessages;

async function loadMessages(locale: string): Promise<MessagesJson> {
  if (locale === "en") return enMessages;

  const messages = (await import(`../../messages/${locale}.json`)) as {
    default: MessagesJson;
  };
  return messages.default;
}

export async function getContactTranslator() {
  const locale = await getUserLocale();
  const messagesJson = await loadMessages(locale);

  return createTranslator({
    locale,
    messages: messagesJson.Contact,
  });
}
