import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions, isAdminEmail } from "@/lib/auth";

const CreateSchema = z.object({
  inquiryId: z.string().optional(),
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(5),
  eventType: z.string(),
  eventDate: z.string(),
  venueAddress: z.string().optional(),
  guestCount: z.number().int(),
  totalAmount: z.number().int(),
  advancePaid: z.number().int().default(0),
  status: z.enum(["confirmed", "in_progress", "delivered", "cancelled"]).default("confirmed"),
  notes: z.string().optional(),
});

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || !isAdminEmail(session.user?.email)) return null;
  return session;
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const rows = await prisma.order.findMany({ orderBy: { eventDate: "asc" }, take: 500 });
  return NextResponse.json({ rows });
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const data = CreateSchema.parse(await req.json());
    const row = await prisma.order.create({
      data: { ...data, eventDate: new Date(data.eventDate) },
    });
    return NextResponse.json({ ok: true, row });
  } catch (e: any) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: e.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
