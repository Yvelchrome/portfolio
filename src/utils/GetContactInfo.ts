export const getContactInfo = () => ({
  email: process.env["TARGET_EMAIL"] || undefined,
  phone: process.env["TARGET_PHONE"] || undefined,
});
