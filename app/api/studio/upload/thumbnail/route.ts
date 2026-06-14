import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const WRITES_ENABLED =
  process.env.NODE_ENV === "development" ||
  process.env.STUDIO_WRITE === "true";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

export async function POST(req: Request) {
  if (!WRITES_ENABLED) {
    return NextResponse.json(
      {
        error:
          "File writes are disabled on this deployment. Save your thumbnail manually as public/thumbs/{slug}.jpg, commit and redeploy.",
      },
      { status: 403 }
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "Expected multipart form data" },
      { status: 400 }
    );
  }

  const file = form.get("file");
  const slug = form.get("slug");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (typeof slug !== "string" || !slug || !/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: "Invalid project slug" }, { status: 400 });
  }
  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: "Use a JPEG, PNG or WebP image" },
      { status: 400 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Image too large (max 8MB)" },
      { status: 400 }
    );
  }

  const thumbsDir = path.join(process.cwd(), "public", "thumbs");
  await mkdir(thumbsDir, { recursive: true });

  const filename = `${slug}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(thumbsDir, filename), buffer);

  return NextResponse.json({ ok: true, path: `/thumbs/${filename}` });
}
