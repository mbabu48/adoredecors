"use client";
import { useMemo, useState } from "react";
import { formatUSD, eventTypeLabel } from "@/lib/pricing";

type Row = {
  id: string;
  name: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string | null;
  guestCount: number | null;
  venueSize: string | null;
  message: string;
  estimatedCost: number | null;
  status: string;
  source: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

type ConvertForm = {
  eventDate: string;
  venueAddress: string;
  guestCount: string;
  totalAmount: string;
  advancePaid: string;
  notes: string;
};

const STATUSES = ["new", "followup", "booked", "closed"] as const;

export default function InquiryTable({ initial }: { initial: Row[] }) {
  const [rows, setRows] = useState<Row[]>(initial);
  const [filter, setFilter] = useState<string>("all");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Row | null>(null);
  const [convertOpen, setConvertOpen] = useState(false);
  const [convertForm, setConvertForm] = useState<ConvertForm>({
    eventDate: "",
    venueAddress: "",
    guestCount: "1",
    totalAmount: "0",
    advancePaid: "0",
    notes: "",
  });
  const [converting, setConverting] = useState(false);
  const [convertError, setConvertError] = useState<string | null>(null);

  const visible = useMemo(() => {
    return rows.filter((r) => {
      if (filter !== "all" && r.status !== filter) return false;
      if (q) {
        const hay = `${r.name} ${r.email} ${r.phone} ${r.message}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [rows, filter, q]);

  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/api/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
      if (selected?.id === id) setSelected((s) => s ? { ...s, status } : s);
    }
  }

  async function updateNotes(id: string, notes: string) {
    const res = await fetch(`/api/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes }),
    });
    if (res.ok) setRows((prev) => prev.map((r) => (r.id === id ? { ...r, notes } : r)));
  }

  function openConvertModal(row: Row) {
    setConvertError(null);
    setConvertForm({
      eventDate: row.eventDate ? row.eventDate.slice(0, 10) : "",
      venueAddress: "",
      guestCount: row.guestCount != null ? String(row.guestCount) : "1",
      totalAmount: row.estimatedCost != null ? String(row.estimatedCost) : "0",
      advancePaid: "0",
      notes: row.notes || "",
    });
    setConvertOpen(true);
  }

  async function submitConvert(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setConverting(true);
    setConvertError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inquiryId: selected.id,
          customerName: selected.name,
          customerEmail: selected.email,
          customerPhone: selected.phone,
          eventType: selected.eventType,
          eventDate: convertForm.eventDate,
          venueAddress: convertForm.venueAddress || undefined,
          guestCount: parseInt(convertForm.guestCount, 10),
          totalAmount: parseInt(convertForm.totalAmount, 10),
          advancePaid: parseInt(convertForm.advancePaid, 10),
          notes: convertForm.notes || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create order");
      }
      await updateStatus(selected.id, "booked");
      setConvertOpen(false);
    } catch (err: any) {
      setConvertError(err.message);
    } finally {
      setConverting(false);
    }
  }

  return (
    <>
      <div className="flex flex-wrap gap-2 items-center mb-4">
        <input
          placeholder="Search by name, email, phone..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="flex-1 min-w-[200px] py-2 px-3 bg-cream border border-sand rounded text-[13px] text-burgundy"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="py-2 px-3 bg-cream border border-sand rounded text-[13px] text-burgundy"
        >
          <option value="all">All ({rows.length})</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s} ({rows.filter((r) => r.status === s).length})
            </option>
          ))}
        </select>
      </div>

      <div className="bg-cream border border-sand rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead className="bg-blush/30 text-burgundy">
              <tr>
                <th className="text-left px-3 py-2 font-medium">Date</th>
                <th className="text-left px-3 py-2 font-medium">Name</th>
                <th className="text-left px-3 py-2 font-medium">Contact</th>
                <th className="text-left px-3 py-2 font-medium">Event</th>
                <th className="text-left px-3 py-2 font-medium">Est.</th>
                <th className="text-left px-3 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => setSelected(r)}
                  className="border-t border-sand hover:bg-ivory cursor-pointer"
                >
                  <td className="px-3 py-2 text-stone whitespace-nowrap">
                    {new Date(r.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short" })}
                  </td>
                  <td className="px-3 py-2 text-burgundy">{r.name}</td>
                  <td className="px-3 py-2 text-stone text-[12px]">
                    <div>{r.phone}</div>
                    <div className="text-[11px]">{r.email}</div>
                  </td>
                  <td className="px-3 py-2 text-burgundy">
                    {eventTypeLabel(r.eventType)}
                    {r.guestCount && <span className="text-stone text-[11px]"> · {r.guestCount} pax</span>}
                  </td>
                  <td className="px-3 py-2 text-burgundy">
                    {r.estimatedCost ? formatUSD(r.estimatedCost) : "—"}
                  </td>
                  <td className="px-3 py-2">
                    <select
                      value={r.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => updateStatus(r.id, e.target.value)}
                      className="text-[12px] bg-ivory border border-sand rounded px-2 py-1 text-burgundy"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-stone">
                    No inquiries match your filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <div
          className="fixed inset-0 z-40 bg-burgundy/70 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-cream max-w-xl w-full rounded-md p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-serif text-xl text-burgundy">{selected.name}</h3>
                <div className="text-[12px] text-stone">
                  {eventTypeLabel(selected.eventType)}
                  {selected.eventDate && " · " + new Date(selected.eventDate).toLocaleDateString("en-US")}
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-stone text-[18px]">×</button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-[13px] mb-4">
              <div><span className="text-stone">Phone:</span> <a href={`tel:${selected.phone}`} className="text-burgundy">{selected.phone}</a></div>
              <div><span className="text-stone">Email:</span> <a href={`mailto:${selected.email}`} className="text-burgundy">{selected.email}</a></div>
              {selected.guestCount && <div><span className="text-stone">Guests:</span> {selected.guestCount}</div>}
              {selected.venueSize && <div><span className="text-stone">Venue:</span> {selected.venueSize}</div>}
              {selected.estimatedCost && <div><span className="text-stone">Estimate:</span> {formatUSD(selected.estimatedCost)}</div>}
              <div><span className="text-stone">Source:</span> {selected.source}</div>
            </div>
            <div className="mb-4">
              <div className="text-[11px] text-rose tracking-[0.14em] uppercase mb-1">Message</div>
              <p className="text-[13px] text-burgundy bg-ivory p-3 rounded border border-sand whitespace-pre-wrap">{selected.message}</p>
            </div>
            <div className="mb-4">
              <div className="text-[11px] text-rose tracking-[0.14em] uppercase mb-1">Internal notes</div>
              <textarea
                rows={3}
                defaultValue={selected.notes || ""}
                onBlur={(e) => updateNotes(selected.id, e.target.value)}
                placeholder="Add notes (auto-saves on blur)..."
                className="w-full py-2 px-3 bg-ivory border border-sand rounded text-[13px] text-burgundy"
              />
            </div>
            <div className="pt-2 border-t border-sand">
              <button
                onClick={() => openConvertModal(selected)}
                className="w-full py-2 bg-burgundy text-cream rounded text-[13px] hover:bg-burgundy-dark transition-colors"
              >
                Convert to Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Convert to Order modal */}
      {convertOpen && selected && (
        <div
          className="fixed inset-0 z-50 bg-burgundy/70 flex items-center justify-center p-4"
          onClick={() => setConvertOpen(false)}
        >
          <form
            onSubmit={submitConvert}
            onClick={(e) => e.stopPropagation()}
            className="bg-cream max-w-md w-full rounded-md p-6 space-y-3 max-h-[90vh] overflow-y-auto"
          >
            <h3 className="font-serif text-xl text-burgundy">Convert to Order</h3>
            <p className="text-[12px] text-stone">
              Creating order for <strong>{selected.name}</strong> · {eventTypeLabel(selected.eventType)}
            </p>

            {convertError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-[12px] rounded">{convertError}</div>
            )}

            <div>
              <label className="block text-[11px] text-stone uppercase tracking-[0.12em] mb-1">Event date *</label>
              <input
                required
                type="date"
                value={convertForm.eventDate}
                onChange={(e) => setConvertForm({ ...convertForm, eventDate: e.target.value })}
                className="w-full py-2 px-3 bg-ivory border border-sand rounded text-[13px] text-burgundy"
              />
            </div>

            <div>
              <label className="block text-[11px] text-stone uppercase tracking-[0.12em] mb-1">Venue address</label>
              <input
                type="text"
                placeholder="Venue name / address"
                value={convertForm.venueAddress}
                onChange={(e) => setConvertForm({ ...convertForm, venueAddress: e.target.value })}
                className="w-full py-2 px-3 bg-ivory border border-sand rounded text-[13px] text-burgundy"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-stone uppercase tracking-[0.12em] mb-1">Guests *</label>
                <input
                  required
                  type="number"
                  min="1"
                  value={convertForm.guestCount}
                  onChange={(e) => setConvertForm({ ...convertForm, guestCount: e.target.value })}
                  className="w-full py-2 px-3 bg-ivory border border-sand rounded text-[13px] text-burgundy"
                />
              </div>
              <div>
                <label className="block text-[11px] text-stone uppercase tracking-[0.12em] mb-1">Total ($) *</label>
                <input
                  required
                  type="number"
                  min="0"
                  value={convertForm.totalAmount}
                  onChange={(e) => setConvertForm({ ...convertForm, totalAmount: e.target.value })}
                  className="w-full py-2 px-3 bg-ivory border border-sand rounded text-[13px] text-burgundy"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-stone uppercase tracking-[0.12em] mb-1">Advance paid ($)</label>
              <input
                type="number"
                min="0"
                value={convertForm.advancePaid}
                onChange={(e) => setConvertForm({ ...convertForm, advancePaid: e.target.value })}
                className="w-full py-2 px-3 bg-ivory border border-sand rounded text-[13px] text-burgundy"
              />
            </div>

            <div>
              <label className="block text-[11px] text-stone uppercase tracking-[0.12em] mb-1">Notes</label>
              <textarea
                rows={2}
                value={convertForm.notes}
                onChange={(e) => setConvertForm({ ...convertForm, notes: e.target.value })}
                placeholder="Order notes..."
                className="w-full py-2 px-3 bg-ivory border border-sand rounded text-[13px] text-burgundy"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setConvertOpen(false)}
                className="flex-1 py-2 bg-sand text-burgundy rounded text-[13px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={converting}
                className="flex-1 py-2 bg-burgundy text-cream rounded text-[13px] disabled:opacity-60"
              >
                {converting ? "Creating..." : "Create Order"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
