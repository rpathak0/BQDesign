"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WhatsAppButton() {
  const handleClick = () => {
    window.open("https://wa.me/971500000000", "_blank");
  };

  return (
    <Button
      className="fixed bottom-24 right-6 z-50 rounded-full w-14 h-14 bg-[#25D366] hover:bg-[#128C7E] text-white shadow-lg shadow-black/20 hover:scale-110 transition-transform duration-300 md:bottom-8"
      onClick={handleClick}
      size="icon"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle className="w-8 h-8 fill-current" />
    </Button>
  );
}
