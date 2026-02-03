import { notFound } from "next/navigation";
import { getEventBySlug } from "@/data/events";
import { SeatingPageClient } from "./seating-page-client";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function SeatingPage({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event?.hasSeatingLayout) notFound();
  return <SeatingPageClient event={event} />;
}
