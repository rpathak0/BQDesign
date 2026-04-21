"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileTabbar } from "@/components/layout/mobile-tabbar";
import { SafeImage } from "@/components/shared/safe-image";
import { BLOG_POSTS } from "@/data/blogs";

export default function BlogListingPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const base = `/${locale}`;
  const latestNews = BLOG_POSTS.slice(0, 3);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = useMemo(() => {
    const unique = Array.from(new Set(BLOG_POSTS.map((post) => post.category)));
    return ["All", ...unique];
  }, []);

  const filteredPosts = useMemo(() => {
    if (selectedCategory === "All") return BLOG_POSTS;
    return BLOG_POSTS.filter((post) => post.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar variant="light" />
      <main className="flex-1 pt-20 md:pt-24">
        <div className="container mx-auto py-6 md:py-8 px-4 sm:px-5 md:px-6 max-w-7xl">
          <section className="mb-8">
            <h2 className="text-lg font-display font-bold mb-3">Latest news</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {latestNews.map((post) => (
                <Link
                  key={post.slug}
                  href={`${base}/blog/${post.slug}`}
                  className="rounded-lg border border-border/60 bg-card p-3 flex items-center gap-3 hover:border-primary/50 transition-colors"
                >
                  <div className="relative w-16 h-12 rounded-md overflow-hidden shrink-0">
                    <SafeImage src={post.image} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium line-clamp-2">{post.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {post.meta} • {post.views.toLocaleString()} views
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-8">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl md:text-3xl font-display font-black tracking-tight">What to do in Doha</h1>
                <span className="text-sm text-muted-foreground">{filteredPosts.length} stories</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`${base}/blog/${post.slug}`}
                    className="rounded-xl overflow-hidden border border-border/60 bg-card hover:border-primary/50 transition-colors"
                  >
                    <div className="relative aspect-[16/10]">
                      <SafeImage src={post.image} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-semibold text-primary mb-1">{post.tag} • {post.category}</p>
                      <h3 className="text-sm font-semibold leading-snug line-clamp-2">{post.title}</h3>
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{post.excerpt}</p>
                      <p className="text-[11px] text-muted-foreground mt-2">
                        {post.meta} • {post.views.toLocaleString()} views
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <aside className="space-y-5">
              <div className="rounded-xl border border-border/60 bg-card p-4">
                <h3 className="font-display font-bold mb-3">Categories</h3>
                <ul className="space-y-2 text-sm">
                  {categories.map((item) => (
                    <li key={item}>
                      <button
                        type="button"
                        onClick={() => setSelectedCategory(item)}
                        className={`transition-colors ${
                          selectedCategory === item
                            ? "text-foreground font-semibold"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {item}{" "}
                        <span className="text-xs text-muted-foreground">
                          (
                          {item === "All"
                            ? BLOG_POSTS.length
                            : BLOG_POSTS.filter((post) => post.category === item).length}
                          )
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-border/60 bg-card p-4">
                <h3 className="font-display font-bold mb-3">Follow us</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="rounded border border-border px-2 py-1">X</span>
                  <span className="rounded border border-border px-2 py-1">F</span>
                  <span className="rounded border border-border px-2 py-1">IG</span>
                  <span className="rounded border border-border px-2 py-1">YT</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <MobileTabbar />
      <Footer />
    </div>
  );
}
