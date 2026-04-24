"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X, Phone } from "lucide-react";
import Link from "next/link";
import { site, whatsappLink } from "@/lib/site";

export default function FeedbackBubble() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  if (path?.startsWith("/admin")) return null;

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open contact options"
        className="fixed bottom-5 right-5 z-50 bg-burgundy text-cream rounded-full shadow-soft hover:bg-burgundy-dark transition-colors flex items-center gap-2 px-4 py-3"
      >
        {open ? <X size={18} /> : <MessageCircle size={18} />}
        <span className="text-[13px]">{open ? "Close" : "Chat with us"}</span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Contact options"
          className="fixed bottom-20 right-5 z-50 w-[280px] bg-cream border border-sand rounded-md shadow-soft p-4 animate-slide-up"
        >
          <div className="font-serif text-burgundy text-base mb-1">How can we help?</div>
          <p className="text-[12px] text-stone mb-4">We reply within one business day.</p>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 p-3 mb-2 bg-ivory hover:bg-blush/30 rounded border border-sand transition-colors"
          >
            <div className="w-8 h-8 bg-[#25D366] rounded-full flex items-center justify-center text-white text-xs font-bold">W</div>
            <div>
              <div className="text-[13px] text-burgundy font-medium">WhatsApp</div>
              <div className="text-[11px] text-stone">Fastest reply</div>
            </div>
          </a>
          <a
            href={`tel:${site.phone.replace(/\s/g, "")}`}
            className="flex items-center gap-3 p-3 mb-2 bg-ivory hover:bg-blush/30 rounded border border-sand transition-colors"
          >
            <div className="w-8 h-8 bg-burgundy rounded-full flex items-center justify-center text-cream">
              <Phone size={14} />
            </div>
            <div>
              <div className="text-[13px] text-burgundy font-medium">Call us</div>
              <div className="text-[11px] text-stone">{site.phone}</div>
            </div>
          </a>
          <Link
            href="/feedback#share"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 p-3 bg-ivory hover:bg-blush/30 rounded border border-sand transition-colors"
          >
            <div className="w-8 h-8 bg-rose rounded-full flex items-center justify-center text-cream text-xs">
              ★
            </div>
            <div>
              <div className="text-[13px] text-burgundy font-medium">Share feedback</div>
              <div className="text-[11px] text-stone">Tell us about your event</div>
            </div>
          </Link>
        </div>
      )}
    </>
  );
}
