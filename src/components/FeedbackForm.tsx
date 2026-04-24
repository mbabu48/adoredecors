"use client";
import { useState } from "react";
import { Star, Sparkles } from "lucide-react";
import { EVENT_TYPES } from "@/lib/pricing";

export default function FeedbackForm() {
  const [name, setName] = useState("");
  const [eventType, setEventType] = useState("wedding");
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, eventType, rating, message }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Could not submit");
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-6">
        <div className="w-12 h-12 bg-blush/50 rounded-full flex items-center justify-center mx-auto mb-3">
          <Sparkles className="text-burgundy" size={20} />
        </div>
        <h3 className="font-serif text-xl text-burgundy mb-2">Thank you for sharing!</h3>
        <p className="text-stone text-[13px] max-w-sm mx-auto">
          We'll review and publish your feedback shortly. Your words mean the world to us.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-[11px] text-burgundy tracking-[0.14em] uppercase mb-1.5">
          Your name
        </label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full py-2.5 px-3 bg-ivory border border-sand rounded-sm text-[14px] text-burgundy"
          placeholder="Priya M."
        />
      </div>
      <div>
        <label className="block text-[11px] text-burgundy tracking-[0.14em] uppercase mb-1.5">
          Event type
        </label>
        <select
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
          className="w-full py-2.5 px-3 bg-ivory border border-sand rounded-sm text-[14px] text-burgundy"
        >
          {EVENT_TYPES.map((e) => (
            <option key={e.key} value={e.key}>
              {e.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-[11px] text-burgundy tracking-[0.14em] uppercase mb-1.5">
          Rating
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              type="button"
              key={n}
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
            >
              <Star
                size={26}
                className={
                  n <= (hover || rating) ? "fill-rose text-rose" : "text-sand"
                }
              />
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-[11px] text-burgundy tracking-[0.14em] uppercase mb-1.5">
          Your review
        </label>
        <textarea
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full py-2.5 px-3 bg-ivory border border-sand rounded-sm text-[14px] text-burgundy"
          placeholder="Tell us about your experience..."
        />
      </div>
      {error && <div className="text-[13px] text-red-700">{error}</div>}
      <button
        disabled={submitting}
        className="w-full bg-burgundy text-cream py-3 rounded-sm text-[14px] hover:bg-burgundy-dark transition-colors disabled:opacity-60"
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
      <p className="text-[11px] text-stone text-center">
        Reviews are published after a quick moderation check.
      </p>
    </form>
  );
}
