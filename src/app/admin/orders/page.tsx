import { prisma } from "@/lib/prisma";
import OrdersTable from "@/components/admin/OrdersTable";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const rows = await prisma.order.findMany({ orderBy: { eventDate: "asc" } });

  return (
    <div className="p-5 md:p-8 mt-14 md:mt-0">
      <h1 className="font-serif text-3xl text-burgundy">Orders</h1>
      <p className="text-stone text-[13px] mt-1">Confirmed events on your calendar.</p>
      <OrdersTable
        initial={rows.map((r) => ({
          ...r,
          eventDate: r.eventDate.toISOString(),
          createdAt: r.createdAt.toISOString(),
          updatedAt: r.updatedAt.toISOString(),
        }))}
      />
    </div>
  );
}
