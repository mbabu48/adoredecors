import { prisma } from "@/lib/prisma";
import GalleryGrid from "@/components/GalleryGrid";

export const revalidate = 30;

export const metadata = { title: "Gallery" };

export default async function GalleryPage() {
  const items = await prisma.galleryItem.findMany({
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-10">
        <div className="text-[11px] text-rose tracking-[0.22em] mb-2">OUR PORTFOLIO</div>
        <h1 className="font-serif text-4xl sm:text-5xl text-burgundy">Every event, a new canvas.</h1>
        <p className="text-stone mt-3 max-w-lg mx-auto text-[14px]">
          Browse recent events we've styled. Filter by occasion to find inspiration for yours.
        </p>
      </div>
      <GalleryGrid items={items} />
    </div>
  );
}
