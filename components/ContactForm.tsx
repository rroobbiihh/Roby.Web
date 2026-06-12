"use client";

import { useState } from "react";

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID;
const CONTACT_EMAIL = "devera.roby2304@gmail.com";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot: real users never fill this.
    if (data.get("_gotcha")) return;

    if (!FORMSPREE_ID) {
      // No form service configured — fall back to the user's mail client.
      const subject = encodeURIComponent(
        `Portfolio inquiry from ${data.get("name")}`
      );
      const body = encodeURIComponent(
        `${data.get("message")}\n\n— ${data.get("name")} (${data.get("email")})`
      );
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (!res.ok) throw new Error(`Formspree responded ${res.status}`);
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="border border-line p-8">
        <p className="font-display text-2xl font-bold">
          Message sent<span className="text-accent">.</span>
        </p>
        <p className="mt-2 text-muted">
          Thanks for reaching out — expect a reply within a couple of days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="flex flex-col gap-6 md:flex-row">
        <label className="flex flex-1 flex-col gap-2">
          <span className="text-xs uppercase tracking-widest text-muted">
            Name
          </span>
          <input
            type="text"
            name="name"
            required
            autoComplete="name"
            className="border-b border-line bg-transparent py-3 outline-none transition-colors focus:border-accent"
          />
        </label>
        <label className="flex flex-1 flex-col gap-2">
          <span className="text-xs uppercase tracking-widest text-muted">
            Email
          </span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className="border-b border-line bg-transparent py-3 outline-none transition-colors focus:border-accent"
          />
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-widest text-muted">
          Message
        </span>
        <textarea
          name="message"
          required
          rows={6}
          className="resize-y border-b border-line bg-transparent py-3 outline-none transition-colors focus:border-accent"
        />
      </label>

      <div className="flex items-center gap-6">
        <button
          type="submit"
          disabled={status === "sending"}
          className="border border-line px-8 py-3 text-sm uppercase tracking-widest transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
        >
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
        {status === "error" && (
          <p className="text-sm text-accent">
            Something broke — email me directly instead.
          </p>
        )}
      </div>
    </form>
  );
}
