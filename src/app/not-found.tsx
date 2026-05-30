"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { en } from "@/i18n/messages/en";
import { es } from "@/i18n/messages/es";

export default function NotFound() {
  const pathname = usePathname();
  const isEs = pathname?.startsWith("/es") ?? false;
  const m = isEs ? es.notFound : en.notFound;
  const homeHref = isEs ? "/es" : "/";

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md text-center space-y-4">
        <p className="text-xs uppercase tracking-[0.2em] text-text-secondary">
          {m.code}
        </p>
        <h1 className="text-3xl font-semibold text-text-primary">{m.title}</h1>
        <p className="text-text-secondary">{m.body}</p>
        <Link
          href={homeHref}
          className="inline-block text-accent hover:text-accent-hover transition-colors"
        >
          {m.back}
        </Link>
      </div>
    </main>
  );
}
