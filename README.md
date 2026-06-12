# Roby De Vera — Portfolio

Dark, cinematic portfolio for a video editor. Built with Next.js (App Router), TypeScript, Tailwind CSS v4, React Three Fiber and GSAP.

## Quick start

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # production build
npm start         # serve production build
```

## Stack

| Layer      | Tech                                          |
| ---------- | --------------------------------------------- |
| Framework  | Next.js 16 (App Router) + TypeScript          |
| Styling    | Tailwind CSS v4 (theme lives in CSS, see below) |
| 3D / WebGL | three + @react-three/fiber + @react-three/drei |
| Animation  | GSAP + ScrollTrigger via @gsap/react           |
| Fonts      | Inter (body) + Syne (display) via next/font    |

## Project structure

```
app/
  page.tsx                 Home (hero + featured work + capabilities + CTA)
  portfolio/page.tsx       All 10 projects
  portfolio/[slug]/page.tsx  Project detail (video embed, role, tools)
  contact/page.tsx         Contact form + email + socials
  template.tsx             GSAP page-transition fade on every route change
  sitemap.ts / robots.ts   SEO
  opengraph-image.tsx      Auto-generated OG card (PNG at build)
components/
  Header.tsx / Footer.tsx
  Hero.tsx                 Hero text reveal + mounts the WebGL canvas
  webgl/HeroCanvas.tsx     R3F particle field (the WebGL layer)
  ProjectGrid.tsx          Scroll-triggered grid entrance
  ProjectCard.tsx          Thumbnail + hover video preview
  VideoEmbed.tsx           YouTube / Vimeo / self-hosted player
  ContactForm.tsx          Formspree with mailto fallback
data/
  projects.ts              ← ALL project content lives here
lib/
  gsap.ts                  Single place GSAP plugins are registered
  usePrefersReducedMotion.ts
public/
  thumbs/                  Placeholder SVG thumbnails (replace with stills)
  videos/                  Drop self-hosted MP4s + hover previews here
```

## Adding / editing projects

Everything is one typed array: [data/projects.ts](data/projects.ts).

```ts
{
  id: "my-new-cut",            // becomes the URL: /portfolio/my-new-cut
  title: "My New Cut",
  year: "2026",
  client: "Client Name",
  thumbnail: "/thumbs/my-new-cut.jpg",   // 16:9, put the file in public/thumbs
  previewUrl: "/videos/my-new-cut-preview.mp4", // optional 3–5s muted hover clip
  videoUrl: "https://www.youtube.com/watch?v=XXXX",
  type: "youtube",             // "youtube" | "vimeo" | "self-hosted"
  role: "Editor & Colorist",
  tools: ["Premiere Pro", "DaVinci Resolve"],
  description: "One or two sentences about the project.",
  featured: true,              // shows on the home page
}
```

Video URL formats per type:

- **youtube** — any `watch?v=`, `youtu.be/` or `shorts/` URL
- **vimeo** — `https://vimeo.com/123456789`
- **self-hosted** — a path under `public/`, e.g. `/videos/cut.mp4` (H.264 MP4 recommended; the thumbnail doubles as the poster)

### Replacing placeholder media

1. Thumbnails: drop 16:9 JPG/WebP files into `public/thumbs/` and update the `thumbnail` paths. Once no SVG thumbnails remain you can delete `images.dangerouslyAllowSVG` from [next.config.ts](next.config.ts).
2. Hover previews: short (3–5s), muted, heavily compressed MP4s into `public/videos/`, set `previewUrl`. Cards without `previewUrl` fall back to a zoom-on-hover still.
3. Self-hosted full videos: also `public/videos/`. For anything long, prefer YouTube/Vimeo — static hosting of large MP4s gets expensive.
4. Social links: edit the `socials` arrays in [components/Footer.tsx](components/Footer.tsx) and [app/contact/page.tsx](app/contact/page.tsx).

## Contact form

Two modes, switched by an env var:

- **Formspree** (recommended): create a form at formspree.io, copy the ID, set `NEXT_PUBLIC_FORMSPREE_ID` (see `.env.example`).
- **No env var set**: the form opens the visitor's mail client (mailto) pre-filled with their message.

## Theme / colors

Tailwind v4 — there is **no tailwind.config file**; the theme lives in [app/globals.css](app/globals.css):

```css
@theme {
  --color-base: #0e0e0e;     /* page background  */
  --color-surface: #15130f;  /* cards, media bg  */
  --color-ink: #f5f1ea;      /* text             */
  --color-muted: #97907f;    /* secondary text   */
  --color-accent: #c47b5a;   /* terracotta       */
  --color-line: #28241f;     /* borders          */
}
```

Change a value and every `bg-base`, `text-accent`, `border-line`, etc. updates.

## Tweaking the WebGL hero

[components/webgl/HeroCanvas.tsx](components/webgl/HeroCanvas.tsx):

- **Particle count** — bottom of file: `count={isMobile ? 450 : 1400}`
- **Drift speed** — vertex shader: `float t = uTime * 0.12;` (higher = faster)
- **Mouse parallax strength** — `mix(0.08, 0.5, depth)` ranges
- **Brightness** — fragment shader: the `* 0.55` alpha multiplier
- **Accent ratio** — `smoothstep(0.62, 0.95, vMix)` (lower first number = more terracotta particles)

Built-in safeguards: render loop pauses when the hero scrolls out of view (IntersectionObserver), DPR is capped, mobile gets fewer particles and no pointer tracking, and R3F disposes the renderer/scene on unmount.

## Tweaking GSAP animations

- Hero text reveal: [components/Hero.tsx](components/Hero.tsx) (timeline durations/stagger)
- Grid entrances: [components/ProjectGrid.tsx](components/ProjectGrid.tsx) (`start: "top 88%"`, `y: 56`)
- Page transitions: [app/template.tsx](app/template.tsx)

All animation blocks run inside `gsap.matchMedia()` keyed on `prefers-reduced-motion`, so reduced-motion users get static content and no WebGL canvas (a CSS gradient renders instead).

## Environment variables

Copy `.env.example` to `.env.local`:

| Var                        | Purpose                                  |
| -------------------------- | ---------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`     | Canonical URL for SEO/sitemap/OG         |
| `NEXT_PUBLIC_FORMSPREE_ID` | Enables the contact form's POST mode     |

## Deploying

Standard Next.js — deploys to Vercel with zero config. Set the two env vars in the dashboard. Any Node host running `npm run build && npm start` also works.
