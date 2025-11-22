// app/healthz/route.ts
export async function GET() {
  return Response.json({
    ok: true,
    version: "1.0",
  });
}
