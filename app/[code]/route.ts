// app/[code]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ code: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const resolvedParams = await params;
    const code = resolvedParams?.code;

    if (!code) {
      return new NextResponse("Missing code param", { status: 400 });
    }

    // `?debug=1` → show JSON instead of redirect
    if (req.nextUrl.searchParams.get("debug") === "1") {
      const debugLink = await prisma.link.findUnique({
        where: { code },
      });

      if (!debugLink) {
        return NextResponse.json(
          { message: "Code not found in DB", code },
          { status: 404 }
        );
      }

      return NextResponse.json({
        message: "Reached redirect handler",
        code,
        targetUrl: debugLink.targetUrl,
      });
    }

    // Normal redirect flow
    const link = await prisma.link.findUnique({
      where: { code },
    });

    if (link?.expiresAt && new Date() > link.expiresAt) {
      const errorUrl = new URL("/link-not-found", req.nextUrl.origin);
      errorUrl.searchParams.set("code", code);
      errorUrl.searchParams.set("reason", "expired");
      return NextResponse.redirect(errorUrl, { status: 302 });
    }

    if (!link) {
      const errorUrl = new URL("/link-not-found", req.nextUrl.origin);
      errorUrl.searchParams.set("code", code);
      errorUrl.searchParams.set("reason", "not_found");
      return NextResponse.redirect(errorUrl, { status: 302 });
    }

    // Validate URL string
    try {
      new URL(link.targetUrl);
    } catch {
      return new NextResponse("Invalid target URL stored", { status: 400 });
    }

    // Update stats
    await prisma.link.update({
      where: { code },
      data: {
        totalClicks: { increment: 1 },
        lastClickedAt: new Date(),
      },
    });

    // Redirect to destination
    return NextResponse.redirect(link.targetUrl, { status: 302 });
  } catch (err: any) {
    console.error("REDIRECT ERROR /[code]:", err);
    return NextResponse.json(
      { error: String(err?.message || err) },
      { status: 500 }
    );
  }
}
