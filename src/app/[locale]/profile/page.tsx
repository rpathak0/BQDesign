"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileTabbar } from "@/components/layout/mobile-tabbar";

export default function ProfilePage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar variant="light" />
      <main className="flex-1 container mx-auto pt-20 md:pt-24 py-8 md:py-12 max-w-3xl px-4 sm:px-5 md:px-6">
        <Link
          href={`/${locale}`}
          className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-block"
        >
          ← Home
        </Link>
        <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4">
          Profile
        </h1>
        <p className="text-muted-foreground">
          Manage your account details and preferences.
        </p>
      </main>
      <MobileTabbar />
      <Footer />
    </div>
  );
}
