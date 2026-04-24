import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, isAdminEmail } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const PatchSchema = z.object({
  status: z.enum(["new", "followup", "booked", "closed"]).optional(),
  notes: z.string().max(4000).optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !isAdminEmail(session.user?.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = PatchSchema.parse(await req.json());
    const row = await prisma.inquiry.update({ where: { id: params.id }, data });
    return NextResponse.json({ ok: true, row });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
