import { describe, it, expect } from "vitest";
import {
  estimatePrice,
  EVENT_TYPES,
  VENUE_SIZES,
  ADD_ONS,
  formatUSD,
  eventTypeLabel,
} from "@/lib/pricing";
import type { EventType, VenueSize, AddOnKey } from "@/lib/pricing";

describe("estimatePrice — base price per event type", () => {
  for (const { key, base } of EVENT_TYPES) {
    it(`${key} base is ${base}`, () => {
      const result = estimatePrice({ eventType: key as EventType, venueSize: "small", guestCount: 0, addOns: [] });
      expect(result.base).toBe(base);
    });
  }
});

describe("estimatePrice — guest count scaling", () => {
  it("no extra cost for 0 guests", () => {
    const r = estimatePrice({ eventType: "wedding", venueSize: "small", guestCount: 0, addOns: [] });
    expect(r.guestExtra).toBe(0);
  });

  it("no extra cost for exactly 50 guests (threshold)", () => {
    const r = estimatePrice({ eventType: "wedding", venueSize: "small", guestCount: 50, addOns: [] });
    expect(r.guestExtra).toBe(0);
  });

  it("charges $5 per guest beyond 50", () => {
    const r = estimatePrice({ eventType: "wedding", venueSize: "small", guestCount: 100, addOns: [] });
    expect(r.guestExtra).toBe(50 * 5);
  });

  it("max guests (10000) charges correctly", () => {
    const r = estimatePrice({ eventType: "wedding", venueSize: "small", guestCount: 10000, addOns: [] });
    expect(r.guestExtra).toBe((10000 - 50) * 5);
  });
});

describe("estimatePrice — venue size multiplier", () => {
  for (const { key, multiplier } of VENUE_SIZES) {
    it(`${key} multiplier is ${multiplier}`, () => {
      const r = estimatePrice({ eventType: "birthday", venueSize: key as VenueSize, guestCount: 0, addOns: [] });
      const expected = Math.round(800 * multiplier);
      expect(r.venueAdjusted).toBe(expected);
      expect(r.venueMultiplier).toBe(multiplier);
    });
  }
});

describe("estimatePrice — add-ons", () => {
  it("no add-ons gives 0 add-on total", () => {
    const r = estimatePrice({ eventType: "wedding", venueSize: "small", guestCount: 0, addOns: [] });
    expect(r.addOnTotal).toBe(0);
    expect(r.addOnDetail).toHaveLength(0);
  });

  it("single add-on sums correctly", () => {
    const floral = ADD_ONS.find((a) => a.key === "floral")!;
    const r = estimatePrice({ eventType: "wedding", venueSize: "small", guestCount: 0, addOns: ["floral"] });
    expect(r.addOnTotal).toBe(floral.price);
    expect(r.addOnDetail).toHaveLength(1);
    expect(r.addOnDetail[0].key).toBe("floral");
  });

  it("multiple add-ons sum correctly", () => {
    const keys: AddOnKey[] = ["floral", "balloon", "stage"];
    const expected = ADD_ONS.filter((a) => keys.includes(a.key as AddOnKey)).reduce(
      (s, a) => s + a.price,
      0,
    );
    const r = estimatePrice({ eventType: "wedding", venueSize: "small", guestCount: 0, addOns: keys });
    expect(r.addOnTotal).toBe(expected);
  });

  it("all add-ons sum correctly", () => {
    const allKeys = ADD_ONS.map((a) => a.key as AddOnKey);
    const expectedTotal = ADD_ONS.reduce((s, a) => s + a.price, 0);
    const r = estimatePrice({ eventType: "wedding", venueSize: "small", guestCount: 0, addOns: allKeys });
    expect(r.addOnTotal).toBe(expectedTotal);
  });
});

describe("estimatePrice — total", () => {
  it("total = venueAdjusted + guestExtra + addOnTotal", () => {
    const r = estimatePrice({ eventType: "wedding", venueSize: "large", guestCount: 200, addOns: ["floral", "stage"] });
    expect(r.total).toBe(r.venueAdjusted + r.guestExtra + r.addOnTotal);
  });
});

describe("estimatePrice — unknown event type falls back", () => {
  it("unknown event type uses first event type as fallback", () => {
    const r = estimatePrice({ eventType: "unknown_type" as EventType, venueSize: "small", guestCount: 0, addOns: [] });
    expect(r.base).toBe(EVENT_TYPES[0].base);
  });
});

describe("formatUSD", () => {
  it("formats 0 correctly", () => {
    expect(formatUSD(0)).toBe("$0");
  });

  it("formats a large number", () => {
    expect(formatUSD(80000)).toContain("$");
  });
});

describe("eventTypeLabel", () => {
  it("returns label for known event type", () => {
    expect(eventTypeLabel("wedding")).toBe("Wedding");
  });

  it("title-cases unknown types", () => {
    expect(eventTypeLabel("custom_event")).toBe("Custom Event");
  });
});
