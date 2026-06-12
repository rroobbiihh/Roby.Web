import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Roby De Vera for editing, color and motion work.",
};

const socials = [
  { label: "Instagram", href: "https://instagram.com/" },
  { label: "YouTube", href: "https://youtube.com/" },
  { label: "Vimeo", href: "https://vimeo.com/" },
  { label: "LinkedIn", href: "https://linkedin.com/" },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-36 md:pb-36 md:pt-44">
      <div className="mb-16 md:mb-24">
        <p className="text-sm uppercase tracking-[0.3em] text-muted">
          Contact
        </p>
        <h1 className="mt-4 font-display text-5xl font-extrabold tracking-tight md:text-8xl">
          Let&apos;s talk<span className="text-accent">.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
          Booking edits, grades and full post-production. Tell me about the
          project, the deadline, and what the footage looks like.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-16 md:grid-cols-5">
        <div className="md:col-span-3">
          <ContactForm />
        </div>

        <aside className="flex flex-col gap-10 md:col-span-2">
          <div>
            <h2 className="text-sm uppercase tracking-widest text-muted">
              Email
            </h2>
            <a
              href="mailto:devera.roby2304@gmail.com"
              className="mt-3 inline-block font-display text-xl font-bold break-all transition-colors hover:text-accent md:text-2xl"
            >
              devera.roby2304@gmail.com
            </a>
          </div>
          <div>
            <h2 className="text-sm uppercase tracking-widest text-muted">
              Elsewhere
            </h2>
            <ul className="mt-3 flex flex-col gap-2">
              {socials.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted transition-colors hover:text-accent"
                  >
                    {label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
