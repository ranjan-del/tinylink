import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/auth";

// POST /api/links  -> create link (guest or logged-in)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { targetUrl, code } = body as { targetUrl?: string; code?: string };

    if (!targetUrl || typeof targetUrl !== "string") {
      return NextResponse.json(
        { error: "targetUrl is required" },
        { status: 400 }
      );
    }

    if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
      return NextResponse.json(
        { error: "URL must start with http:// or https://" },
        { status: 400 }
      );
    }

    let finalCode = code?.trim();
    if (finalCode && !/^[A-Za-z0-9]{6,8}$/.test(finalCode)) {
      return NextResponse.json(
        { error: "Custom code must be 6–8 alphanumeric characters." },
        { status: 400 }
      );
    }

    // If no custom code, generate a random one
    if (!finalCode) {
      finalCode = Math.random().toString(36).slice(2, 8);
    }

    // Ensure code is unique
    const existing = await prisma.link.findUnique({
      where: { code: finalCode },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Code already exists, please choose another." },
        { status: 409 }
      );
    }

    // Ownership & expiry
    const user = session?.user;
    let userId: string | undefined = undefined;
    let isAnonymous = true;
    let expiresAt: Date | undefined = undefined;

    if (user?.id) {
      userId = user.id;
      isAnonymous = false;
    } else {
      // guest: expire in 30 days
      expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }

    const link = await prisma.link.create({
      data: {
        code: finalCode,
        targetUrl,
        userId,
        isAnonymous,
        expiresAt,
      },
    });

    return NextResponse.json(link, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/links error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Internal error" },
      { status: 500 }
    );
  }
}

// GET /api/links  -> only return links for logged-in user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      // Guest: they don't get a history table
      return NextResponse.json([]);
    }

    const links = await prisma.link.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(links);
  } catch (err: any) {
    console.error("GET /api/links error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Internal error" },
      { status: 500 }
    );
  }
}
