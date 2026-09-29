"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { en } from "@/i18n/messages/en";
import { es } from "@/i18n/messages/es";

/**
 * 404 copy, picked from the URL: the single static 404.html serves both
 * trees, so it can't know the language at build time. It also corrects
 * `<html lang>` for Spanish URLs. Only this page loads both catalogues.
 */
export function NotFoundContent() {
  const pathname = usePathname();
  const isEs = pathname === "/es" || (pathname?.startsWith("/es/") ?? false);
  const m = isEs ? es.notFound : en.notFound;

  useEffect(() => {
    document.documentElement.lang = isEs ? "es" : "en";
  }, [isEs]);

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md text-center space-y-4">
        <p className="text-xs uppercase tracking-[0.2em] text-text-secondary">{m.code}</p>
        <h1 className="text-3xl font-semibold text-text-primary">{m.title}</h1>
        <p className="text-text-secondary">{m.body}</p>
        <Link
          href={isEs ? "/es" : "/"}
          className="inline-block text-accent hover:text-accent-hover transition-colors"
        >
          {m.back}
        </Link>
      </div>
    </main>
  );
}
