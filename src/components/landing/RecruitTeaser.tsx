"use client";

import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { supabase } from "@/integrations/supabase/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { jobPositions } from "@/components/careers/careers-data";
import type { Lang } from "@/lib/translations";

import { Reveal } from "./Reveal";
import recruitImage from "@/assets/gallery/chronos-public-reception.webp";

interface RecruitTeaserProps {
  lang: Lang;
  t: {
    recruitTeaser: {
      label: string;
      title: string;
      titleAccent: string;
      subtitle: string;
      name: string;
      contact: string;
      position: string;
      positionPlaceholder: string;
      submit: string;
      success: string;
      viewAll: string;
    };
  };
}

const applicationSchema = z.object({
  name: z.string().trim().min(1).max(100),
  contact: z.string().trim().min(3).max(255),
  position: z.string().trim().min(1).max(64),
});

export function RecruitTeaser({ lang, t }: RecruitTeaserProps) {
  const tr = t.recruitTeaser;
  const vi = lang === "vi";
  const [values, setValues] = useState({ name: "", contact: "", position: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = applicationSchema.safeParse(values);
    if (!parsed.success) {
      toast.error(vi ? "Vui lòng điền đầy đủ thông tin hợp lệ." : "Please fill in all fields.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("job_applications").insert({
      full_name: parsed.data.name,
      contact: parsed.data.contact,
      position_id: parsed.data.position,
    });
    setSubmitting(false);
    if (error) {
      toast.error(vi ? "Gửi hồ sơ thất bại, vui lòng thử lại." : "Submission failed, please try again.");
      return;
    }
    toast.success(tr.success);
    setValues({ name: "", contact: "", position: "" });
  };

  return (
    <section id="recruit" className="bg-chronos-ivory py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-20 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-20">
          <Reveal className="order-1 lg:order-2">
            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-chronos-sand-100 shadow-2xl">
                <img
                  src={recruitImage}
                  alt="Chronos Cruise reception and hospitality team"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-1000 hover:scale-105"
                />
              </div>
              <div className="absolute -top-10 -right-10 hidden h-40 w-40 border border-chronos-sand-300/30 md:block" />
              <div className="absolute -bottom-6 -left-6 -z-10 h-full w-full border border-chronos-sand-300/20" />
            </div>
          </Reveal>

          <Reveal delay={160} className="order-2 lg:order-1">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="font-display text-4xl font-normal leading-tight text-chronos-sand-900 md:text-5xl lg:text-6xl">
                  {tr.title} <span className="font-display italic font-light text-chronos-sand-500">{tr.titleAccent}</span>
                </h2>
                <div className="h-px w-20 bg-chronos-sand-500" />
              </div>
              <p className="text-lg font-light leading-relaxed text-chronos-sand-700">{tr.subtitle}</p>

              <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="recruit-name" className="text-xs uppercase tracking-[0.2em] text-chronos-sand-500">
                    {tr.name}
                  </Label>
                  <Input
                    id="recruit-name"
                    value={values.name}
                    onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
                    required
                    className="field-underline h-10 border-chronos-sand-300/40 text-chronos-sand-900 transition-colors placeholder:text-chronos-sand-300/50 focus:border-chronos-sand-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recruit-contact" className="text-xs uppercase tracking-[0.2em] text-chronos-sand-500">
                    {tr.contact}
                  </Label>
                  <Input
                    id="recruit-contact"
                    value={values.contact}
                    onChange={(e) => setValues((v) => ({ ...v, contact: e.target.value }))}
                    required
                    className="field-underline h-10 border-chronos-sand-300/40 text-chronos-sand-900 transition-colors placeholder:text-chronos-sand-300/50 focus:border-chronos-sand-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recruit-position" className="text-xs uppercase tracking-[0.2em] text-chronos-sand-500">
                    {tr.position}
                  </Label>
                  <select
                    id="recruit-position"
                    value={values.position}
                    onChange={(e) => setValues((v) => ({ ...v, position: e.target.value }))}
                    required
                    className="field-underline h-10 w-full border-chronos-sand-300/40 bg-transparent text-sm text-chronos-sand-900 transition-colors focus:border-chronos-sand-700 focus:outline-none"
                  >
                    <option value="" disabled>
                      {tr.positionPlaceholder}
                    </option>
                    {jobPositions.map((job) => (
                      <option key={job.id} value={job.id}>
                        {vi ? job.titleVi : job.titleEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col items-start gap-6 pt-4 sm:flex-row sm:items-center">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-none bg-chronos-sand-700 px-8 text-xs font-semibold uppercase tracking-[0.2em] text-chronos-ivory transition-colors hover:bg-chronos-sand-900 sm:w-auto"
                  >
                    {submitting ? "..." : tr.submit}
                  </Button>
                  <Link
                    to="/careers"
                    className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-chronos-sand-700 transition-colors hover:text-chronos-sand-500"
                  >
                    {tr.viewAll}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </form>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
