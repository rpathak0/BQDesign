"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Sets html lang and dir from pathname so locale is reflected at the root.
 * Used when root layout has a single <html> and [locale] layout no longer owns it.
 */
export function LocaleHtmlAttributes() {
  const pathname = usePathname() ?? "";

  useEffect(() => {
    const root = document.documentElement;
    if (pathname.startsWith("/ar")) {
      root.setAttribute("lang", "ar");
      root.setAttribute("dir", "rtl");
    } else {
      root.setAttribute("lang", "en");
      root.setAttribute("dir", "ltr");
    }
  }, [pathname]);

  return null;
}
