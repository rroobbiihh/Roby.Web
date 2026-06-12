import Link from "next/link";
import { content } from "@/lib/content";

const socials = content.contact.socials;

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-muted">
            {content.footer.kicker}
          </p>
          <a
            href={`mailto:${content.contact.email}`}
            className="mt-3 inline-block font-display text-2xl font-bold tracking-tight transition-colors hover:text-accent md:text-4xl"
          >
            {content.contact.email}
          </a>
        </div>

        <div className="flex flex-col gap-6 md:items-end">
          <ul className="flex flex-wrap gap-6">
            {socials.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm uppercase tracking-widest text-muted transition-colors hover:text-accent"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} Roby De Vera ·{" "}
            <Link href="/" className="transition-colors hover:text-accent">
              robydevera.com
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
