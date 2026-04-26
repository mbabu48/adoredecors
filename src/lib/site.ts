export const site = {
  name: "Jesuraj Event Decors",
  tagline: "Crafting unforgettable moments",
  description:
    "Bespoke event decoration for weddings, birthdays, baby showers, corporate events, and every milestone in between.",
  phone: process.env.NEXT_PUBLIC_BUSINESS_PHONE || "+1 (555) 000-0000",
  email: process.env.NEXT_PUBLIC_BUSINESS_EMAIL || "hello@jesurajdecors.com",
  address: process.env.NEXT_PUBLIC_BUSINESS_ADDRESS || "Los Angeles, CA",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "15550000000",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com",
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://facebook.com",
};

export function whatsappLink(message?: string): string {
  const msg = encodeURIComponent(message || "Hi! I'd like to know more about your decoration services.");
  return `https://wa.me/${site.whatsapp}?text=${msg}`;
}
