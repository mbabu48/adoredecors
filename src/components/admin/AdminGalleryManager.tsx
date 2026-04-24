"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { Trash2, Star, Upload, Plus } from "lucide-react";
import { EVENT_TYPES, eventTypeLabel } from "@/lib/pricing";

type Item = {
  id: string;
  imageUrl: string;
  publicId: string | null;
  title: string;
  description: string | null;
  eventType: string;
  featured: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
};

export default function AdminGalleryManager({ initial }: { initial: Item[] }) {
  const [items, setItems] = useState<Item[]>(initial);
  const [uploading, setUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({
    imageUrl: "",
    title: "",
    description: "",
    eventType: "wedding",
    featured: false,
  });
  const [error, setError] = useState<string | null>(null);

  const dragItemIndex = useRef<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  async function uploadToCloudinary(file: File): Promise<{ url: string; publicId: string }> {
    if (!cloudName || !uploadPreset) {
      throw new Error(
        "Cloudinary is not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env",
      );
    }
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", uploadPreset);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: fd,
    });
    if (!res.ok) throw new Error("Cloudinary upload failed");
    const data = await res.json();
    return { url: data.secure_url, publicId: data.public_id };
  }

  async function handleFile(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const { url, publicId } = await uploadToCloudinary(file);
        const res = await fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageUrl: url,
            publicId,
            title: file.name.replace(/\.[^.]+$/, ""),
            description: "",
            eventType: "wedding",
            featured: false,
          }),
        });
        if (res.ok) {
          const { row } = await res.json();
          setItems((p) => [{ ...row, createdAt: row.createdAt, updatedAt: row.updatedAt }, ...p]);
        }
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  }

  async function submitManual(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Could not add");
      const { row } = await res.json();
      setItems((p) => [row, ...p]);
      setForm({ imageUrl: "", title: "", description: "", eventType: "wedding", featured: false });
      setAddOpen(false);
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function toggleFeatured(id: string, featured: boolean) {
    const res = await fetch(`/api/gallery/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !featured }),
    });
    if (res.ok) setItems((p) => p.map((i) => (i.id === id ? { ...i, featured: !featured } : i)));
  }

  async function updateItem(id: string, patch: Partial<Item>) {
    const res = await fetch(`/api/gallery/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (res.ok) setItems((p) => p.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }

  async function remove(id: string) {
    if (!confirm("Delete this photo?")) return;
    const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
    if (res.ok) setItems((p) => p.filter((i) => i.id !== id));
  }

  function handleCardDragStart(index: number) {
    dragItemIndex.current = index;
  }

  function handleCardDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    setDragOverIndex(index);
  }

  async function handleCardDrop(e: React.DragEvent, dropIndex: number) {
    e.preventDefault();
    const sourceIndex = dragItemIndex.current;
    if (sourceIndex === null || sourceIndex === dropIndex) {
      setDragOverIndex(null);
      dragItemIndex.current = null;
      return;
    }
    const reordered = [...items];
    const [moved] = reordered.splice(sourceIndex, 1);
    reordered.splice(dropIndex, 0, moved);
    const withOrder = reordered.map((item, idx) => ({ ...item, displayOrder: idx }));
    setItems(withOrder);
    setDragOverIndex(null);
    dragItemIndex.current = null;
    await fetch("/api/gallery/reorder", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(withOrder.map(({ id, displayOrder }) => ({ id, displayOrder }))),
    });
  }

  function handleCardDragEnd() {
    setDragOverIndex(null);
    dragItemIndex.current = null;
  }

  return (
    <>
      {/* Upload zone */}
      <label
        className={`block border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors mb-6 ${
          isDragOver
            ? "border-burgundy bg-blush/40"
            : "border-rose/60 hover:bg-blush/20"
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragEnter={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsDragOver(false);
          }
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          handleFile(e.dataTransfer.files);
        }}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFile(e.target.files)}
          disabled={uploading}
        />
        <Upload className="mx-auto text-rose mb-2" size={28} />
        <div className="font-serif text-burgundy text-lg">
          {uploading ? "Uploading..." : isDragOver ? "Drop to upload" : "Drag & drop or click to upload"}
        </div>
        <div className="text-[12px] text-stone mt-1">
          Multiple images supported. Photos upload to Cloudinary and appear live instantly.
        </div>
      </label>

      <div className="flex items-center justify-between mb-4">
        <p className="text-[12px] text-stone">{items.length} photos in gallery · drag cards to reorder</p>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-1 text-[12px] text-rose hover:text-burgundy"
        >
          <Plus size={14} /> Add by URL
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 text-[13px] rounded">{error}</div>}

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((it, index) => (
          <div
            key={it.id}
            draggable
            onDragStart={() => handleCardDragStart(index)}
            onDragOver={(e) => handleCardDragOver(e, index)}
            onDrop={(e) => handleCardDrop(e, index)}
            onDragEnd={handleCardDragEnd}
            className={`bg-cream border rounded-md overflow-hidden cursor-grab active:cursor-grabbing transition-opacity ${
              dragOverIndex === index ? "border-burgundy opacity-60" : "border-sand"
            }`}
          >
            <div className="relative aspect-square bg-sand">
              <Image src={it.imageUrl} alt={it.title} fill sizes="25vw" className="object-cover" />
              <button
                onClick={() => toggleFeatured(it.id, it.featured)}
                className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center ${
                  it.featured ? "bg-rose text-cream" : "bg-cream/80 text-burgundy"
                }`}
                title={it.featured ? "Unfeature" : "Feature on home"}
              >
                <Star size={13} className={it.featured ? "fill-cream" : ""} />
              </button>
            </div>
            <div className="p-3 space-y-2">
              <input
                defaultValue={it.title}
                onBlur={(e) => updateItem(it.id, { title: e.target.value })}
                className="w-full text-[13px] text-burgundy bg-ivory border border-sand rounded px-2 py-1"
              />
              <select
                value={it.eventType}
                onChange={(e) => updateItem(it.id, { eventType: e.target.value })}
                className="w-full text-[12px] text-burgundy bg-ivory border border-sand rounded px-2 py-1"
              >
                {EVENT_TYPES.map((e) => (
                  <option key={e.key} value={e.key}>
                    {e.label}
                  </option>
                ))}
              </select>
              <textarea
                rows={2}
                defaultValue={it.description || ""}
                placeholder="Theme / description..."
                onBlur={(e) => updateItem(it.id, { description: e.target.value })}
                className="w-full text-[12px] text-burgundy bg-ivory border border-sand rounded px-2 py-1"
              />
              <button
                onClick={() => remove(it.id)}
                className="flex items-center gap-1 text-[11px] text-red-700 hover:text-red-900"
              >
                <Trash2 size={12} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Manual add modal */}
      {addOpen && (
        <div className="fixed inset-0 z-40 bg-burgundy/70 flex items-center justify-center p-4" onClick={() => setAddOpen(false)}>
          <form
            onSubmit={submitManual}
            onClick={(e) => e.stopPropagation()}
            className="bg-cream max-w-md w-full rounded-md p-6 space-y-3"
          >
            <h3 className="font-serif text-xl text-burgundy">Add photo by URL</h3>
            <input
              required
              placeholder="Image URL (https://...)"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className="w-full py-2 px-3 bg-ivory border border-sand rounded text-[13px]"
            />
            <input
              required
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full py-2 px-3 bg-ivory border border-sand rounded text-[13px]"
            />
            <select
              value={form.eventType}
              onChange={(e) => setForm({ ...form, eventType: e.target.value })}
              className="w-full py-2 px-3 bg-ivory border border-sand rounded text-[13px]"
            >
              {EVENT_TYPES.map((e) => (
                <option key={e.key} value={e.key}>
                  {e.label}
                </option>
              ))}
            </select>
            <textarea
              rows={2}
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full py-2 px-3 bg-ivory border border-sand rounded text-[13px]"
            />
            <label className="flex items-center gap-2 text-[13px] text-burgundy">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              />
              Feature on home page
            </label>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setAddOpen(false)} className="flex-1 py-2 bg-sand text-burgundy rounded text-[13px]">
                Cancel
              </button>
              <button type="submit" className="flex-1 py-2 bg-burgundy text-cream rounded text-[13px]">
                Add
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
