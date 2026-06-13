"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { formatFrames, FPS } from "@/lib/timecode";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

interface Flag {
  id: string;
  label: string;
  /** Set for flags that live on another page instead of a home section */
  route?: string;
}

const FLAGS: Flag[] = [
  { id: "hero", label: "Open" },
  { id: "work", label: "Selects" },
  { id: "about", label: "About" },
  { id: "tracks", label: "Tracks" },
  { id: "contact", label: "Contact", route: "/contact" },
];

const SECTION_IDS = FLAGS.filter((f) => !f.route).map((f) => f.id);

function activeFromPath(pathname: string): string | null {
  if (pathname.startsWith("/portfolio")) return "work";
  if (pathname.startsWith("/contact")) return "contact";
  return null;
}

/**
 * Fixed timeline strip at the bottom of the viewport. The playhead tracks
 * scroll progress; flag markers jump to page sections (or route to other
 * pages), NLE-marker style. Scroll-linked, so it stays active under
 * reduced motion (only the scroll behavior switches to instant).
 */
export default function ScrollPlayhead() {
  const pathname = usePathname();
  const router = useRouter();
  const reducedMotion = usePrefersReducedMotion();
  const isHome = pathname === "/";

  const playhead = useRef<HTMLDivElement>(null);
  const timecode = useRef<HTMLSpanElement>(null);
  const flagEls = useRef<(HTMLButtonElement | null)[]>([]);
  const [sectionInView, setSectionInView] = useState<string | null>(null);
  // On the home page the IntersectionObserver drives the active flag;
  // elsewhere it's derived straight from the route.
  const active = isHome ? sectionInView : activeFromPath(pathname);

  // Playhead + timecode follow scroll (direct DOM writes, no re-renders).
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      if (playhead.current) {
        playhead.current.style.left = `${progress * 100}%`;
      }
      if (timecode.current) {
        timecode.current.textContent = formatFrames(progress * 60 * FPS);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  // Position flags: on the home page at each section's real scroll fraction
  // (like markers at their timecodes); elsewhere, spaced evenly.
  useEffect(() => {
    const place = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      FLAGS.forEach((flag, i) => {
        const el = flagEls.current[i];
        if (!el) return;
        let fraction = (i + 0.5) / FLAGS.length;
        if (isHome && max > 0) {
          if (flag.route) {
            fraction = 1;
          } else {
            const section = document.getElementById(flag.id);
            if (section) {
              // Match where scrollIntoView actually rests: the section's
              // document top minus its scroll-margin-top. Using the same
              // scrollY basis as the playhead keeps the two in lockstep.
              const scrollMarginTop = parseFloat(
                getComputedStyle(section).scrollMarginTop
              ) || 0;
              const top =
                section.getBoundingClientRect().top +
                window.scrollY -
                scrollMarginTop;
              fraction = Math.min(Math.max(top / max, 0), 1);
            }
          }
        }
        el.style.left = `${fraction * 100}%`;
      });
    };
    place();
    window.addEventListener("resize", place, { passive: true });
    // Layout can shift after fonts/images load.
    const settle = window.setTimeout(place, 600);
    return () => {
      window.removeEventListener("resize", place);
      window.clearTimeout(settle);
    };
  }, [isHome, pathname]);

  // Track which home section is in view.
  useEffect(() => {
    if (!isHome) return;
    const sections = SECTION_IDS.map((id) =>
      document.getElementById(id)
    ).filter((el): el is HTMLElement => el !== null);
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setSectionInView(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [isHome, pathname]);

  const onFlagClick = (flag: Flag) => {
    if (flag.route) {
      if (pathname !== flag.route) router.push(flag.route);
      return;
    }
    if (isHome) {
      document.getElementById(flag.id)?.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
      });
    } else {
      router.push(`/#${flag.id}`);
    }
  };

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 h-8 border-t border-line bg-base/85 backdrop-blur-sm"
      aria-label="Section timeline navigation"
    >
      <div className="ruler absolute inset-0 opacity-60" aria-hidden="true" />
      <div
        ref={playhead}
        className="pointer-events-none absolute bottom-0 top-0 w-px bg-accent"
        style={{ left: "0%" }}
        aria-hidden="true"
      >
        <span className="absolute -left-[3px] top-0 h-[7px] w-[7px] bg-accent" />
      </div>

      {FLAGS.map((flag, i) => {
        const isActive = active === flag.id;
        return (
          <button
            key={flag.id}
            ref={(el) => {
              flagEls.current[i] = el;
            }}
            onClick={() => onFlagClick(flag)}
            aria-label={`Go to ${flag.label}`}
            aria-current={isActive ? "true" : undefined}
            className="group absolute bottom-0 top-0 w-8 -translate-x-1/2 cursor-pointer"
            style={{ left: `${((i + 0.5) / FLAGS.length) * 100}%` }}
          >
            {/* Marker pole */}
            <span
              className={`absolute bottom-0 left-1/2 top-0 w-px transition-colors ${
                isActive ? "bg-accent" : "bg-ink/25 group-hover:bg-ink/60"
              }`}
            />
            {/* Flag pennant */}
            <span
              className={`absolute left-1/2 top-[2px] h-[6px] w-[8px] transition-colors [clip-path:polygon(0_0,100%_0,70%_50%,100%_100%,0_100%)] ${
                isActive ? "bg-accent" : "bg-muted/60 group-hover:bg-ink"
              }`}
            />
            {/* Hover label */}
            <span
              className={`pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap border border-line bg-base/95 px-2 py-1 text-[9px] uppercase tracking-[0.2em] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 ${
                isActive ? "text-accent" : "text-ink"
              }`}
            >
              {flag.label}
            </span>
          </button>
        );
      })}

      <span className="absolute left-3 top-1/2 hidden -translate-y-1/2 text-[10px] uppercase tracking-[0.25em] text-muted lg:block">
        Timeline
      </span>
      <span
        ref={timecode}
        className="absolute right-3 top-1/2 hidden -translate-y-1/2 bg-base/70 px-1 text-[10px] tabular-nums tracking-[0.15em] text-muted lg:block"
      >
        00:00:00:00
      </span>
    </nav>
  );
}
