import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useRef } from "react";
import { SafeImage } from "@/components/shared/safe-image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BLOG_POSTS } from "@/data/blogs";

export function BlogsSection() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const base = `/${locale}`;
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = direction === "left" ? -260 : 260;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section className="container mx-auto py-10 md:py-14 px-4 sm:px-5 md:px-6 w-full">
      <div className="flex items-end justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight whitespace-nowrap">
            From the BookingQube blog
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Stories, guides, and inspiration for your next night out.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:bg-white/10 transition-colors"
              data-testid="button-blog-prev"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:bg-white/10 transition-colors"
              data-testid="button-blog-next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <Link href={`${base}/blog`}>
            <Button
              variant="link"
              className="text-black dark:text-[#ffdd00] text-xs md:text-sm font-semibold flex items-center gap-1 whitespace-nowrap"
              data-testid="button-discover-blogs"
            >
              Discover More
              <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
        </div>
      </div>

      <div ref={scrollRef} className="overflow-x-auto no-scrollbar snap-x pr-6 sm:pr-8 md:pr-10">
        <div className="flex gap-6 pr-10 sm:pr-12 md:pr-16">
          {BLOG_POSTS.map((blog) => (
            <Link
              key={blog.id}
              href={`${base}/blog/${blog.slug}`}
              className="shrink-0 w-[240px] md:w-[280px] rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:bg-white/8 transition-colors cursor-pointer flex flex-col"
              data-testid={`card-blog-${blog.id}`}
            >
              <div className="relative h-36 md:h-40 w-full overflow-hidden">
                <SafeImage
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                  data-testid={`img-blog-${blog.id}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              </div>

              <div className="p-4 md:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-[#7C3AED]/15 text-[#7C3AED] mb-3">
                    {blog.tag}
                  </span>
                  <h3 className="text-sm md:text-base font-semibold leading-snug">
                    {blog.title}
                  </h3>
                </div>
                <p className="mt-3 text-[11px] text-white/60">{blog.meta}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
