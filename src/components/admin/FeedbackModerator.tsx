"use client";
import { useState } from "react";
import { Check, Star, Trash2 } from "lucide-react";
import { eventTypeLabel } from "@/lib/pricing";

type Row = {
  id: string;
  name: string;
  eventType: string | null;
  rating: number;
  message: string;
  approved: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function FeedbackModerator({ initial }: { initial: Row[] }) {
  const [rows, setRows] = useState<Row[]>(initial);
  const [tab, setTab] = useState<"pending" | "approved">("pending");

  async function patch(id: string, data: Partial<Row>) {
    const res = await fetch(`/api/admin/feedback/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) setRows((p) => p.map((r) => (r.id === id ? { ...r, ...data } : r)));
  }

  async function remove(id: string) {
    if (!confirm("Delete this review?")) return;
    const res = await fetch(`/api/admin/feedback/${id}`, { method: "DELETE" });
    if (res.ok) setRows((p) => p.filter((r) => r.id !== id));
  }

  const pending = rows.filter((r) => !r.approved);
  const approved = rows.filter((r) => r.approved);
  const visible = tab === "pending" ? pending : approved;

  return (
    <>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab("pending")}
          className={`px-4 py-2 text-[13px] rounded-full ${
            tab === "pending" ? "bg-burgundy text-cream" : "bg-cream text-burgundy border border-sand"
          }`}
        >
          Pending <span className="opacity-70">({pending.length})</span>
        </button>
        <button
          onClick={() => setTab("approved")}
          className={`px-4 py-2 text-[13px] rounded-full ${
            tab === "approved" ? "bg-burgundy text-cream" : "bg-cream text-burgundy border border-sand"
          }`}
        >
          Published <span className="opacity-70">({approved.length})</span>
        </button>
      </div>

      {visible.length === 0 ? (
        <p className="text-center text-stone py-12">
          {tab === "pending" ? "No pending reviews." : "No published reviews yet."}
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {visible.map((r) => (
            <div key={r.id} className="bg-cream border border-sand rounded-md p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="text-[14px] text-burgundy font-medium">{r.name}</div>
                  <div className="text-[11px] text-rose tracking-[0.1em] uppercase">
                    {r.eventType ? eventTypeLabel(r.eventType) : "—"} ·{" "}
                    {new Date(r.createdAt).toLocaleDateString("en-IN")}
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      className={i < r.rating ? "fill-rose text-rose" : "text-sand"}
                    />
                  ))}
                </div>
              </div>
              <p className="text-[13px] text-burgundy font-serif italic leading-relaxed mb-3">
                &ldquo;{r.message}&rdquo;
              </p>
              <div className="flex flex-wrap gap-2">
                {!r.approved && (
                  <button
                    onClick={() => patch(r.id, { approved: true })}
                    className="flex items-center gap-1 px-3 py-1.5 bg-burgundy text-cream rounded text-[12px]"
                  >
                    <Check size={12} /> Approve
                  </button>
                )}
                {r.approved && (
                  <button
                    onClick={() => patch(r.id, { approved: false })}
                    className="flex items-center gap-1 px-3 py-1.5 bg-sand text-burgundy rounded text-[12px]"
                  >
                    Unpublish
                  </button>
                )}
                {r.approved && (
                  <button
                    onClick={() => patch(r.id, { featured: !r.featured })}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded text-[12px] ${
                      r.featured ? "bg-rose text-cream" : "bg-cream border border-rose text-burgundy"
                    }`}
                  >
                    <Star size={12} className={r.featured ? "fill-cream" : ""} />
                    {r.featured ? "Featured" : "Feature"}
                  </button>
                )}
                <button
                  onClick={() => remove(r.id)}
                  className="flex items-center gap-1 px-3 py-1.5 text-red-700 text-[12px] ml-auto"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
