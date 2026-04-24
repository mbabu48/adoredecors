"use client";
import { useState } from "react";
import { formatINR, eventTypeLabel } from "@/lib/pricing";

type Order = {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  eventType: string;
  eventDate: string;
  venueAddress: string | null;
  guestCount: number;
  totalAmount: number;
  advancePaid: number;
  status: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

const ORDER_STATUSES = ["confirmed", "in_progress", "delivered", "cancelled"] as const;

export default function OrdersTable({ initial }: { initial: Order[] }) {
  const [orders, setOrders] = useState<Order[]>(initial);

  async function updateOrder(id: string, patch: Partial<Order>) {
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (res.ok) {
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o)));
    }
  }

  return (
    <div className="mt-6 bg-cream border border-sand rounded-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead className="bg-blush/30 text-burgundy">
            <tr>
              <th className="text-left px-3 py-2 font-medium">Event date</th>
              <th className="text-left px-3 py-2 font-medium">Customer</th>
              <th className="text-left px-3 py-2 font-medium">Event</th>
              <th className="text-left px-3 py-2 font-medium">Venue</th>
              <th className="text-left px-3 py-2 font-medium">Guests</th>
              <th className="text-left px-3 py-2 font-medium">Total</th>
              <th className="text-left px-3 py-2 font-medium">Advance paid</th>
              <th className="text-left px-3 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((r) => (
              <tr key={r.id} className="border-t border-sand">
                <td className="px-3 py-2 text-burgundy whitespace-nowrap">
                  {new Date(r.eventDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-3 py-2 text-burgundy">
                  <div>{r.customerName}</div>
                  <div className="text-[11px] text-stone">{r.customerPhone}</div>
                </td>
                <td className="px-3 py-2 text-burgundy">{eventTypeLabel(r.eventType)}</td>
                <td className="px-3 py-2 text-stone text-[12px]">{r.venueAddress || "—"}</td>
                <td className="px-3 py-2 text-burgundy">{r.guestCount}</td>
                <td className="px-3 py-2 text-burgundy">{formatINR(r.totalAmount)}</td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    key={r.id + "-" + r.advancePaid}
                    defaultValue={r.advancePaid}
                    onBlur={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val) && val !== r.advancePaid) {
                        updateOrder(r.id, { advancePaid: val });
                      }
                    }}
                    className="w-24 py-1 px-2 bg-ivory border border-sand rounded text-[12px] text-burgundy"
                  />
                </td>
                <td className="px-3 py-2">
                  <select
                    value={r.status}
                    onChange={(e) => updateOrder(r.id, { status: e.target.value })}
                    className="text-[12px] bg-ivory border border-sand rounded px-2 py-1 text-burgundy"
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-stone">
                  No orders yet. Convert inquiries to orders from the Inquiries page.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
