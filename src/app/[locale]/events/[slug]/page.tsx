import { notFound } from "next/navigation";
import { getEventBySlug } from "@/data/events";
import { EventDetailView } from "./event-detail-view";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();
  return <EventDetailView event={event} />;
}
