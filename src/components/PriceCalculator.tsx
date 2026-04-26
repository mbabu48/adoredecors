"use client";
import { useMemo, useState } from "react";
import { Check, Sparkles } from "lucide-react";
import {
  ADD_ONS,
  AddOnKey,
  EVENT_TYPES,
  EventType,
  VENUE_SIZES,
  VenueSize,
  estimatePrice,
  formatUSD,
} from "@/lib/pricing";

export default function PriceCalculator() {
  const [eventType, setEventType] = useState<EventType>("baby_shower");
  const [venueSize, setVenueSize] = useState<VenueSize>("medium");
  const [guestCount, setGuestCount] = useState(80);
  const [addOns, setAddOns] = useState<AddOnKey[]>(["floral", "balloon", "fairy_lights"]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const quote = useMemo(
    () => estimatePrice({ eventType, venueSize, guestCount, addOns }),
    [eventType, venueSize, guestCount, addOns],
  );

  function toggleAddOn(key: AddOnKey) {
    setAddOns((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          eventType,
          guestCount,
          venueSize,
          message: `Estimate request. Add-ons: ${addOns.join(", ") || "none"}.`,
          estimatedCost: quote.total,
          source: "pricing",
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Could not submit");
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid lg:grid-cols-[1fr_340px] gap-8">
      {/* Form */}
      <div className="space-y-6">
        <div>
          <label className="block text-[11px] text-burgundy tracking-[0.14em] uppercase mb-2">
            Event type
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {EVENT_TYPES.map((e) => (
              <button
                key={e.key}
                onClick={() => setEventType(e.key)}
                className={`py-2.5 px-3 text-[13px] rounded-sm border transition-colors ${
                  eventType === e.key
                    ? "bg-burgundy text-cream border-burgundy"
                    : "bg-cream text-burgundy border-sand hover:border-rose"
                }`}
              >
                {e.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[11px] text-burgundy tracking-[0.14em] uppercase mb-2">
            Venue size
          </label>
          <select
            value={venueSize}
            onChange={(e) => setVenueSize(e.target.value as VenueSize)}
            className="w-full py-2.5 px-3 bg-cream border border-sand rounded-sm text-[14px] text-burgundy"
          >
            {VENUE_SIZES.map((v) => (
              <option key={v.key} value={v.key}>
                {v.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-[11px] text-burgundy tracking-[0.14em] uppercase">Guest count</label>
            <span className="text-rose text-[13px] font-medium">{guestCount}</span>
          </div>
          <input
            type="range"
            min={20}
            max={500}
            step={10}
            value={guestCount}
            onChange={(e) => setGuestCount(Number(e.target.value))}
            className="w-full accent-rose"
          />
          <div className="flex justify-between text-[10px] text-stone mt-1">
            <span>20</span><span>100</span><span>250</span><span>500</span>
          </div>
        </div>

        <div>
          <label className="block text-[11px] text-burgundy tracking-[0.14em] uppercase mb-2">
            Decor elements
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {ADD_ONS.map((a) => {
              const on = addOns.includes(a.key);
              return (
                <button
                  key={a.key}
                  onClick={() => toggleAddOn(a.key)}
                  className={`flex items-center justify-between p-3 text-[13px] rounded-sm border transition-colors text-left ${
                    on
                      ? "bg-blush/30 border-rose text-burgundy"
                      : "bg-cream border-sand text-burgundy hover:border-rose"
                  }`}
                >
                  <span className="flex flex-col">
                    <span className="flex items-center gap-2">
                      <span
                        className={`w-4 h-4 rounded-sm border flex items-center justify-center ${
                          on ? "bg-burgundy border-burgundy" : "border-rose"
                        }`}
                      >
                        {on && <Check size={11} className="text-cream" />}
                      </span>
                      {a.label}
                    </span>
                    {a.hint && <span className="text-[11px] text-stone pl-6">{a.hint}</span>}
                  </span>
                  <span className="text-stone text-[11px]">{formatUSD(a.price)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quote panel */}
      <aside className="bg-cream border border-sand rounded-md p-6 h-fit sticky top-20">
        <div className="text-[10px] text-rose tracking-[0.22em]">LIVE ESTIMATE</div>
        <div className="font-serif text-4xl text-burgundy mt-2 mb-5">{formatUSD(quote.total)}</div>

        <div className="space-y-2 text-[13px]">
          <div className="flex justify-between pb-2 border-b border-dashed border-sand">
            <span className="text-stone">Base ({EVENT_TYPES.find((e) => e.key === eventType)?.label})</span>
            <span className="text-burgundy">{formatUSD(quote.base)}</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-dashed border-sand">
            <span className="text-stone">Venue adjustment ×{quote.venueMultiplier}</span>
            <span className="text-burgundy">{formatUSD(quote.venueAdjusted - quote.base)}</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-dashed border-sand">
            <span className="text-stone">Guest scaling (&gt;50)</span>
            <span className="text-burgundy">{formatUSD(quote.guestExtra)}</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-dashed border-sand">
            <span className="text-stone">Add-ons ({quote.addOnDetail.length})</span>
            <span className="text-burgundy">{formatUSD(quote.addOnTotal)}</span>
          </div>
        </div>

        {submitted ? (
          <div className="mt-5 p-4 bg-blush/40 text-burgundy rounded-sm text-[13px] flex items-start gap-2">
            <Sparkles size={16} className="mt-0.5 flex-shrink-0" />
            <div>
              Thank you! We've saved your estimate and will reach out within one business day.
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-5 space-y-2">
            <input
              required
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full py-2.5 px-3 bg-ivory border border-sand rounded-sm text-[13px] text-burgundy"
            />
            <input
              required
              type="tel"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full py-2.5 px-3 bg-ivory border border-sand rounded-sm text-[13px] text-burgundy"
            />
            <input
              required
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-2.5 px-3 bg-ivory border border-sand rounded-sm text-[13px] text-burgundy"
            />
            {error && <div className="text-[12px] text-red-700">{error}</div>}
            <button
              disabled={submitting}
              className="w-full bg-burgundy text-cream py-3 rounded-sm text-[13px] hover:bg-burgundy-dark transition-colors disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Request Final Quote"}
            </button>
            <p className="text-[11px] text-stone text-center">
              No commitment. We reply within one business day.
            </p>
          </form>
        )}
      </aside>
    </div>
  );
}
