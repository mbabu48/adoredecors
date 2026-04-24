"use client";
import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { eventTypeLabel } from "@/lib/pricing";

type Item = {
  id: string;
  imageUrl: string;
  title: string;
  description: string | null;
  eventType: string;
};

const FILTERS = [
  { key: "all", label: "All" },
  { key: "wedding", label: "Wedding" },
  { key: "birthday", label: "Birthday" },
  { key: "baby_shower", label: "Baby Shower" },
  { key: "corporate", label: "Corporate" },
  { key: "anniversary", label: "Anniversary" },
  { key: "retirement", label: "Retirement" },
];

export default function GalleryGrid({ items }: { items: Item[] }) {
  const [filter, setFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Item | null>(null);

  const visible = filter === "all" ? items : items.filter((i) => i.eventType === filter);

  return (
    <>
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {FILTERS.map((f) => {
          const count =
            f.key === "all" ? items.length : items.filter((i) => i.eventType === f.key).length;
          if (count === 0 && f.key !== "all") return null;
          const on = filter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-1.5 rounded-full text-[12px] border transition-colors ${
                on
                  ? "bg-burgundy text-cream border-burgundy"
                  : "bg-cream text-burgundy border-sand hover:border-rose"
              }`}
            >
              {f.label} <span className="opacity-60">({count})</span>
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <p className="text-center text-stone py-12">No photos in this category yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {visible.map((g) => (
            <button
              key={g.id}
              onClick={() => setSelected(g)}
              className="gallery-tile text-left relative aspect-square overflow-hidden rounded-sm bg-sand group"
            >
              <Image
                src={g.imageUrl}
                alt={g.title}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-burgundy/90 via-burgundy/40 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="text-cream text-[12px] font-serif">{g.title}</div>
                <div className="text-blush text-[10px] tracking-[0.12em] uppercase">
                  {eventTypeLabel(g.eventType)}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 z-50 bg-burgundy/80 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelected(null)}
        >
          <button
            onClick={() => setSelected(null)}
            aria-label="Close"
            className="absolute top-4 right-4 text-cream hover:text-blush"
          >
            <X size={28} />
          </button>
          <div
            className="max-w-4xl w-full bg-cream rounded-md overflow-hidden animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[4/3] bg-sand">
              <Image
                src={selected.imageUrl}
                alt={selected.title}
                fill
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-cover"
              />
            </div>
            <div className="p-5">
              <div className="text-[10px] text-rose tracking-[0.2em] uppercase">
                {eventTypeLabel(selected.eventType)}
              </div>
              <h3 className="font-serif text-xl text-burgundy mt-1">{selected.title}</h3>
              {selected.description && (
                <p className="text-[14px] text-stone mt-2 leading-relaxed">{selected.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
