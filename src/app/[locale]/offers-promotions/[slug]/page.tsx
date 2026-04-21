import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, ChevronLeft } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileTabbar } from "@/components/layout/mobile-tabbar";
import { SafeImage } from "@/components/shared/safe-image";
import { Button } from "@/components/ui/button";
import { getOfferPromotionBySlug } from "@/data/offersPromotions";

interface OfferDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function OfferDetailPage({ params }: OfferDetailPageProps) {
  const { locale, slug } = await params;
  const base = `/${locale}`;
  const offer = getOfferPromotionBySlug(slug);
  if (!offer) notFound();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar variant="light" />
      <main className="flex-1 pt-20 md:pt-24 bg-background">
        <div className="w-full">
          <div className="relative w-full h-[220px] md:h-[340px] border-y border-border/60">
            <SafeImage src={offer.image} alt={offer.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute top-4 left-4 md:top-6 md:left-6">
              <Link
                href={`${base}/offers-promotions`}
                className="inline-flex items-center gap-1.5 rounded-full bg-background/90 border border-border text-foreground px-3 py-1.5 text-sm hover:bg-background transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Go Back
              </Link>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-5 md:px-6 py-8 md:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 lg:gap-8 items-start">
            <section className="rounded-3xl border border-border/60 bg-card p-6 md:p-7">
              <h1 className="text-4xl md:text-5xl font-display font-black text-foreground tracking-tight mb-2">
                {offer.title}
              </h1>
              <p className="text-muted-foreground text-lg mb-4">{offer.subtitle}</p>
              <p className="text-foreground/90 leading-relaxed">{offer.description}</p>
            </section>

            <aside className="rounded-3xl border border-border/60 bg-card p-4 md:p-5">
              <div className="rounded-2xl overflow-hidden border border-border/60 mb-4">
                <SafeImage src={offer.image} alt={offer.title} className="w-full h-[180px] object-cover" />
              </div>
              <div className="flex items-center gap-2 text-foreground/85 text-sm mb-4">
                <CalendarDays className="w-4 h-4 text-primary" />
                <span>Valid till</span>
                <span className="font-semibold">{offer.validTill}</span>
              </div>
              <Button className="w-full h-11 rounded-full text-sm font-semibold">Explore Movies</Button>
            </aside>
          </div>
        </div>
      </main>
      <MobileTabbar />
      <Footer />
    </div>
  );
}
