// app/api/links/[code]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/links/:code
export async function GET(
  req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const resolvedParams = await params;
    const link = await prisma.link.findUnique({
      where: { code: resolvedParams.code },
    });

    if (!link) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (link.expiresAt && new Date() > link.expiresAt) {
      return NextResponse.json({ error: "Link expired" }, { status: 410 });
    }

    return NextResponse.json(link);
  } catch (err: any) {
    console.error("GET /api/links/[code] error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/links/:code
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const resolvedParams = await params;
    const exists = await prisma.link.findUnique({
      where: { code: resolvedParams.code },
    });

    if (!exists) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.link.delete({
      where: { code: resolvedParams.code },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("DELETE /api/links/[code] error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
