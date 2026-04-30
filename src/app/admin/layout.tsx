import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions, isAdminEmail } from "@/lib/auth";
import AdminSidebar from "@/components/AdminSidebar";

export const metadata = { title: "Admin · Adore Decors" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || !isAdminEmail(session.user?.email)) {
    redirect("/admin-signin");
  }

  return (
    <div className="min-h-screen flex bg-ivory">
      <AdminSidebar userName={session.user?.name || session.user?.email || "Admin"} />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
