import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md text-center space-y-4">
        <p className="text-xs uppercase tracking-[0.2em] text-text-secondary">
          404
        </p>
        <h1 className="text-3xl font-semibold text-text-primary">
          Not found
        </h1>
        <p className="text-text-secondary">
          That page doesn&apos;t exist (yet).
        </p>
        <Link
          href="/"
          className="inline-block text-accent hover:text-accent-hover transition-colors"
        >
          ← Back to the Explorer
        </Link>
      </div>
    </main>
  );
}
