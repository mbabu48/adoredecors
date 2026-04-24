import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const CreateSchema = z.object({
  name: z.string().min(1).max(120),
  eventType: z.string().optional(),
  rating: z.number().int().min(1).max(5),
  message: z.string().min(5).max(2000),
});

export async function POST(req: NextRequest) {
  try {
    const parsed = CreateSchema.parse(await req.json());
    await prisma.feedback.create({ data: { ...parsed, approved: false } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
