import { prisma } from "@/lib/prisma";
import AdminGalleryManager from "@/components/admin/AdminGalleryManager";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const items = await prisma.galleryItem.findMany({
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
  });
  return (
    <div className="p-5 md:p-8 mt-14 md:mt-0">
      <h1 className="font-serif text-3xl text-burgundy">Gallery</h1>
      <p className="text-stone text-[13px] mt-1">
        Upload new event photos and manage your portfolio. Photos appear on the public Gallery page instantly.
      </p>
      <div className="mt-6">
        <AdminGalleryManager
          initial={items.map((i) => ({
            ...i,
            createdAt: i.createdAt.toISOString(),
            updatedAt: i.updatedAt.toISOString(),
          }))}
        />
      </div>
    </div>
  );
}
