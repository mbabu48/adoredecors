import { prisma } from "@/lib/prisma";
import FeedbackModerator from "@/components/admin/FeedbackModerator";

export const dynamic = "force-dynamic";

export default async function AdminFeedbackPage() {
  const rows = await prisma.feedback.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="p-5 md:p-8 mt-14 md:mt-0">
      <h1 className="font-serif text-3xl text-burgundy">Feedback</h1>
      <p className="text-stone text-[13px] mt-1">
        Approve reviews to publish on the public Reviews page. Feature the best ones to show on the home page.
      </p>
      <div className="mt-6">
        <FeedbackModerator
          initial={rows.map((r) => ({
            ...r,
            createdAt: r.createdAt.toISOString(),
            updatedAt: r.updatedAt.toISOString(),
          }))}
        />
      </div>
    </div>
  );
}
