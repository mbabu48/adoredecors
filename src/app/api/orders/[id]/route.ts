import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions, isAdminEmail } from "@/lib/auth";

const PatchSchema = z.object({
  status: z.enum(["confirmed", "in_progress", "delivered", "cancelled"]).optional(),
  advancePaid: z.number().int().min(0).optional(),
  notes: z.string().max(4000).optional(),
});

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || !isAdminEmail(session.user?.email)) return null;
  return session;
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const data = PatchSchema.parse(await req.json());
    const row = await prisma.order.update({ where: { id: params.id }, data });
    return NextResponse.json({ ok: true, row });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
