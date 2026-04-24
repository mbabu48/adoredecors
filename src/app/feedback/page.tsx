import { prisma } from "@/lib/prisma";
import FeedbackForm from "@/components/FeedbackForm";
import { eventTypeLabel } from "@/lib/pricing";
import { Star } from "lucide-react";

export const revalidate = 30;
export const metadata = { title: "Reviews & Feedback" };

export default async function FeedbackPage() {
  const items = await prisma.feedback.findMany({
    where: { approved: true },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-12">
        <div className="text-[11px] text-rose tracking-[0.22em] mb-2">VOICES OF OUR CLIENTS</div>
        <h1 className="font-serif text-4xl sm:text-5xl text-burgundy">
          Stories behind every celebration.
        </h1>
        <p className="text-stone mt-3 max-w-lg mx-auto text-[14px]">
          Real words from clients whose events we've styled.
        </p>
      </div>

      {items.length === 0 ? (
        <p className="text-center text-stone mb-16">Be the first to share your experience with us.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {items.map((f) => (
            <blockquote
              key={f.id}
              className="p-6 bg-cream border-l-2 border-rose rounded-sm"
            >
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    className={i < f.rating ? "fill-rose text-rose" : "text-sand"}
                  />
                ))}
              </div>
              <p className="font-serif italic text-burgundy text-[15px] leading-relaxed">
                &ldquo;{f.message}&rdquo;
              </p>
              <footer className="mt-4 pt-3 border-t border-sand">
                <div className="text-[12px] text-burgundy font-medium">{f.name}</div>
                {f.eventType && (
                  <div className="text-[10px] text-rose tracking-[0.14em] uppercase">
                    {eventTypeLabel(f.eventType)}
                  </div>
                )}
              </footer>
            </blockquote>
          ))}
        </div>
      )}

      <div id="share" className="max-w-2xl mx-auto">
        <div className="gold-divider mb-10 max-w-[120px] mx-auto" />
        <div className="text-center mb-6">
          <div className="text-[11px] text-rose tracking-[0.22em] mb-2">SHARE YOUR EXPERIENCE</div>
          <h2 className="font-serif text-3xl text-burgundy">Worked with us? We'd love to hear.</h2>
          <p className="text-stone mt-2 text-[13px]">Your review helps others plan their perfect event.</p>
        </div>
        <div className="bg-cream border border-sand rounded-md p-6 sm:p-8">
          <FeedbackForm />
        </div>
      </div>
    </div>
  );
}
