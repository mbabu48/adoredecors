import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions, isAdminEmail } from "@/lib/auth";
import { deleteImage } from "@/lib/cloudinary";

const PatchSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  eventType: z.string().optional(),
  featured: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
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
    const row = await prisma.galleryItem.update({ where: { id: params.id }, data });
    return NextResponse.json({ ok: true, row });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const row = await prisma.galleryItem.findUnique({ where: { id: params.id } });
  if (row?.publicId) await deleteImage(row.publicId);
  await prisma.galleryItem.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
