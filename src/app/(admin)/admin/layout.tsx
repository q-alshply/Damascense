import type { Metadata } from "next";
import { sans } from "@/lib/fonts";
import "../../globals.css";

export const metadata: Metadata = {
  title: "Damascense CMS",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" className={sans.variable}>
      <body className="min-h-screen bg-ink-900 text-ivory antialiased">
        {children}
      </body>
    </html>
  );
}
