import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

/**
 * Persists portal edits to data/content.json and data/projects.json.
 * File writes only make sense where the filesystem is writable and the
 * dev server (or a self-hosted node process) will pick them up — so this
 * is enabled in development, or in production only with STUDIO_WRITE=true.
 * On serverless hosts, use the portal's Download buttons instead.
 */
const WRITES_ENABLED =
  process.env.NODE_ENV === "development" ||
  process.env.STUDIO_WRITE === "true";

const SLUG_RE = /^[a-z0-9-]+$/;
const PROJECT_TYPES = new Set(["youtube", "vimeo", "self-hosted"]);

function isStr(v: unknown): v is string {
  return typeof v === "string";
}

function validate(body: unknown): string[] {
  const errors: string[] = [];
  const b = body as Record<string, unknown>;
  if (!b || typeof b !== "object") return ["Body must be a JSON object"];

  const c = b.content as Record<string, Record<string, unknown>> | undefined;
  if (!c || typeof c !== "object") {
    errors.push("content: missing");
  } else {
    if (!isStr(c.hero?.kicker) || !isStr(c.hero?.tagline))
      errors.push("content.hero: kicker/tagline must be strings");
    if (!isStr(c.about?.bio) || !isStr(c.about?.subBio))
      errors.push("content.about: bio/subBio must be strings");
    if (!Array.isArray(c.about?.facts))
      errors.push("content.about.facts: must be an array");
    if (!Array.isArray(c.capabilities))
      errors.push("content.capabilities: must be an array");
    if (!isStr(c.contact?.email) || !c.contact.email.includes("@"))
      errors.push("content.contact.email: must be an email");
    if (!Array.isArray(c.contact?.socials))
      errors.push("content.contact.socials: must be an array");
    if (!isStr(c.footer?.kicker))
      errors.push("content.footer.kicker: must be a string");
  }

  const projects = b.projects as Record<string, unknown>[] | undefined;
  if (!Array.isArray(projects) || projects.length === 0) {
    errors.push("projects: must be a non-empty array");
  } else {
    const ids = new Set<string>();
    projects.forEach((p, i) => {
      const at = `projects[${i}]`;
      if (!isStr(p.id) || !SLUG_RE.test(p.id))
        errors.push(`${at}.id: lowercase letters, numbers, hyphens only`);
      else if (ids.has(p.id)) errors.push(`${at}.id: duplicate "${p.id}"`);
      else ids.add(p.id);
      if (!isStr(p.title) || !p.title.trim())
        errors.push(`${at}.title: required`);
      if (!PROJECT_TYPES.has(p.type as string))
        errors.push(`${at}.type: must be youtube | vimeo | self-hosted`);
      if (!isStr(p.videoUrl) || !p.videoUrl.trim())
        errors.push(`${at}.videoUrl: required`);
      if (!isStr(p.thumbnail) || !p.thumbnail.trim())
        errors.push(`${at}.thumbnail: required`);
      if (!Array.isArray(p.tools)) errors.push(`${at}.tools: must be an array`);
    });
  }

  return errors;
}

export async function POST(req: Request) {
  if (!WRITES_ENABLED) {
    return NextResponse.json(
      {
        error:
          "File writes are disabled on this deployment. Use the Download buttons, replace the files in data/, then commit and redeploy.",
      },
      { status: 403 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const errors = validate(body);
  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join("; ") }, { status: 400 });
  }

  const { content, projects } = body as {
    content: unknown;
    projects: unknown;
  };
  const dataDir = path.join(process.cwd(), "data");
  await writeFile(
    path.join(dataDir, "content.json"),
    JSON.stringify(content, null, 2) + "\n",
    "utf8"
  );
  await writeFile(
    path.join(dataDir, "projects.json"),
    JSON.stringify(projects, null, 2) + "\n",
    "utf8"
  );

  return NextResponse.json({ ok: true });
}
