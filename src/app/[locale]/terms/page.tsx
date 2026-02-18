"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileTabbar } from "@/components/layout/mobile-tabbar";
import { LegalSidebar } from "@/components/legal/legal-sidebar";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "privacy", active: false },
  { label: "Terms & Conditions", href: "terms", active: true },
  { label: "Cookies Policy", href: "privacy", active: false },
  { label: "Copyright Policy", href: "privacy", active: false },
];

export default function TermsPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const base = `/${locale}`;
  const reduced = usePrefersReducedMotion();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar variant="light" />
      <main className="flex-1 container mx-auto pt-20 md:pt-24 py-8 md:py-12 px-4 sm:px-5 md:px-6">
        <nav aria-label="Breadcrumb" className="mb-6">
          <Link
            href={base}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Home
          </Link>
          <span className="text-muted-foreground mx-2">/</span>
          <span className="text-sm text-muted-foreground">Legal</span>
          <span className="text-muted-foreground mx-2">/</span>
          <span className="text-sm text-foreground">Terms & Conditions</span>
        </nav>

        <div className="flex flex-col md:flex-row md:gap-8">
          <LegalSidebar
            links={LEGAL_LINKS.map((l) => ({
              ...l,
              href: l.href === "terms" ? `${base}/terms` : `${base}/${l.href}`,
              active: l.active,
            }))}
          />

          <article
            className="flex-1 min-w-0 max-w-3xl print:max-w-none"
            style={{ printColorAdjust: "exact" }}
          >
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-2">
                Terms and Conditions
              </h1>
              <p className="text-sm text-muted-foreground mb-8">
                Updated 25 February 2024
              </p>

              <div className="prose prose-sm dark:prose-invert max-w-none text-foreground space-y-8 print:block">
                <section id="1-general">
                  <h2 className="text-xl font-display font-semibold mb-4">1. General</h2>
                  <div className="space-y-3 text-muted-foreground">
                    <h3 className="text-base font-medium text-foreground">1.1 Acceptance of Terms</h3>
                    <p>
                      By accessing or using the BookingQube platform (&quot;Platform&quot;), you agree to be bound by these Terms and Conditions. If you do not agree, do not use the Platform.
                    </p>
                    <h3 className="text-base font-medium text-foreground">1.2 Scope of Services</h3>
                    <p>
                      BookingQube means the BookingQube website, mobile applications, and related services. We act as a booking platform connecting you with event organisers and venues. Your contract for tickets or experiences is with the organiser; we are not responsible for the event itself.
                    </p>
                    <h3 className="text-base font-medium text-foreground">1.3 Eligibility</h3>
                    <p>
                      You must be at least 18 years old and able to form a binding contract to use the Platform. By using the Platform you represent that you meet these requirements.
                    </p>
                  </div>
                </section>

                <section id="2-definitions">
                  <h2 className="text-xl font-display font-semibold mb-4">2. Definitions</h2>
                  <div className="space-y-2 text-muted-foreground">
                    <p><strong className="text-foreground">Platform</strong> means the BookingQube website, apps, and related services.</p>
                    <p><strong className="text-foreground">User</strong> means any person or entity using the Platform.</p>
                    <p><strong className="text-foreground">Organiser</strong> means the entity that lists and manages events or experiences on the Platform.</p>
                    <p><strong className="text-foreground">Content</strong> means any text, images, or other materials you submit or that appear on the Platform.</p>
                  </div>
                </section>

                <section id="3-access">
                  <h2 className="text-xl font-display font-semibold mb-4">3. Access to the Platform and Accounts</h2>
                  <div className="space-y-3 text-muted-foreground">
                    <p>
                      We grant you a limited, non-exclusive, revocable licence to access and use the Platform for personal or (where permitted) commercial use. You must not misuse the Platform, attempt to gain unauthorised access, or use it in any way that could harm the Platform or other users.
                    </p>
                    <p>
                      You are responsible for keeping your account credentials secure and for all activity under your account.
                    </p>
                  </div>
                </section>

                <section id="4-user-accounts">
                  <h2 className="text-xl font-display font-semibold mb-4">4. User Accounts</h2>
                  <div className="space-y-3 text-muted-foreground">
                    <h3 className="text-base font-medium text-foreground">4.1 Registration</h3>
                    <p>
                      You may need to register to book tickets or use certain features. You must provide accurate and complete information and keep it up to date.
                    </p>
                    <h3 className="text-base font-medium text-foreground">4.2 User Content</h3>
                    <p>
                      You retain ownership of content you submit. By submitting content you grant us a licence to use, display, and distribute it in connection with the Platform.
                    </p>
                    <h3 className="text-base font-medium text-foreground">4.3 Prohibited Content</h3>
                    <p>
                      You must not submit content that is illegal, misleading, offensive, or infringes others&apos; rights. We may remove content and suspend or terminate accounts that violate these terms.
                    </p>
                  </div>
                </section>

                <section id="5-bookings">
                  <h2 className="text-xl font-display font-semibold mb-4">5. Bookings and Payments</h2>
                  <div className="space-y-3 text-muted-foreground">
                    <p>
                      Bookings are subject to the specific event&apos;s cancellation and refund policy. Please read the event page before purchasing. We do not guarantee availability until payment is confirmed.
                    </p>
                    <p>
                      E-tickets and confirmations will be sent to the email you provide. It is your responsibility to keep your account and contact information up to date.
                    </p>
                    <p>
                      For support or disputes, please contact us via the Contact page. These terms are governed by the laws of the jurisdiction in which we operate.
                    </p>
                  </div>
                </section>
              </div>
            </motion.div>
          </article>
        </div>
      </main>
      <MobileTabbar />
      <Footer />
    </div>
  );
}
