import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("services/locale");

describe("tContact", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  const messages = {
    en: { Contact: { name: "Name", company_name: "Company" } },
    fr: { Contact: { name: "Nom", company_name: "Entreprise" } },
  };

  Object.entries(messages).forEach(([locale, expectedMessages]) => {
    it(`loads ${locale} messages correctly`, async () => {
      const { getUserLocale } = await import("services/locale");
      vi.mocked(getUserLocale).mockResolvedValueOnce(locale);

      const { getContactTranslator } = await import("utils/GetMessagesJson");
      const tContact = await getContactTranslator();

      expect(getUserLocale).toHaveBeenCalled();

      expect(tContact("name")).toBe(expectedMessages.Contact.name);
      expect(tContact("company_name")).toBe(
        expectedMessages.Contact.company_name,
      );
    });
  });
});
