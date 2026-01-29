import { ShieldCheck, BadgeCheck, Headphones, CreditCard, PhoneCall } from "lucide-react";

export function TrustStrip() {
  return (
    <section className="border-t border-gray-200 dark:border-white/5 bg-white dark:bg-black/40">
      <div className="container mx-auto px-4 py-8 md:py-10 space-y-8">
        {/* Why book with BookingQube */}
        <div className="space-y-6">
          <h2 className="text-lg md:text-xl font-display font-semibold text-gray-900 dark:text-foreground">
            Why book with BookingQube?
          </h2>
          <div className="grid gap-6 md:grid-cols-4 text-sm">
            <div className="flex gap-3 items-start">
              <div className="mt-0.5 rounded-full bg-gray-100 dark:bg-white/5 p-2">
                <ShieldCheck className="w-5 h-5 text-[#7C3AED]" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-foreground">Secure checkout</p>
                <p className="text-xs text-gray-600 dark:text-muted-foreground" data-testid="text-secure-checkout">
                  Fast & secured payments
                </p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="mt-0.5 rounded-full bg-gray-100 dark:bg-white/5 p-2">
                <BadgeCheck className="w-5 h-5 text-[#7C3AED]" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-foreground">Instant confirmation</p>
                <p className="text-xs text-gray-600 dark:text-muted-foreground" data-testid="text-instant-confirmation">
                  Tickets delivered to your inbox
                </p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="mt-0.5 rounded-full bg-gray-100 dark:bg-white/5 p-2">
                <BadgeCheck className="w-5 h-5 text-[#7C3AED]" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-foreground">Official ticket seller</p>
                <p className="text-xs text-gray-600 dark:text-muted-foreground" data-testid="text-official-ticket-seller">
                  Trusted by thousands of guests
                </p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="mt-0.5 rounded-full bg-gray-100 dark:bg-white/5 p-2">
                <Headphones className="w-5 h-5 text-[#7C3AED]" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-foreground">24/7 customer support</p>
                <p className="text-xs text-gray-600 dark:text-muted-foreground" data-testid="text-customer-support">
                  Reliable after-sales assistance
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment options / hotline row */}
        <div className="border-t border-gray-200 dark:border-white/5 pt-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 text-sm">
          
          {/* Trust/Support Cluster */}
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 w-full lg:w-auto">
             {/* Hotline */}
             <div className="flex gap-4 items-start">
                <div className="rounded-full bg-gray-100 dark:bg-white/5 p-3 shrink-0">
                  <PhoneCall className="w-5 h-5 text-[#7C3AED]" />
                </div>
                <div>
                  <p className="font-semibold text-base mb-1 text-gray-900 dark:text-foreground">Ticket hotline</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white mb-1" data-testid="text-hotline-number">
                    +974 4428 0999
                  </p>
                  <p className="text-xs text-gray-600 dark:text-muted-foreground" data-testid="text-hotline-hours">
                    Sun – Thu 09:00 – 17:00
                  </p>
                </div>
             </div>

             {/* WhatsApp (Moved here) */}
             <div className="flex gap-4 items-start">
                <div>
                  <p className="font-semibold text-base mb-1 text-gray-900 dark:text-foreground">Chat with us</p>
                  <p className="text-sm text-gray-600 dark:text-muted-foreground mb-1">
                    On WhatsApp
                  </p>
                   <button 
                     onClick={() => window.open("https://wa.me/971500000000", "_blank")}
                     className="text-xs font-bold text-[#25D366] hover:underline uppercase tracking-wider"
                   >
                     Start Chat
                   </button>
                </div>
             </div>



             {/* Payment Methods (Moved here) */}
             <div className="flex gap-4 items-start">
                <div className="rounded-full bg-gray-100 dark:bg-white/5 p-3 shrink-0">
                  <CreditCard className="w-5 h-5 text-[#7C3AED]" />
                </div>
                <div>
                  <p className="font-semibold text-base mb-2 text-gray-900 dark:text-foreground">We accept</p>
                  <div
                    className="flex items-center gap-2 text-xs text-gray-600 dark:text-muted-foreground flex-wrap"
                    data-testid="text-accepted-cards"
                  >
                    <span className="opacity-70 hover:opacity-100 transition-opacity">VISA</span>
                    <span className="w-1 h-1 rounded-full bg-gray-400 dark:bg-white/20" />
                    <span className="opacity-70 hover:opacity-100 transition-opacity">Mastercard</span>
                    <span className="w-1 h-1 rounded-full bg-gray-400 dark:bg-white/20" />
                    <span className="opacity-70 hover:opacity-100 transition-opacity">Apple Pay</span>
                  </div>
                </div>
             </div>
          </div>
        </div>

      </div>
    </section>
  );
}
