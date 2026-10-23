export const SITE = {
   name: "Whizz Kitchen",
  // The brand's own words, taken from the footer, home call-to-action and about page.
  tagline: "Bring the flavour.",
  description: "Fresh, made-to-order snacks and recipes. Bring the flavour.",
  // Public address of the storefront. Set NEXT_PUBLIC_SITE_URL in .env.local and in production.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  
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