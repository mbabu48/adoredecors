// Pricing engine. All values in Indian Rupees (₹).
// These are starting rates — Jesuraj's team can tune them from a single file.

export type EventType =
  | "wedding"
  | "birthday"
  | "baby_shower"
  | "corporate"
  | "anniversary"
  | "retirement"
  | "other";

export type VenueSize = "small" | "medium" | "large" | "outdoor";

export type AddOnKey =
  | "floral"
  | "balloon"
  | "drapes"
  | "fairy_lights"
  | "backdrop"
  | "centerpieces"
  | "stage"
  | "entrance_arch";

export const EVENT_TYPES: { key: EventType; label: string; base: number }[] = [
  { key: "wedding", label: "Wedding", base: 80000 },
  { key: "birthday", label: "Birthday", base: 30000 },
  { key: "baby_shower", label: "Baby Shower", base: 30000 },
  { key: "corporate", label: "Corporate", base: 60000 },
  { key: "anniversary", label: "Anniversary", base: 35000 },
  { key: "retirement", label: "Retirement", base: 30000 },
  { key: "other", label: "Other", base: 25000 },
];

export const VENUE_SIZES: { key: VenueSize; label: string; multiplier: number }[] = [
  { key: "small", label: "Small (home / room, up to 50)", multiplier: 1.0 },
  { key: "medium", label: "Medium (banquet hall, 50–150)", multiplier: 1.3 },
  { key: "large", label: "Large (ballroom, 150+)", multiplier: 1.7 },
  { key: "outdoor", label: "Outdoor / open venue", multiplier: 1.5 },
];

export const ADD_ONS: { key: AddOnKey; label: string; price: number; hint?: string }[] = [
  { key: "floral", label: "Floral arrangements", price: 15000, hint: "Roses, orchids, marigolds" },
  { key: "balloon", label: "Balloon arches & columns", price: 8000 },
  { key: "drapes", label: "Fabric drapes & ceiling swags", price: 12000 },
  { key: "fairy_lights", label: "Fairy lights & fixtures", price: 10000 },
  { key: "backdrop", label: "Custom backdrop (name / theme)", price: 18000 },
  { key: "centerpieces", label: "Table centerpieces", price: 6000, hint: "Per set of 10 tables" },
  { key: "stage", label: "Stage decor", price: 22000 },
  { key: "entrance_arch", label: "Entrance arch", price: 9000 },
];

export type EstimateInput = {
  eventType: EventType;
  venueSize: VenueSize;
  guestCount: number;
  addOns: AddOnKey[];
};

export type EstimateBreakdown = {
  base: number;
  venueMultiplier: number;
  venueAdjusted: number;
  guestExtra: number;
  addOnTotal: number;
  total: number;
  addOnDetail: { key: AddOnKey; label: string; price: number }[];
};

const GUEST_THRESHOLD = 50;
const PER_GUEST_OVER = 150; // ₹150 per guest beyond 50

export function estimatePrice(input: EstimateInput): EstimateBreakdown {
  const event = EVENT_TYPES.find((e) => e.key === input.eventType) ?? EVENT_TYPES[0];
  const venue = VENUE_SIZES.find((v) => v.key === input.venueSize) ?? VENUE_SIZES[0];
  const venueAdjusted = Math.round(event.base * venue.multiplier);
  const guestExtra = Math.max(0, input.guestCount - GUEST_THRESHOLD) * PER_GUEST_OVER;
  const addOnDetail = ADD_ONS.filter((a) => input.addOns.includes(a.key)).map((a) => ({
    key: a.key,
    label: a.label,
    price: a.price,
  }));
  const addOnTotal = addOnDetail.reduce((sum, a) => sum + a.price, 0);
  const total = venueAdjusted + guestExtra + addOnTotal;
  return {
    base: event.base,
    venueMultiplier: venue.multiplier,
    venueAdjusted,
    guestExtra,
    addOnTotal,
    total,
    addOnDetail,
  };
}

export function formatINR(n: number): string {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

export function eventTypeLabel(key: string): string {
  const match = EVENT_TYPES.find((e) => e.key === key);
  if (match) return match.label;
  // fallback: title-case any snake/unknown value
  return key
    .split("_")
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");
}
