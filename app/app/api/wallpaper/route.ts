import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { NextRequest } from "next/server";

const WALLPAPER_DIR = join(process.cwd(), "public", "wallpaper");

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return Response.json({ error: "No file" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = file.name.split(".").pop();
  const filename = `wallpaper.${ext}`;

  await writeFile(join(WALLPAPER_DIR, filename), buffer);

  return Response.json({ url: `./wallpaper/${filename}` });
}

export async function DELETE() {
  const files = ["wallpaper.jpg", "wallpaper.png", "wallpaper.webp"];
  for (const f of files) {
    try {
      await unlink(join(WALLPAPER_DIR, f));
    } catch {}
  }
  return Response.json({ ok: true });
}
