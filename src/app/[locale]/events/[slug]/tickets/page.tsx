import { notFound } from "next/navigation";
import { getEventBySlug } from "@/data/events";
import { TicketSelectionClient } from "./ticket-selection-client";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function TicketSelectionPage({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();
  if (!event.ticketCategories?.length) notFound();
  return <TicketSelectionClient event={event} />;
}
