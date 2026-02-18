"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

export interface LegalSidebarLink {
  label: string;
  href: string;
  active?: boolean;
}

interface LegalSidebarProps {
  links: LegalSidebarLink[];
  title?: string;
  className?: string;
}

export function LegalSidebar({ links, title = "Legal", className }: LegalSidebarProps) {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const base = `/${locale}`;

  return (
    <aside
      className={cn(
        "w-full md:w-48 shrink-0 md:sticky md:top-24 self-start",
        "border-b md:border-b-0 md:border-r border-border pb-4 md:pb-0 md:pr-6 md:mr-8",
        className
      )}
    >
      {title && (
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          {title}
        </h2>
      )}
      <nav aria-label="Legal pages">
        <ul className="space-y-1">
          {links.map((link) => {
            const href = link.href.startsWith("/") ? link.href : `${base}/${link.href}`;
            return (
              <li key={link.label}>
                <Link
                  href={href}
                  className={cn(
                    "block py-2 px-2 rounded-md text-sm transition-colors",
                    link.active
                      ? "font-medium text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
