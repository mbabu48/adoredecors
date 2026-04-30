"use client";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { EVENT_TYPES } from "@/lib/pricing";

export default function InquiryForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "wedding",
    eventDate: "",
    guestCount: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
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
          ...form,
          guestCount: form.guestCount ? Number(form.guestCount) : undefined,
          eventDate: form.eventDate || undefined,
          source: "contact",
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

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="w-14 h-14 bg-blush/50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="text-burgundy" size={22} />
        </div>
        <h3 className="font-serif text-2xl text-burgundy mb-2">Thank you!</h3>
        <p className="text-stone text-[14px] max-w-sm mx-auto">
          We've received your enquiry and will reach out within one business day. Keep an eye on your
          inbox and phone.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Field label="Name" required>
        <input
          required
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          className="field"
          placeholder="Your full name"
        />
      </Field>
      <Field label="Phone" required>
        <input
          required
          type="tel"
          value={form.phone}
          onChange={(e) => set("phone", e.target.value)}
          className="field"
          placeholder="+1 (555) xxx-xxxx"
        />
      </Field>
      <Field label="Email" required className="sm:col-span-2">
        <input
          required
          type="email"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          className="field"
          placeholder="you@email.com"
        />
      </Field>
      <Field label="Event type">
        <select
          value={form.eventType}
          onChange={(e) => set("eventType", e.target.value)}
          className="field"
        >
          {EVENT_TYPES.map((e) => (
            <option key={e.key} value={e.key}>
              {e.label}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Event date">
        <input
          type="date"
          value={form.eventDate}
          onChange={(e) => set("eventDate", e.target.value)}
          className="field"
        />
      </Field>
      <Field label="Guest count (approx.)" className="sm:col-span-2">
        <input
          type="number"
          min={1}
          value={form.guestCount}
          onChange={(e) => set("guestCount", e.target.value)}
          className="field"
          placeholder="e.g. 120"
        />
      </Field>
      <Field label="Tell us about your vision" required className="sm:col-span-2">
        <textarea
          required
          rows={4}
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          className="field"
          placeholder="Theme, palette, mood, inspiration... anything you'd like us to know."
        />
      </Field>
      {error && <div className="sm:col-span-2 text-[13px] text-red-700">{error}</div>}
      <div className="sm:col-span-2">
        <button
          disabled={submitting}
          className="w-full sm:w-auto px-8 py-3 bg-burgundy text-cream rounded-sm text-[14px] hover:bg-burgundy-dark transition-colors disabled:opacity-60"
        >
          {submitting ? "Sending..." : "Send Enquiry"}
        </button>
        <p className="text-[11px] text-stone mt-2">We reply within one business day.</p>
      </div>

      <style jsx>{`
        .field {
          width: 100%;
          padding: 10px 12px;
          background: #FAF6EE;
          border: 1px solid #F2E6D6;
          border-radius: 4px;
          font-size: 14px;
          color: #6B2C35;
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  required,
  children,
  className,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${className || ""}`}>
      <span className="text-[11px] text-burgundy tracking-[0.14em] uppercase">
        {label} {required && <span className="text-rose">*</span>}
      </span>
      {children}
    </label>
  );
}
