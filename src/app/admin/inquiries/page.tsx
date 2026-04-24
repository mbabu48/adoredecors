import { prisma } from "@/lib/prisma";
import InquiryTable from "@/components/admin/InquiryTable";

export const dynamic = "force-dynamic";

export default async function InquiriesPage() {
  const rows = await prisma.inquiry.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="p-5 md:p-8 mt-14 md:mt-0">
      <h1 className="font-serif text-3xl text-burgundy">Inquiries</h1>
      <p className="text-stone text-[13px] mt-1">Every enquiry from your contact form, pricing calculator, and footer.</p>
      <div className="mt-6">
        <InquiryTable initial={rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString(), updatedAt: r.updatedAt.toISOString(), eventDate: r.eventDate?.toISOString() || null }))} />
      </div>
    </div>
  );
}
