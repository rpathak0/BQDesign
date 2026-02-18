"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileTabbar } from "@/components/layout/mobile-tabbar";
import {
  getCollectionBySlug,
  getCategoriesByCollectionId,
  getArticlesForCategory,
} from "@/data/helpCenter";

export default function HelpCollectionPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const slug = params?.slug as string;
  const collection = getCollectionBySlug(slug);

  if (!collection) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar variant="light" />
        <main className="flex-1 container mx-auto pt-20 md:pt-24 py-12 px-4">
          <p className="text-muted-foreground">Collection not found.</p>
          <Link href={`/${locale}/help`} className="text-primary hover:underline mt-4 inline-block">
            ← Back to Help
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const categories = getCategoriesByCollectionId(collection.id);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar variant="light" />
      <main className="flex-1 container mx-auto pt-20 md:pt-24 py-8 md:py-12 max-w-3xl px-4 sm:px-5 md:px-6">
        <Link
          href={`/${locale}/help`}
          className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-block"
        >
          ← Back to Help
        </Link>
        <h1 className="text-3xl font-display font-bold tracking-tight mb-2">{collection.title}</h1>
        {collection.description && (
          <p className="text-muted-foreground text-sm mb-8">{collection.description}</p>
        )}
        <div className="space-y-6">
          {categories.map((cat) => {
            const articles = getArticlesForCategory(cat.id);
            return (
              <div key={cat.id}>
                <h2 className="text-lg font-semibold text-foreground mb-3">{cat.title}</h2>
                <ul className="space-y-2">
                  {articles.map((a) => (
                    <li key={a.id}>
                      <Link
                        href={`/${locale}/help/${collection.slug}/${a.slug}`}
                        className="text-primary hover:underline"
                      >
                        {a.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
        {categories.length === 0 && (
          <p className="text-muted-foreground">No articles in this collection yet.</p>
        )}
      </main>
      <MobileTabbar />
      <Footer />
    </div>
  );
}
