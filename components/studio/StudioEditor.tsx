"use client";

import { useEffect, useState } from "react";
import type { Project, ProjectType } from "@/data/projects";
import type { SiteContent } from "@/lib/content";

const STUDIO_KEY = process.env.NEXT_PUBLIC_STUDIO_KEY;

const inputCls =
  "w-full border-b border-line bg-transparent py-2 text-sm outline-none transition-colors focus:border-accent";
const labelCls = "text-[10px] uppercase tracking-[0.2em] text-muted";
const btnCls =
  "border border-line px-4 py-2 text-xs uppercase tracking-widest transition-colors hover:border-accent hover:text-accent disabled:opacity-40";
const smallBtnCls =
  "border border-line px-2 py-1 text-[10px] uppercase tracking-widest transition-colors hover:border-accent hover:text-accent disabled:opacity-30";

type Status = "idle" | "saving" | "saved" | "error";

function download(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2) + "\n"], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function Field({
  label,
  value,
  onChange,
  area = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  area?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className={labelCls}>{label}</span>
      {area ? (
        <textarea
          value={value}
          rows={3}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputCls} resize-y`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputCls}
        />
      )}
    </label>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-line p-6">
      <h2 className="mb-6 font-display text-xl font-bold tracking-tight">
        {title}
        <span className="text-accent">.</span>
      </h2>
      <div className="flex flex-col gap-5">{children}</div>
    </section>
  );
}

function newProject(): Project {
  return {
    id: "new-project",
    title: "New Project",
    year: String(new Date().getFullYear()),
    client: "",
    thumbnail: "/thumbs/project-01.svg",
    videoUrl: "https://www.youtube.com/watch?v=XXXX",
    type: "youtube",
    duration: "01:00",
    role: "Editor",
    tools: ["Premiere Pro"],
    description: "",
    featured: false,
  };
}

export default function StudioEditor({
  initialContent,
  initialProjects,
}: {
  initialContent: SiteContent;
  initialProjects: Project[];
}) {
  const [unlocked, setUnlocked] = useState(!STUDIO_KEY);
  const [keyInput, setKeyInput] = useState("");
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const touch = () => {
    setDirty(true);
    setStatus("idle");
  };

  const patchContent = (fn: (c: SiteContent) => SiteContent) => {
    setContent((c) => fn(structuredClone(c)));
    touch();
  };

  const patchProject = (index: number, patch: Partial<Project>) => {
    setProjects((ps) =>
      ps.map((p, i) => (i === index ? { ...p, ...patch } : p))
    );
    touch();
  };

  const moveProject = (index: number, dir: -1 | 1) => {
    setProjects((ps) => {
      const next = [...ps];
      const target = index + dir;
      if (target < 0 || target >= next.length) return ps;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    touch();
  };

  const removeProject = (index: number) => {
    if (!window.confirm(`Delete "${projects[index].title}"?`)) return;
    setProjects((ps) => ps.filter((_, i) => i !== index));
    touch();
  };

  async function save() {
    setStatus("saving");
    setErrorMsg("");
    try {
      const res = await fetch("/api/studio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, projects }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setStatus("saved");
      setDirty(false);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Save failed");
    }
  }

  if (!unlocked) {
    return (
      <div className="mx-auto flex min-h-svh max-w-sm flex-col justify-center px-6">
        <p className={labelCls}>Studio Portal</p>
        <h1 className="mt-3 font-display text-3xl font-bold">
          Enter access key<span className="text-accent">.</span>
        </h1>
        <form
          className="mt-8 flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (keyInput === STUDIO_KEY) setUnlocked(true);
            else setErrorMsg("Wrong key.");
          }}
        >
          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            className={inputCls}
            autoFocus
          />
          <button type="submit" className={btnCls}>
            Unlock
          </button>
          {errorMsg && <p className="text-sm text-accent">{errorMsg}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 pb-24 pt-32">
      <header className="mb-10">
        <p className={labelCls}>Studio Portal — not linked anywhere</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
          Content Manager<span className="text-accent">.</span>
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
          Edit site copy and projects, then hit Save. Running locally
          (npm run dev), changes write straight to the data files and the
          site hot-reloads. On a live serverless deploy, Save is disabled —
          use Download, replace the files in <code>data/</code>, commit and
          redeploy.
        </p>
      </header>

      {/* Sticky action bar */}
      <div className="sticky top-16 z-30 mb-10 flex flex-wrap items-center gap-3 border border-line bg-base/90 p-4 backdrop-blur-md">
        <button onClick={save} disabled={status === "saving"} className={btnCls}>
          {status === "saving" ? "Saving…" : "Save to files"}
        </button>
        <button
          onClick={() => download("content.json", content)}
          className={btnCls}
        >
          ↓ content.json
        </button>
        <button
          onClick={() => download("projects.json", projects)}
          className={btnCls}
        >
          ↓ projects.json
        </button>
        <span className="ml-auto text-xs text-muted">
          {status === "saved" && <span className="text-accent">Saved ✓</span>}
          {status === "error" && (
            <span className="text-accent">{errorMsg}</span>
          )}
          {status === "idle" && dirty && "Unsaved changes"}
        </span>
      </div>

      <div className="flex flex-col gap-8">
        <Section title="Hero">
          <Field
            label="Kicker (small line above the name)"
            value={content.hero.kicker}
            onChange={(v) =>
              patchContent((c) => ((c.hero.kicker = v), c))
            }
          />
          <Field
            area
            label="Tagline — wrap words in ** for accent color"
            value={content.hero.tagline}
            onChange={(v) =>
              patchContent((c) => ((c.hero.tagline = v), c))
            }
          />
        </Section>

        <Section title="About">
          <Field
            area
            label="Bio — wrap words in ** for accent color"
            value={content.about.bio}
            onChange={(v) => patchContent((c) => ((c.about.bio = v), c))}
          />
          <Field
            area
            label="Sub-bio"
            value={content.about.subBio}
            onChange={(v) => patchContent((c) => ((c.about.subBio = v), c))}
          />
          <div>
            <p className={`${labelCls} mb-3`}>Fact rows (label / value)</p>
            <div className="flex flex-col gap-3">
              {content.about.facts.map((fact, i) => (
                <div key={i} className="flex items-end gap-3">
                  <input
                    type="text"
                    value={fact.label}
                    onChange={(e) =>
                      patchContent(
                        (c) => ((c.about.facts[i].label = e.target.value), c)
                      )
                    }
                    className={inputCls}
                  />
                  <input
                    type="text"
                    value={fact.value}
                    onChange={(e) =>
                      patchContent(
                        (c) => ((c.about.facts[i].value = e.target.value), c)
                      )
                    }
                    className={inputCls}
                  />
                  <button
                    onClick={() =>
                      patchContent(
                        (c) => (c.about.facts.splice(i, 1), c)
                      )
                    }
                    className={smallBtnCls}
                    aria-label={`Remove fact ${fact.label}`}
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                onClick={() =>
                  patchContent(
                    (c) => (
                      c.about.facts.push({ label: "Label", value: "Value" }), c
                    )
                  )
                }
                className={`${smallBtnCls} self-start`}
              >
                + Add fact
              </button>
            </div>
          </div>
        </Section>

        <Section title="Capabilities (What I do)">
          {content.capabilities.map((cap, i) => (
            <div key={i} className="border-b border-line pb-5 last:border-0">
              <div className="mb-3 flex gap-3">
                <div className="w-20">
                  <Field
                    label="Track"
                    value={cap.track}
                    onChange={(v) =>
                      patchContent((c) => ((c.capabilities[i].track = v), c))
                    }
                  />
                </div>
                <div className="flex-1">
                  <Field
                    label="Title"
                    value={cap.title}
                    onChange={(v) =>
                      patchContent((c) => ((c.capabilities[i].title = v), c))
                    }
                  />
                </div>
              </div>
              <Field
                area
                label="Body"
                value={cap.body}
                onChange={(v) =>
                  patchContent((c) => ((c.capabilities[i].body = v), c))
                }
              />
            </div>
          ))}
        </Section>

        <Section title="Contact & Socials">
          <Field
            label="Email"
            value={content.contact.email}
            onChange={(v) => patchContent((c) => ((c.contact.email = v), c))}
          />
          <Field
            area
            label="Contact page intro"
            value={content.contact.intro}
            onChange={(v) => patchContent((c) => ((c.contact.intro = v), c))}
          />
          <Field
            label="Footer kicker"
            value={content.footer.kicker}
            onChange={(v) => patchContent((c) => ((c.footer.kicker = v), c))}
          />
          <div>
            <p className={`${labelCls} mb-3`}>Social links (label / URL)</p>
            <div className="flex flex-col gap-3">
              {content.contact.socials.map((social, i) => (
                <div key={i} className="flex items-end gap-3">
                  <input
                    type="text"
                    value={social.label}
                    onChange={(e) =>
                      patchContent(
                        (c) => (
                          (c.contact.socials[i].label = e.target.value), c
                        )
                      )
                    }
                    className={inputCls}
                  />
                  <input
                    type="text"
                    value={social.href}
                    onChange={(e) =>
                      patchContent(
                        (c) => ((c.contact.socials[i].href = e.target.value), c)
                      )
                    }
                    className={inputCls}
                  />
                  <button
                    onClick={() =>
                      patchContent((c) => (c.contact.socials.splice(i, 1), c))
                    }
                    className={smallBtnCls}
                    aria-label={`Remove ${social.label}`}
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                onClick={() =>
                  patchContent(
                    (c) => (
                      c.contact.socials.push({ label: "Label", href: "https://" }),
                      c
                    )
                  )
                }
                className={`${smallBtnCls} self-start`}
              >
                + Add social
              </button>
            </div>
          </div>
        </Section>

        <Section title={`Projects (${projects.length})`}>
          <div className="flex flex-col gap-4">
            {projects.map((p, i) => (
              <details
                key={`${p.id}-${i}`}
                className="border border-line open:bg-surface/40"
              >
                <summary className="flex cursor-pointer items-center gap-3 p-4">
                  <span className="text-xs tabular-nums text-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display font-bold">{p.title}</span>
                  {p.featured && (
                    <span className="border border-line px-2 py-0.5 text-[10px] uppercase tracking-widest text-accent">
                      Featured
                    </span>
                  )}
                  <span className="ml-auto flex gap-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        moveProject(i, -1);
                      }}
                      disabled={i === 0}
                      className={smallBtnCls}
                      aria-label="Move up"
                    >
                      ↑
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        moveProject(i, 1);
                      }}
                      disabled={i === projects.length - 1}
                      className={smallBtnCls}
                      aria-label="Move down"
                    >
                      ↓
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        removeProject(i);
                      }}
                      className={smallBtnCls}
                      aria-label="Delete project"
                    >
                      ✕
                    </button>
                  </span>
                </summary>
                <div className="flex flex-col gap-4 border-t border-line p-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field
                      label="URL slug (lowercase-with-hyphens)"
                      value={p.id}
                      onChange={(v) => patchProject(i, { id: v })}
                    />
                    <Field
                      label="Title"
                      value={p.title}
                      onChange={(v) => patchProject(i, { title: v })}
                    />
                    <Field
                      label="Year"
                      value={p.year}
                      onChange={(v) => patchProject(i, { year: v })}
                    />
                    <Field
                      label="Client"
                      value={p.client}
                      onChange={(v) => patchProject(i, { client: v })}
                    />
                    <Field
                      label="Role"
                      value={p.role}
                      onChange={(v) => patchProject(i, { role: v })}
                    />
                    <Field
                      label="Runtime (mm:ss)"
                      value={p.duration}
                      onChange={(v) => patchProject(i, { duration: v })}
                    />
                    <label className="flex flex-col gap-1">
                      <span className={labelCls}>Video type</span>
                      <select
                        value={p.type}
                        onChange={(e) =>
                          patchProject(i, {
                            type: e.target.value as ProjectType,
                          })
                        }
                        className={`${inputCls} bg-base`}
                      >
                        <option value="youtube">YouTube</option>
                        <option value="vimeo">Vimeo</option>
                        <option value="self-hosted">Self-hosted</option>
                      </select>
                    </label>
                    <Field
                      label="Video URL"
                      value={p.videoUrl}
                      onChange={(v) => patchProject(i, { videoUrl: v })}
                    />
                    <Field
                      label="Thumbnail path"
                      value={p.thumbnail}
                      onChange={(v) => patchProject(i, { thumbnail: v })}
                    />
                    <Field
                      label="Hover preview MP4 (optional)"
                      value={p.previewUrl ?? ""}
                      onChange={(v) =>
                        patchProject(i, { previewUrl: v || undefined })
                      }
                    />
                    <Field
                      label="Tools (comma-separated)"
                      value={p.tools.join(", ")}
                      onChange={(v) =>
                        patchProject(i, {
                          tools: v
                            .split(",")
                            .map((t) => t.trim())
                            .filter(Boolean),
                        })
                      }
                    />
                    <label className="flex items-center gap-3 self-end pb-2">
                      <input
                        type="checkbox"
                        checked={!!p.featured}
                        onChange={(e) =>
                          patchProject(i, { featured: e.target.checked })
                        }
                        className="h-4 w-4 accent-[#c47b5a]"
                      />
                      <span className={labelCls}>Featured on home</span>
                    </label>
                  </div>
                  <Field
                    area
                    label="Description"
                    value={p.description}
                    onChange={(v) => patchProject(i, { description: v })}
                  />
                </div>
              </details>
            ))}
            <button
              onClick={() => {
                setProjects((ps) => [...ps, newProject()]);
                touch();
              }}
              className={`${btnCls} self-start`}
            >
              + Add project
            </button>
          </div>
        </Section>
      </div>
    </div>
  );
}
