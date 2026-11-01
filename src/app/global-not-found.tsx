import Link from "next/link";
import "./globals.css";

// Global fallback for URLs outside the localized tree. Localized 404s are
// handled by src/app/(site)/[locale]/not-found.tsx.
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="grid min-h-screen place-items-center bg-ink-800 text-ivory">
        <div className="text-center">
          <p className="font-display text-6xl">404</p>
          <Link
            href="/en"
            className="mt-6 inline-block text-xs uppercase tracking-[0.16em] underline"
          >
            Return home
          </Link>
        </div>
      </body>
    </html>
  );
}
