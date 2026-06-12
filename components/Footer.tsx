import Link from "next/link";

const socials = [
  { label: "Instagram", href: "https://instagram.com/" },
  { label: "YouTube", href: "https://youtube.com/" },
  { label: "Vimeo", href: "https://vimeo.com/" },
  { label: "LinkedIn", href: "https://linkedin.com/" },
];

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-muted">
            Let&apos;s cut something
          </p>
          <a
            href="mailto:devera.roby2304@gmail.com"
            className="mt-3 inline-block font-display text-2xl font-bold tracking-tight transition-colors hover:text-accent md:text-4xl"
          >
            devera.roby2304@gmail.com
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
