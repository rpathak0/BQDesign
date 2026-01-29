import "./globals.css";
import type { Metadata } from "next";
import { LocaleHtmlAttributes } from "@/components/layout/locale-html-attributes";

export const metadata: Metadata = {
  title: "BookingQube",
  description: "Your premium gateway to movies, events, and experiences.",
};

/**
 * Root layout: ensures globals.css and html/body wrap ALL routes (including 404).
 * Without this, not-found rendered for invalid routes (e.g. /asdas) had no layout and no CSS.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased bg-background text-foreground transition-colors duration-300">
        <LocaleHtmlAttributes />
        {children}
      </body>
    </html>
  );
}
