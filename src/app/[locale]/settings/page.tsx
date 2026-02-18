"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileTabbar } from "@/components/layout/mobile-tabbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const NOTIFICATION_OPTIONS = [
  { id: "flyers", label: "Send me event flyers related to genres I picked" },
  { id: "reminder", label: "Event reminder notifications" },
  { id: "sms-invite", label: "SMS event invitations" },
  { id: "sms-purchase", label: "Ticket purchase SMS notifications" },
  { id: "artist", label: "My artist notifications" },
  { id: "alerts", label: "Event alerts" },
  { id: "photos", label: "Event photos notification" },
  { id: "comeback", label: "Come back notification" },
  { id: "whatsapp", label: "WhatsApp notifications" },
];

const COUNTRIES = ["United Arab Emirates", "Qatar", "Saudi Arabia", "Bahrain", "Oman", "Kuwait", "Pakistan", "India"];
const TIMEZONES = [
  "(GMT+04:00) Asia/Dubai",
  "(GMT+03:00) Asia/Riyadh",
  "(GMT+05:00) Asia/Karachi",
  "(GMT+05:30) Asia/Kolkata",
];

export default function SettingsPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const [details, setDetails] = useState({
    fullName: "",
    country: "",
    phoneCode: "+971",
    phone: "",
    email: "",
    timezone: "(GMT+04:00) Asia/Dubai",
  });
  const [notifications, setNotifications] = useState<Record<string, boolean>>(
    NOTIFICATION_OPTIONS.reduce((acc, o) => ({ ...acc, [o.id]: o.id !== "whatsapp" }), {})
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const name = localStorage.getItem("bq_user_name") || "";
    const email = localStorage.getItem("bq_user_email") || "";
    setDetails((d) => ({ ...d, fullName: name, email }));
  }, []);

  const handleDetailsChange = (field: string, value: string) => {
    setDetails((d) => ({ ...d, [field]: value }));
  };

  const toggleNotification = (id: string) => {
    setNotifications((n) => ({ ...n, [id]: !n[id] }));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar variant="light" />
      <main className="flex-1 container mx-auto pt-20 md:pt-24 py-8 md:py-12 max-w-3xl px-4 sm:px-5 md:px-6">
        <Link
          href={`/${locale}`}
          className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-block"
        >
          ← Home
        </Link>
        <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6">
          Profile settings
        </h1>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="w-full justify-start border-b border-border rounded-none h-auto p-0 bg-transparent gap-6">
            <TabsTrigger value="details" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none">
              My details
            </TabsTrigger>
            <TabsTrigger value="notifications" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none">
              Notifications
            </TabsTrigger>
            <TabsTrigger value="password" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none">
              Password
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-8">
            <div className="space-y-6">
              <div>
                <Label htmlFor="fullName">Full name *</Label>
                <Input
                  id="fullName"
                  value={details.fullName}
                  onChange={(e) => handleDetailsChange("fullName", e.target.value)}
                  className="mt-2"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <Label>Country of residence *</Label>
                <Select value={details.country || COUNTRIES[0]} onValueChange={(v) => handleDetailsChange("country", v)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Contact number *</Label>
                <div className="flex gap-2 mt-2">
                  <Select value={details.phoneCode} onValueChange={(v) => handleDetailsChange("phoneCode", v)}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+971">+971</SelectItem>
                      <SelectItem value="+974">+974</SelectItem>
                      <SelectItem value="+92">+92</SelectItem>
                      <SelectItem value="+91">+91</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    value={details.phone}
                    onChange={(e) => handleDetailsChange("phone", e.target.value)}
                    placeholder="Phone number"
                    className="flex-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Current email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={details.email}
                  readOnly
                  className="mt-2 bg-muted"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Email changes are not permitted. Please contact support for more info.
                </p>
              </div>
              <div>
                <Label>Timezone *</Label>
                <Select value={details.timezone} onValueChange={(v) => handleDetailsChange("timezone", v)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMEZONES.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button>Save changes</Button>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="mt-8">
            <p className="text-muted-foreground text-sm mb-6">Choose the types of notification</p>
            <div className="space-y-4">
              {NOTIFICATION_OPTIONS.map((opt) => (
                <div key={opt.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={opt.id}
                    checked={notifications[opt.id] ?? false}
                    onCheckedChange={() => toggleNotification(opt.id)}
                  />
                  <Label htmlFor={opt.id} className="font-normal cursor-pointer text-sm">
                    {opt.label}
                  </Label>
                </div>
              ))}
            </div>
            <Button className="mt-6">Save changes</Button>
          </TabsContent>

          <TabsContent value="password" className="mt-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">Change password</h3>
            <Button asChild>
              <Link href={`/${locale}/login/forgot-password`}>Reset password</Link>
            </Button>
          </TabsContent>
        </Tabs>
      </main>
      <MobileTabbar />
      <Footer />
    </div>
  );
}
