import { prisma } from "@/lib/prisma";
import { formatUSD, eventTypeLabel } from "@/lib/pricing";
import Link from "next/link";
import { Inbox, Calendar, Star, Image as ImageIcon } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [newInquiries, booked, thisMonthRevenue, avgRating, recent] = await Promise.all([
    prisma.inquiry.count({ where: { status: "new" } }),
    prisma.order.count({ where: { status: { in: ["confirmed", "in_progress"] } } }),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: {
        eventDate: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
        },
      },
    }),
    prisma.feedback.aggregate({ _avg: { rating: true }, where: { approved: true } }),
    prisma.inquiry.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
  ]);

  const stats = [
    { key: "inquiries", label: "New inquiries", value: newInquiries.toString(), icon: Inbox, href: "/admin/inquiries" },
    { key: "booked", label: "Booked events", value: booked.toString(), icon: Calendar, href: "/admin/orders" },
    {
      key: "revenue",
      label: "This month ($)",
      value: thisMonthRevenue._sum.totalAmount
        ? formatUSD(thisMonthRevenue._sum.totalAmount)
        : "$0",
      icon: Calendar,
      href: "/admin/orders",
    },
    {
      key: "rating",
      label: "Avg rating",
      value: avgRating._avg.rating?.toFixed(1) || "—",
      icon: Star,
      href: "/admin/feedback",
    },
  ];

  return (
    <div className="p-5 md:p-8 mt-14 md:mt-0">
      <h1 className="font-serif text-3xl text-burgundy">Dashboard</h1>
      <p className="text-stone text-[13px] mt-1">Overview of your business at a glance.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
        {stats.map((s) => (
          <Link
            key={s.key}
            href={s.href}
            className="p-4 bg-cream border border-sand rounded-md hover:shadow-card transition-shadow"
          >
            <div className="text-[10px] text-rose tracking-[0.16em] uppercase">{s.label}</div>
            <div className="font-serif text-3xl text-burgundy mt-1">{s.value}</div>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif text-xl text-burgundy">Recent inquiries</h2>
          <Link href="/admin/inquiries" className="text-[12px] text-rose hover:text-burgundy">
            See all →
          </Link>
        </div>
        <div className="bg-cream border border-sand rounded-md overflow-hidden">
          <table className="w-full text-[13px]">
            <thead className="bg-blush/30 text-burgundy">
              <tr>
                <th className="text-left px-4 py-2 font-medium">Date</th>
                <th className="text-left px-4 py-2 font-medium">Name</th>
                <th className="text-left px-4 py-2 font-medium">Event</th>
                <th className="text-left px-4 py-2 font-medium hidden sm:table-cell">Est.</th>
                <th className="text-left px-4 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((r) => (
                <tr key={r.id} className="border-t border-sand">
                  <td className="px-4 py-2 text-stone">
                    {new Date(r.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short" })}
                  </td>
                  <td className="px-4 py-2 text-burgundy">{r.name}</td>
                  <td className="px-4 py-2 text-burgundy">{eventTypeLabel(r.eventType)}</td>
                  <td className="px-4 py-2 text-burgundy hidden sm:table-cell">
                    {r.estimatedCost ? formatUSD(r.estimatedCost) : "—"}
                  </td>
                  <td className="px-4 py-2">
                    <StatusPill status={r.status} />
                  </td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-stone">
                    No inquiries yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-8">
        <Link
          href="/admin/gallery"
          className="flex items-center gap-3 p-5 bg-cream border border-sand rounded-md hover:shadow-card"
        >
          <div className="w-10 h-10 bg-blush/40 rounded-full flex items-center justify-center">
            <ImageIcon size={16} className="text-burgundy" />
          </div>
          <div>
            <div className="font-serif text-burgundy">Upload event photos</div>
            <div className="text-[12px] text-stone">Add work to your portfolio gallery</div>
          </div>
        </Link>
        <Link
          href="/admin/feedback"
          className="flex items-center gap-3 p-5 bg-cream border border-sand rounded-md hover:shadow-card"
        >
          <div className="w-10 h-10 bg-blush/40 rounded-full flex items-center justify-center">
            <Star size={16} className="text-burgundy" />
          </div>
          <div>
            <div className="font-serif text-burgundy">Moderate reviews</div>
            <div className="text-[12px] text-stone">Approve and feature client feedback</div>
          </div>
        </Link>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const colors: Record<string, string> = {
    new: "bg-blush text-burgundy",
    followup: "bg-sand text-burgundy",
    booked: "bg-green-100 text-green-900",
    closed: "bg-stone-100 text-stone",
  };
  const labels: Record<string, string> = {
    new: "New",
    followup: "Follow-up",
    booked: "Booked",
    closed: "Closed",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] ${colors[status] || "bg-sand text-burgundy"}`}>
      {labels[status] || status}
    </span>
  );
}
