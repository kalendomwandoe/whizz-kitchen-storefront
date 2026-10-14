export const SITE = {
  name: "Whizz Kitchen",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
  // Falls back to the WhatsApp number unless a separate call line is set.
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
};

// "254719113757" becomes "+254 719 113 757"
export function formatPhoneDisplay(number: string): string {
  if (!number) return "";
  if (!/^\d{12}$/.test(number)) return `+${number}`;
  return `+${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6, 9)} ${number.slice(9)}`;
}