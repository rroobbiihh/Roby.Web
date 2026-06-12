import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-svh max-w-6xl flex-col items-start justify-center px-6">
      <p className="text-sm uppercase tracking-[0.3em] text-muted">404</p>
      <h1 className="mt-4 font-display text-5xl font-extrabold tracking-tight md:text-7xl">
        Left on the cutting room floor
        <span className="text-accent">.</span>
      </h1>
      <Link
        href="/"
        className="mt-10 border border-line px-8 py-3 text-sm uppercase tracking-widest transition-colors hover:border-accent hover:text-accent"
      >
        Back to home
      </Link>
    </div>
  );
}
