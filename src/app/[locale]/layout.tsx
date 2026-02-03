import { Providers } from "@/components/providers";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { PageTransition } from "@/components/layout/page-transition";

/**
 * Locale layout: wraps with next-intl, Providers, and page transition.
 * Root layout (app/layout.tsx) provides html, body, and globals.css so 404 always has styles.
 */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!["en", "ar"].includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <Providers>
        <PageTransition>{children}</PageTransition>
      </Providers>
    </NextIntlClientProvider>
  );
}
