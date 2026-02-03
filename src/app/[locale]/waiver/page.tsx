"use client";

import { useState, useRef, useCallback } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { MobileTabbar } from "@/components/layout/mobile-tabbar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, Eraser } from "lucide-react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

const WAIVER_STORAGE_KEY = "waiverSigned";
const WAIVER_SIGNATURE_KEY = "waiverSignatureDataUrl";
const SIG_PAD_WIDTH = 400;
const SIG_PAD_HEIGHT = 180;

const WAIVER_TEXT = `
PARTICIPATION WAIVER AND RELEASE OF LIABILITY

By signing below, I acknowledge and agree to the following:

1. I voluntarily assume all risks associated with participating in this event, including but not limited to personal injury, property damage, or loss.

2. I release and hold harmless the event organizers, venue, sponsors, and their respective officers, employees, and agents from any and all claims, damages, or liability arising from my participation in this event.

3. I understand that the event may involve physical activity, crowds, and other inherent risks. I confirm that I am physically able to participate and have no known conditions that would prevent my safe participation.

4. I agree to follow all rules, regulations, and instructions provided by the event organizers and venue staff. Failure to do so may result in my removal from the event without refund.

5. I consent to the use of my image or likeness in any photographs, videos, or other media taken during the event for promotional or archival purposes.

6. I have read and understand this waiver in its entirety. My electronic signature below constitutes a legal and binding agreement to these terms.
`.trim();

function SignaturePad({
  width,
  height,
  onHasSignature,
  canvasRef,
  className,
}: {
  width: number;
  height: number;
  onHasSignature: (has: boolean) => void;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  className?: string;
}) {
  const isDrawingRef = useRef(false);

  const getPoint = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = "touches" in e ? e.touches[0]?.clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0]?.clientY : e.clientY;
    if (clientX == null || clientY == null) return null;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }, [canvasRef]);

  const setupContext = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = "#0a0a0a";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  const startDrawing = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      const point = getPoint(e);
      if (!point) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      setupContext(ctx);
      isDrawingRef.current = true;
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
    },
    [getPoint, canvasRef, setupContext]
  );

  const draw = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      if (!isDrawingRef.current) return;
      const point = getPoint(e);
      if (!point) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
      onHasSignature(true);
    },
    [getPoint, canvasRef, onHasSignature]
  );

  const stopDrawing = useCallback(() => {
    isDrawingRef.current = false;
  }, []);

  const clear = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onHasSignature(false);
  }, [canvasRef, onHasSignature]);

  return (
    <div className={cn("space-y-2", className)}>
      <canvas
        ref={canvasRef}
        data-signature-pad
        width={width}
        height={height}
        className="w-full max-w-full border border-border rounded-xl bg-white dark:bg-card touch-none cursor-crosshair"
        style={{ maxHeight: height }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        onTouchCancel={stopDrawing}
      />
      <Button type="button" variant="outline" size="sm" onClick={clear} className="rounded-lg">
        <Eraser className="w-4 h-4 mr-1.5" />
        Clear signature
      </Button>
    </div>
  );
}

export default function WaiverPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = (params?.locale as string) ?? "en";
  const returnTo = searchParams.get("returnTo");
  const eventSlug = searchParams.get("event");

  const [hasSignature, setHasSignature] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const signatureCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduced = usePrefersReducedMotion();

  const defaultReturnUrl = `/${locale}/checkout${eventSlug ? `?event=${eventSlug}` : ""}`;
  const backUrl = returnTo ? decodeURIComponent(returnTo) : defaultReturnUrl;

  const canSign = hasSignature && agreed;

  const handleSign = () => {
    setError(null);
    if (!hasSignature) {
      setError("Please draw your signature in the box above.");
      return;
    }
    if (!agreed) {
      setError("Please confirm that you have read and agree to the waiver.");
      return;
    }
    if (typeof window !== "undefined") {
      sessionStorage.setItem(WAIVER_STORAGE_KEY, "true");
      const canvas = signatureCanvasRef.current;
      if (canvas) {
        try {
          const dataUrl = canvas.toDataURL("image/png");
          sessionStorage.setItem(WAIVER_SIGNATURE_KEY, dataUrl);
        } catch {
          // ignore if canvas not available
        }
      }
    }
    router.push(backUrl);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto py-8 md:py-12 max-w-3xl pb-24 md:pb-12">
        <Link
          href={backUrl}
          className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to checkout
        </Link>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight mb-2">
            Waiver and terms of participation
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            Please read the waiver below and sign electronically to continue to checkout.
          </p>

          <div className="rounded-2xl border border-border bg-card p-5 md:p-6 mb-6">
            <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground whitespace-pre-line">
              {WAIVER_TEXT}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium block mb-2">
                Your signature
              </Label>
              <p className="text-xs text-muted-foreground mb-2">
                Draw your signature in the box below using your mouse or finger.
              </p>
              <SignaturePad
                width={SIG_PAD_WIDTH}
                height={SIG_PAD_HEIGHT}
                onHasSignature={setHasSignature}
                canvasRef={signatureCanvasRef}
              />
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="waiver-agree"
                checked={agreed}
                onCheckedChange={(v) => {
                  setAgreed(v === true);
                  setError(null);
                }}
                className="mt-0.5"
              />
              <label htmlFor="waiver-agree" className="text-sm text-muted-foreground cursor-pointer">
                I have read the waiver above and agree to its terms. I understand that my signature above
                constitutes my legal agreement.
              </label>
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                type="button"
                className="rounded-xl font-semibold"
                onClick={handleSign}
                disabled={!canSign}
              >
                Sign waiver and return to checkout
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={() => router.push(backUrl)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </motion.div>
      </main>

      <MobileTabbar />
    </div>
  );
}
