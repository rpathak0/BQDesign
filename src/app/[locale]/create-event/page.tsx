"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileTabbar } from "@/components/layout/mobile-tabbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, ImagePlus } from "lucide-react";

const STEPS = [
  { id: 1, label: "Event Information" },
  { id: 2, label: "Organiser" },
  { id: 3, label: "Add Tickets" },
];

const CITIES = ["Dubai", "Abu Dhabi", "Doha", "Riyadh", "Manama", "Muscat", "Kuwait City"];

export default function CreateEventPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    eventNameEn: "",
    eventNameOther: "",
    startDate: "",
    endDate: "",
    eventInfoEn: "",
    eventInfoOther: "",
    city: "",
    venueNameOrAddress: "",
  });

  const updateForm = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar variant="light" />
      <main className="flex-1 container mx-auto pt-20 md:pt-24 py-8 md:py-12 max-w-3xl px-4 sm:px-5 md:px-6">
        <Link
          href={`/${locale}/organisers`}
          className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-block"
        >
          ← Back to Organisers
        </Link>

        {/* Progress */}
        <div className="flex items-center gap-2 md:gap-4 mb-10">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <span
                className={`text-sm font-medium ${step === s.id ? "text-primary" : "text-muted-foreground"}`}
              >
                {s.id}. {s.label}
              </span>
              {i < STEPS.length - 1 && (
                <span className="hidden md:inline text-muted-foreground">/</span>
              )}
            </div>
          ))}
        </div>

        {step === 1 && (
          <>
            <h1 className="text-2xl font-display font-bold tracking-tight mb-6">
              1. Event Information
            </h1>

            {/* Artwork */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label className="flex items-center gap-1">
                  Desktop event artwork <span className="text-destructive">*</span>
                </Label>
                <div className="mt-2 aspect-video max-w-md rounded-xl border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center gap-2 p-4">
                  <ImagePlus className="w-10 h-10 text-muted-foreground" />
                  <Button type="button" variant="secondary" size="sm">
                    Add Image
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Recommended size is 960 wide x 540 tall, 2 mb max
                  </p>
                </div>
              </div>
              <div>
                <Label>Mobile event artwork</Label>
                <div className="mt-2 aspect-square max-w-[200px] rounded-xl border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center gap-2 p-4">
                  <ImagePlus className="w-8 h-8 text-muted-foreground" />
                  <Button type="button" variant="secondary" size="sm">
                    Add Image
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Recommended size is 706 wide x 706 tall, 2 mb max
                  </p>
                </div>
              </div>
            </div>

            {/* Event name */}
            <div className="space-y-4 mb-6">
              <div>
                <Label className="flex items-center gap-1">
                  Event name <span className="text-destructive">*</span>
                </Label>
                <Input
                  value={form.eventNameEn}
                  onChange={(e) => updateForm("eventNameEn", e.target.value)}
                  placeholder="Type name in English"
                  className="mt-2"
                />
                <div className="mt-2">
                  <Select value={form.eventNameOther ? "other" : ""} onValueChange={() => {}}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Add language (e.g. Русский)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="other">Русский</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.eventNameOther !== undefined && (
                    <Input
                      value={form.eventNameOther}
                      onChange={(e) => updateForm("eventNameOther", e.target.value)}
                      placeholder="Type name in other language"
                      className="mt-2"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <Label className="flex items-center gap-1">
                  Start date <span className="text-destructive">*</span>
                </Label>
                <div className="relative mt-2">
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => updateForm("startDate", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label className="flex items-center gap-1">
                  End date <span className="text-destructive">*</span>
                </Label>
                <div className="relative mt-2">
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => updateForm("endDate", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Event information */}
            <div className="mb-6">
              <Label className="flex items-center gap-1">
                Event information <span className="text-destructive">*</span>
              </Label>
              <Textarea
                value={form.eventInfoEn}
                onChange={(e) => updateForm("eventInfoEn", e.target.value)}
                placeholder="Type text in English"
                className="mt-2 min-h-[120px]"
              />
              <Select value={form.eventInfoOther ? "other" : ""} onValueChange={() => {}} className="mt-2">
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Add language (e.g. Русский)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="other">Русский</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* City & Venue */}
            <div className="space-y-4 mb-8">
              <div>
                <Label className="flex items-center gap-1">
                  City <span className="text-destructive">*</span>
                </Label>
                <Select value={form.city} onValueChange={(v) => updateForm("city", v)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {CITIES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Enter venue name or address</Label>
                <Input
                  value={form.venueNameOrAddress}
                  onChange={(e) => updateForm("venueNameOrAddress", e.target.value)}
                  placeholder="Venue name or address"
                  className="mt-2"
                />
              </div>
            </div>

            <Button
              size="lg"
              onClick={() => setStep(2)}
            >
              Next
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="text-2xl font-display font-bold tracking-tight mb-6">
              2. Organiser
            </h1>
            <p className="text-muted-foreground mb-6">
              Organiser details will go here. Share the required fields and we&apos;ll add them.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={() => setStep(3)}>Next</Button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h1 className="text-2xl font-display font-bold tracking-tight mb-6">
              3. Add Tickets
            </h1>
            <p className="text-muted-foreground mb-6">
              Ticket types and pricing will go here. Share the required fields and we&apos;ll add them.
            </p>
            <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
          </>
        )}
      </main>
      <MobileTabbar />
      <Footer />
    </div>
  );
}
