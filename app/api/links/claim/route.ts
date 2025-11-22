import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/auth";

// POST /api/links/claim
// Body: { codes: string[] }
// Moves anonymous links into the logged-in user's account
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const codes = (body?.codes ?? []) as string[];

    if (!Array.isArray(codes) || codes.length === 0) {
      return NextResponse.json(
        { error: "No codes provided" },
        { status: 400 }
      );
    }

    await prisma.link.updateMany({
      where: {
        code: { in: codes },
        isAnonymous: true,
      },
      data: {
        userId: session.user.id,
        isAnonymous: false,
        expiresAt: null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("POST /api/links/claim error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Internal error" },
      { status: 500 }
    );
  }
}
