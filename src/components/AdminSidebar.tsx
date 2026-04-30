"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Inbox,
  Calendar,
  Image as ImageIcon,
  Star,
  LogOut,
  Home,
} from "lucide-react";
import { useState } from "react";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/inquiries", label: "Inquiries", icon: Inbox },
  { href: "/admin/orders", label: "Orders", icon: Calendar },
  { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/admin/feedback", label: "Feedback", icon: Star },
];

export default function AdminSidebar({ userName }: { userName: string }) {
  const path = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-30 bg-burgundy text-cream p-3 flex items-center justify-between">
        <span className="font-serif">Adore Decors · Admin</span>
        <button onClick={() => setMobileOpen((v) => !v)} className="text-[12px]">
          {mobileOpen ? "Close" : "Menu"}
        </button>
      </div>

      <aside
        className={`${
          mobileOpen ? "fixed inset-0 z-20 pt-14" : "hidden"
        } md:sticky md:top-0 md:block md:w-60 md:h-screen bg-burgundy text-cream flex-shrink-0`}
      >
        <div className="p-5 border-b border-burgundy-dark hidden md:block">
          <div className="font-serif text-lg">Adore Decors</div>
          <div className="text-[10px] text-blush tracking-[0.18em] uppercase">Admin Suite</div>
        </div>
        <nav className="p-3 space-y-1">
          {nav.map((n) => {
            const active = path === n.href || (n.href !== "/admin" && path?.startsWith(n.href));
            const Icon = n.icon;
            return (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded text-[13px] transition-colors ${
                  active ? "bg-burgundy-dark text-blush" : "text-cream/90 hover:bg-burgundy-dark"
                }`}
              >
                <Icon size={15} />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 inset-x-0 p-3 border-t border-burgundy-dark bg-burgundy">
          <div className="text-[11px] text-blush mb-1 truncate">{userName}</div>
          <div className="flex gap-2">
            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-1 py-2 bg-burgundy-dark rounded text-[11px]"
            >
              <Home size={12} /> Site
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex-1 flex items-center justify-center gap-1 py-2 bg-burgundy-dark rounded text-[11px]"
            >
              <LogOut size={12} /> Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
