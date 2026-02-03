import { notFound } from "next/navigation";
import { getEventBySlug } from "@/data/events";
import { DateTimeSelectionClient } from "./date-time-client";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function DateTimePage({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();
  const options = event.dateTimeOptions ?? [];
  if (!options.length) notFound();
  return <DateTimeSelectionClient event={event} />;
}
