import InquiryForm from "@/components/InquiryForm";
import { site, whatsappLink } from "@/lib/site";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-10">
        <div className="text-[11px] text-rose tracking-[0.22em] mb-2">LET'S PLAN TOGETHER</div>
        <h1 className="font-serif text-4xl sm:text-5xl text-burgundy">Tell us about your event.</h1>
        <p className="text-stone mt-3 max-w-lg mx-auto text-[14px]">
          Share your vision and we'll send a personalized proposal within one business day.
        </p>
      </div>

      <div className="grid md:grid-cols-[1fr_280px] gap-10">
        <div className="bg-cream border border-sand rounded-md p-6 sm:p-8">
          <InquiryForm />
        </div>

        <aside className="space-y-4">
          <a
            href={whatsappLink("Hi! I'd like to know more about your decoration services.")}
            target="_blank"
            rel="noreferrer"
            className="block p-4 bg-cream border border-sand rounded-md hover:shadow-card transition-shadow"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center text-white">
                <MessageCircle size={18} />
              </div>
              <div>
                <div className="font-medium text-burgundy text-[14px]">WhatsApp us</div>
                <div className="text-[12px] text-stone">Fastest way to reach us</div>
              </div>
            </div>
          </a>

          <div className="p-4 bg-cream border border-sand rounded-md">
            <div className="flex items-start gap-3 mb-3">
              <Phone size={16} className="mt-1 text-rose" />
              <div>
                <div className="text-[11px] text-rose tracking-[0.14em] uppercase">Phone</div>
                <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="text-[14px] text-burgundy">
                  {site.phone}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3 mb-3">
              <Mail size={16} className="mt-1 text-rose" />
              <div>
                <div className="text-[11px] text-rose tracking-[0.14em] uppercase">Email</div>
                <a href={`mailto:${site.email}`} className="text-[14px] text-burgundy">
                  {site.email}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin size={16} className="mt-1 text-rose" />
              <div>
                <div className="text-[11px] text-rose tracking-[0.14em] uppercase">Location</div>
                <div className="text-[14px] text-burgundy">{site.address}</div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blush/30 border border-rose/20 rounded-md">
            <div className="text-[11px] text-burgundy tracking-[0.14em] uppercase mb-1">Hours</div>
            <div className="text-[13px] text-burgundy">Mon – Sat · 9am to 8pm</div>
            <div className="text-[13px] text-stone">Sunday by appointment</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
