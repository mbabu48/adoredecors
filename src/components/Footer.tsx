"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Instagram, Facebook, Phone, Mail, MapPin } from "lucide-react";
import { site } from "@/lib/site";

export default function Footer() {
  const path = usePathname();
  if (path?.startsWith("/admin")) return null;

  return (
    <footer className="bg-burgundy text-cream mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid gap-10 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <div className="font-serif text-xl mb-1">{site.name}</div>
          <div className="text-[11px] text-blush tracking-[0.2em] uppercase mb-4">{site.tagline}</div>
          <p className="text-[13px] text-cream/80 leading-relaxed">{site.description}</p>
        </div>

        <div>
          <h4 className="text-[11px] tracking-[0.2em] uppercase text-blush mb-3">Explore</h4>
          <ul className="space-y-2 text-[13px] text-cream/90">
            <li><Link href="/gallery" className="hover:text-blush">Gallery</Link></li>
            <li><Link href="/pricing" className="hover:text-blush">Pricing</Link></li>
            <li><Link href="/feedback" className="hover:text-blush">Reviews</Link></li>
            <li><Link href="/contact" className="hover:text-blush">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[11px] tracking-[0.2em] uppercase text-blush mb-3">Reach Us</h4>
          <ul className="space-y-2 text-[13px] text-cream/90">
            <li className="flex gap-2 items-start"><Phone size={14} className="mt-0.5 text-blush" /><a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a></li>
            <li className="flex gap-2 items-start"><Mail size={14} className="mt-0.5 text-blush" /><a href={`mailto:${site.email}`}>{site.email}</a></li>
            <li className="flex gap-2 items-start"><MapPin size={14} className="mt-0.5 text-blush" /><span>{site.address}</span></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[11px] tracking-[0.2em] uppercase text-blush mb-3">Follow</h4>
          <div className="flex gap-3">
            <a href={site.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"
               className="w-9 h-9 rounded-full border border-blush/50 flex items-center justify-center hover:bg-blush/10">
              <Instagram size={16} />
            </a>
            <a href={site.facebook} target="_blank" rel="noreferrer" aria-label="Facebook"
               className="w-9 h-9 rounded-full border border-blush/50 flex items-center justify-center hover:bg-blush/10">
              <Facebook size={16} />
            </a>
          </div>
          <p className="text-[11px] text-cream/60 mt-6">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
