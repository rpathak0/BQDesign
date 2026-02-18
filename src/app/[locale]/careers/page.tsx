"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileTabbar } from "@/components/layout/mobile-tabbar";
import { SectionHero } from "@/components/marketing";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CAREERS_JOBS,
  CAREERS_OFFICES,
  CAREERS_VALUES,
  CAREERS_PERKS,
  CAREERS_DEPARTMENTS,
  CAREERS_LOCATIONS,
  CAREERS_TYPES,
} from "@/data/careers";
import { TrendingUp, Scale, Users, Lightbulb, Shield, ArrowUp, GraduationCap, Star, Heart, Calendar, Search, Linkedin } from "lucide-react";
const VALUE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "trending-up": TrendingUp,
  scale: Scale,
  users: Users,
  lightbulb: Lightbulb,
  shield: Shield,
};

const PERK_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "arrow-up": ArrowUp,
  "graduation-cap": GraduationCap,
  star: Star,
  heart: Heart,
  calendar: Calendar,
};

export default function CareersPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const base = `/${locale}`;

  const [department, setDepartment] = useState("All");
  const [location, setLocation] = useState("All");
  const [type, setType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredJobs = useMemo(() => {
    return CAREERS_JOBS.filter((job) => {
      if (department !== "All" && job.department !== department) return false;
      if (location !== "All" && job.location !== location) return false;
      if (type !== "All" && job.type !== type) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!job.title.toLowerCase().includes(q) && !job.department.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [department, location, type, searchQuery]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar variant="light" />
      <main className="flex-1 pt-20 md:pt-24">
        <SectionHero
          title="Dream big with BookingQube"
          subtitle="Join a team that's shaping the future of ticketing and experiences in the region. We're looking for passionate people who want to grow with us."
          primaryCta={{ label: "Explore Our Open Roles", href: "#job-openings" }}
        />

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-5 md:px-6">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-center text-foreground mb-10">
              Feel what it&apos;s like working with our awesome team
            </h2>
            <div className="max-w-4xl mx-auto aspect-video rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
              [Video placeholder – company culture]
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 border-t border-border/50">
          <div className="container mx-auto px-4 sm:px-5 md:px-6">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-center text-foreground mb-10">
              About us
            </h2>
            <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto items-center">
              <div className="space-y-4 text-muted-foreground">
                <p>
                  BookingQube is your premium gateway to movies, events, and experiences. We partner with leading venues and promoters to bring you the best tickets and offers in one place.
                </p>
                <p>
                  Our mission is to make booking simple, secure, and enjoyable—whether you&apos;re planning a night out or a once-in-a-lifetime event. We&apos;re building a team that shares that mission.
                </p>
              </div>
              <div className="flex gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex-1 aspect-square rounded-xl bg-muted" />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-5 md:px-6">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-center text-foreground mb-10">
              Our Achievements
            </h2>
            <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
              <Card className="rounded-xl text-center">
                <CardContent className="p-6">
                  <p className="text-3xl font-display font-bold text-primary">20+</p>
                  <p className="text-sm text-muted-foreground mt-1">Markets</p>
                  <p className="text-xs text-muted-foreground mt-2">A growing operation spanning across multiple regions and cultures.</p>
                </CardContent>
              </Card>
              <Card className="rounded-xl text-center">
                <CardContent className="p-6">
                  <p className="text-3xl font-display font-bold text-primary">50+</p>
                  <p className="text-sm text-muted-foreground mt-1">Years</p>
                  <p className="text-xs text-muted-foreground mt-2">Combined experience in ticketing and events.</p>
                </CardContent>
              </Card>
              <Card className="rounded-xl text-center">
                <CardContent className="p-6">
                  <p className="text-3xl font-display font-bold text-primary">5,000+</p>
                  <p className="text-sm text-muted-foreground mt-1">Experiences</p>
                  <p className="text-xs text-muted-foreground mt-2">Events and attractions listed on our platform.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-5 md:px-6">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-center text-foreground mb-10">
              Our Values
            </h2>
            <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
              {CAREERS_VALUES.map((v) => {
                const Icon = v.icon ? VALUE_ICONS[v.icon as keyof typeof VALUE_ICONS] : null;
                return (
                  <Card key={v.id} className="rounded-xl border-primary/20 bg-primary/5">
                    <CardContent className="p-6">
                    {Icon && <Icon className="w-6 h-6 text-primary mb-3" />}
                    <h3 className="font-semibold text-foreground mb-2">{v.title}</h3>
                    <p className="text-sm text-muted-foreground">{v.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 border-t border-border/50">
          <div className="container mx-auto px-4 sm:px-5 md:px-6 max-w-2xl text-center">
            <h2 className="text-2xl font-display font-bold text-foreground mb-4">
              BookingQube Emerging Talent
            </h2>
            <p className="text-muted-foreground">
              We believe in nurturing emerging talent. Whether you&apos;re starting your career or switching paths, we offer mentorship and growth opportunities to help you succeed.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-5 md:px-6">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-center text-foreground mb-10">
              The perks of working with us
            </h2>
            <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
              {CAREERS_PERKS.map((p) => {
                const Icon = p.icon ? PERK_ICONS[p.icon as keyof typeof PERK_ICONS] : null;
                return (
                  <Card key={p.id} className="rounded-xl border-primary/20 bg-primary/5">
                    <CardContent className="p-6">
                    {Icon && <Icon className="w-6 h-6 text-primary mb-3" />}
                    <h3 className="font-semibold text-foreground mb-2">{p.title}</h3>
                    <p className="text-sm text-muted-foreground">{p.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-5 md:px-6">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-center text-foreground mb-10">
              Our Offices
            </h2>
            <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
              {CAREERS_OFFICES.map((o) => (
                <Card key={o.id} className="rounded-xl overflow-hidden">
                  <div className="aspect-square bg-muted" />
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground">{o.name}</h3>
                    <p className="text-sm text-muted-foreground">{o.officeCount} Offices</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="job-openings" className="py-12 md:py-16 border-t border-border/50 scroll-mt-24">
          <div className="container mx-auto px-4 sm:px-5 md:px-6">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-center text-foreground mb-10">
              Job Openings
            </h2>
            <div className="flex flex-wrap gap-3 mb-6">
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  {CAREERS_DEPARTMENTS.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  {CAREERS_LOCATIONS.map((l) => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {CAREERS_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search here..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="rounded-xl border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead className="text-right">Apply</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJobs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No jobs match your filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredJobs.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{job.title}</p>
                            {job.subtitle && <p className="text-xs text-muted-foreground">{job.subtitle}</p>}
                          </div>
                        </TableCell>
                        <TableCell>{job.department}</TableCell>
                        <TableCell>{job.location}</TableCell>
                        <TableCell>{job.type}</TableCell>
                        <TableCell>{job.experience}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" asChild>
                            <Link href={`${base}/contact?subject=Application: ${encodeURIComponent(job.title)}`}>Apply Now</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 border-t border-border/50">
          <div className="container mx-auto px-4 sm:px-5 md:px-6 text-center">
            <h2 className="text-2xl font-display font-bold text-foreground mb-4">
              Follow us on LinkedIn
            </h2>
            <Button size="lg" variant="outline" className="rounded-full w-14 h-14 p-0" asChild>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin className="w-7 h-7" />
              </a>
            </Button>
          </div>
        </section>
      </main>
      <MobileTabbar />
      <Footer />
    </div>
  );
}
