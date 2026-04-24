import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Heart, Users, Gift } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { eventTypeLabel } from "@/lib/pricing";

export const revalidate = 60; // refresh home every minute

const services = [
  { icon: Heart, title: "Weddings", desc: "Mandaps, reception stages, haldi, mehendi, sangeet." },
  { icon: Gift, title: "Birthdays", desc: "Sweet 16, 60th, kids' themes, milestone celebrations." },
  { icon: Sparkles, title: "Baby Showers", desc: "Pastel backdrops, floral arches, dreamy setups." },
  { icon: Users, title: "Corporate", desc: "Launches, galas, conferences, award nights." },
];

export default async function Home() {
  const [featuredGallery, featuredFeedback] = await Promise.all([
    prisma.galleryItem.findMany({
      where: { featured: true },
      orderBy: { displayOrder: "asc" },
      take: 4,
    }),
    prisma.feedback.findMany({
      where: { approved: true, featured: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1800&q=80"
            alt=""
            fill
            priority
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ivory/60 via-ivory/80 to-ivory" />
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-24 sm:py-32 text-center">
          <div className="text-[11px] text-rose tracking-[0.28em] mb-6 animate-fade-in">
            WEDDINGS · BIRTHDAYS · CORPORATE · MILESTONES
          </div>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl text-burgundy leading-tight animate-slide-up">
            Your story, <em className="text-rose not-italic italic">styled</em> beautifully.
          </h1>
          <p className="text-stone mt-6 max-w-xl mx-auto text-[15px] leading-relaxed">
            From intimate baby showers to grand weddings, we craft bespoke decoration tailored to your
            palette, theme, and space. Every detail placed with intention.
          </p>
          <div className="mt-10 flex flex-wrap gap-3 justify-center">
            <Link
              href="/gallery"
              className="bg-burgundy text-cream px-6 py-3 rounded-sm text-[14px] inline-flex items-center gap-2 hover:bg-burgundy-dark transition-colors"
            >
              View Our Work <ArrowRight size={16} />
            </Link>
            <Link
              href="/pricing"
              className="border border-rose text-burgundy px-6 py-3 rounded-sm text-[14px] hover:bg-blush/30 transition-colors"
            >
              Estimate My Event
            </Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="text-[11px] text-rose tracking-[0.22em] mb-2">OCCASIONS WE DECORATE</div>
            <h2 className="font-serif text-3xl sm:text-4xl text-burgundy">
              Every event, a new canvas.
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {services.map((s) => (
              <div
                key={s.title}
                className="p-6 rounded-md border border-sand bg-ivory hover:shadow-card transition-shadow"
              >
                <div className="w-11 h-11 rounded-full bg-blush/40 flex items-center justify-center text-burgundy mb-4">
                  <s.icon size={18} />
                </div>
                <h3 className="font-serif text-lg text-burgundy mb-1">{s.title}</h3>
                <p className="text-[13px] text-stone leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured gallery */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="text-[11px] text-rose tracking-[0.22em] mb-2">RECENT WORK</div>
            <h2 className="font-serif text-3xl sm:text-4xl text-burgundy">Moments we've styled.</h2>
          </div>
          {featuredGallery.length === 0 ? (
            <p className="text-center text-stone">Photos coming soon.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {featuredGallery.map((g) => (
                <div
                  key={g.id}
                  className="gallery-tile relative aspect-square overflow-hidden rounded-sm bg-sand"
                >
                  <Image
                    src={g.imageUrl}
                    alt={g.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-burgundy/90 to-transparent p-3">
                    <div className="text-cream text-[12px] font-serif">{g.title}</div>
                    <div className="text-blush text-[10px] tracking-[0.12em] uppercase">
                      {eventTypeLabel(g.eventType)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <Link href="/gallery" className="text-rose hover:text-burgundy text-[13px] underline underline-offset-4">
              See the full gallery →
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {featuredFeedback.length > 0 && (
        <section className="py-20 bg-cream">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <div className="text-[11px] text-rose tracking-[0.22em] mb-2">TESTIMONIALS</div>
              <h2 className="font-serif text-3xl sm:text-4xl text-burgundy">
                What our clients say.
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {featuredFeedback.map((f) => (
                <blockquote
                  key={f.id}
                  className="p-6 bg-ivory border-l-2 border-rose"
                >
                  <p className="font-serif italic text-burgundy text-[15px] leading-relaxed">
                    &ldquo;{f.message}&rdquo;
                  </p>
                  <footer className="mt-4 pt-4 border-t border-sand">
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
            <div className="text-center mt-8">
              <Link href="/feedback" className="text-rose hover:text-burgundy text-[13px] underline underline-offset-4">
                Read more reviews →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="gold-divider mb-8 mx-auto max-w-[120px]" />
          <h2 className="font-serif text-3xl sm:text-4xl text-burgundy mb-4">
            Let's plan something beautiful.
          </h2>
          <p className="text-stone mb-8">
            Share your event details and we'll send a personalized proposal within one business day.
          </p>
          <Link
            href="/contact"
            className="bg-burgundy text-cream px-8 py-3 rounded-sm inline-flex items-center gap-2 hover:bg-burgundy-dark transition-colors"
          >
            Start My Enquiry <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
