"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { site } from "@/lib/site";

const nav = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Gallery" },
  { href: "/pricing", label: "Pricing" },
  { href: "/feedback", label: "Reviews" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  // Hide on admin pages
  if (path?.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur border-b border-sand">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link href="/" className="leading-tight">
          <div className="font-serif text-lg sm:text-xl text-burgundy tracking-wide">{site.name}</div>
          <div className="text-[10px] sm:text-[11px] text-rose tracking-[0.2em] uppercase">
            {site.tagline}
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-[13px] text-burgundy">
          {nav.map((n) => {
            const active = path === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`transition-colors hover:text-rose ${
                  active ? "border-b-2 border-rose pb-1" : ""
                }`}
              >
                {n.label}
              </Link>
            );
          })}
          <Link
            href="/contact"
            className="bg-burgundy text-cream px-4 py-2 rounded-sm text-[13px] hover:bg-burgundy-dark transition-colors"
          >
            Get a Quote
          </Link>
        </nav>

        <button
          className="md:hidden text-burgundy"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-sand bg-cream">
          <div className="px-4 py-3 flex flex-col gap-3 text-[14px]">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={path === n.href ? "text-rose" : "text-burgundy"}
                onClick={() => setOpen(false)}
              >
                {n.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="bg-burgundy text-cream px-4 py-2 rounded-sm text-center mt-2"
            >
              Get a Quote
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
