export async function GET() {
  // Отдаём токен и URL клиенту
  // SUPERVISOR_TOKEN доступен только на сервере
  return Response.json({
    url: "http://supervisor/core",
    token: process.env.SUPERVISOR_TOKEN,
  });
}
