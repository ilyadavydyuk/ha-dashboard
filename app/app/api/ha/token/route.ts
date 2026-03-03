export async function GET(request: Request) {
  const host = request.headers.get("host") || "";
  const proto = request.headers.get("x-forwarded-proto") || "https";

  return Response.json({
    url: `${proto}://${host}`,
  });
}
