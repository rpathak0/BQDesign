import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileTabbar } from "@/components/layout/mobile-tabbar";
import { SafeImage } from "@/components/shared/safe-image";
import { BLOG_POSTS } from "@/data/blogs";
import { Button } from "@/components/ui/button";

interface BlogDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { locale, slug } = await params;
  const base = `/${locale}`;

  const post = BLOG_POSTS.find((item) => item.slug === slug);
  if (!post) notFound();
  const relatedPosts = BLOG_POSTS.filter((item) => item.slug !== post.slug);
  const latestNews = BLOG_POSTS.slice(0, 3);
  const sections = [
    { id: "overview", title: "Overview", body: post.content[0] ?? "" },
    { id: "what-to-know", title: "What to know", body: post.content[1] ?? "" },
    { id: "final-tips", title: "Final tips", body: post.content[2] ?? "" },
  ].filter((section) => section.body);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar variant="light" />
      <main className="flex-1 pt-20 md:pt-24">
        <article className="container mx-auto px-4 sm:px-5 md:px-6 py-6 md:py-10 max-w-7xl">
          <nav className="text-sm mb-4 flex items-center gap-3 flex-wrap">
            <Link
              href={base}
              className="inline-flex items-center gap-1.5 text-foreground hover:text-foreground/80 transition-colors font-medium"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Link>
            <span className="h-4 w-px bg-border shrink-0" aria-hidden />
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Link href={base} className="hover:text-foreground transition-colors">
                Home
              </Link>
              <span className="text-muted-foreground/70">&#62;</span>
              <Link href={`${base}/blog`} className="hover:text-foreground transition-colors">
                Blog
              </Link>
              <span className="text-muted-foreground/70">&#62;</span>
              <span className="text-foreground font-medium">{post.title}</span>
            </div>
          </nav>

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-8">
            <div>
              <div className="relative aspect-[16/8] overflow-hidden rounded-2xl border border-border/60 mb-6">
                <SafeImage src={post.image} alt={post.title} className="w-full h-full object-cover" />
              </div>

              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-primary/15 text-primary mb-4">
                {post.tag}
              </span>
              <h1 className="text-2xl md:text-3xl font-display font-black tracking-tight text-foreground mb-1">
                {post.title}
              </h1>
              <p className="text-muted-foreground mb-6 text-sm">{post.meta}</p>

              <div className="space-y-6 text-foreground/90 leading-relaxed text-sm md:text-base">
                {sections.map((section) => (
                  <section id={section.id} key={section.id}>
                    <h2 className="text-lg font-display font-bold mb-2">{section.title}</h2>
                    <p>{section.body}</p>
                  </section>
                ))}
              </div>

              <section className="pt-10">
                <h2 className="text-lg font-display font-bold mb-4">Latest news</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {latestNews.map((item) => (
                    <Link
                      key={item.slug}
                      href={`${base}/blog/${item.slug}`}
                      className="rounded-lg border border-border/60 bg-card p-3 flex items-center gap-3 hover:border-primary/50 transition-colors"
                    >
                      <div className="relative w-16 h-12 rounded-md overflow-hidden shrink-0">
                        <SafeImage src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium line-clamp-2">{item.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{item.meta}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              {relatedPosts.length > 0 && (
                <section className="pt-10">
                  <h2 className="text-lg font-display font-bold mb-4">You might also like</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {relatedPosts.map((item) => (
                      <Link
                        key={item.slug}
                        href={`${base}/blog/${item.slug}`}
                        className="rounded-xl overflow-hidden border border-border/60 bg-card hover:border-primary/50 transition-colors"
                      >
                        <div className="relative aspect-[16/10]">
                          <SafeImage src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-3">
                          <p className="text-xs text-primary font-semibold mb-1">{item.tag}</p>
                          <p className="font-medium text-sm line-clamp-2">{item.title}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              <div className="mt-10 rounded-2xl border border-border/60 bg-gradient-to-r from-primary/15 to-primary/5 p-5 md:p-6">
                <h3 className="text-xl font-display font-black mb-2">Don&apos;t miss out on exciting events</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Pick your favorite genres and receive updates on local events.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="h-10 rounded-md border border-border bg-background px-3 text-sm flex-1"
                  />
                  <Button className="h-10 rounded-md px-5">Subscribe now</Button>
                </div>
              </div>
            </div>

            <aside className="space-y-4">
              <div className="rounded-xl border border-border/60 bg-card p-4">
                <h3 className="font-display font-bold mb-2">Table of content</h3>
                <ul className="space-y-1 text-sm">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <a href={`#${section.id}`} className="text-muted-foreground hover:text-foreground transition-colors">
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-border/60 bg-card p-4">
                <h3 className="font-display font-bold mb-2">Written by</h3>
                <p className="text-sm font-medium">BQ Editorial Team</p>
                <p className="text-xs text-muted-foreground mt-1">Local stories and city updates</p>
              </div>
            </aside>
          </div>
        </article>
      </main>
      <MobileTabbar />
      <Footer />
    </div>
  );
}
