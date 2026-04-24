import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions, isAdminEmail } from "@/lib/auth";

const CreateSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  phone: z.string().min(5).max(30),
  eventType: z.string().min(1),
  eventDate: z.string().optional(),
  guestCount: z.number().int().min(1).max(10000).optional(),
  venueSize: z.string().optional(),
  message: z.string().min(3).max(4000),
  estimatedCost: z.number().int().optional(),
  source: z.enum(["contact", "pricing", "footer"]).default("contact"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CreateSchema.parse(body);
    const inquiry = await prisma.inquiry.create({
      data: {
        ...parsed,
        eventDate: parsed.eventDate ? new Date(parsed.eventDate) : null,
      },
    });
    return NextResponse.json({ ok: true, id: inquiry.id });
  } catch (e: any) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: e.errors }, { status: 400 });
    }
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Admin-only list
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !isAdminEmail(session.user?.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const rows = await prisma.inquiry.findMany({ orderBy: { createdAt: "desc" }, take: 500 });
  return NextResponse.json({ rows });
}
