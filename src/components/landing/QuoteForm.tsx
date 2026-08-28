"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { Reveal } from "./Reveal";

interface QuoteFormProps {
  t: {
    teaserForm: {
      label: string;
      title: string;
      subtitle: string;
      name: string;
      phone: string;
      email: string;
      message: string;
      submit: string;
      success: string;
    };
    footer: {
      contact: string[];
    };
  };
}

export function QuoteForm({ t }: QuoteFormProps) {
  const tr = t.teaserForm;
  const [values, setValues] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(tr.success);
    setValues({ name: "", phone: "", email: "", message: "" });
  };

  return (
    <section id="quote" className="bg-chronos-ivory py-24 lg:py-32">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="grid gap-16 md:grid-cols-5 md:gap-20">
          <Reveal className="md:col-span-2 space-y-8">
            <p className="text-xs uppercase tracking-[0.3em] text-chronos-sand-500">{tr.label}</p>
            <h2 className="font-display text-4xl font-normal text-chronos-sand-900">{tr.title}</h2>
            <p className="leading-relaxed text-chronos-sand-700">{tr.subtitle}</p>
            <div className="space-y-4 pt-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-chronos-sand-500">Hotline</p>
              <p className="text-xl font-light text-chronos-sand-900">{t.footer.contact[0]}</p>
            </div>
          </Reveal>

          <Reveal as="form" onSubmit={handleSubmit} className="md:col-span-3">
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="quote-name" className="text-xs uppercase tracking-[0.2em] text-chronos-sand-500">
                  {tr.name}
                </Label>
                <Input
                  id="quote-name"
                  value={values.name}
                  onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
                  required
                  className="field-underline h-12 border-chronos-sand-300/40 text-chronos-sand-900 transition-colors placeholder:text-chronos-sand-300/50 focus:border-chronos-sand-700"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="quote-phone" className="text-xs uppercase tracking-[0.2em] text-chronos-sand-500">
                  {tr.phone}
                </Label>
                <Input
                  id="quote-phone"
                  type="tel"
                  value={values.phone}
                  onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))}
                  required
                  className="field-underline h-12 border-chronos-sand-300/40 text-chronos-sand-900 transition-colors placeholder:text-chronos-sand-300/50 focus:border-chronos-sand-700"
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <Label htmlFor="quote-message" className="text-xs uppercase tracking-[0.2em] text-chronos-sand-500">
                  {tr.message}
                </Label>
                <Textarea
                  id="quote-message"
                  rows={2}
                  value={values.message}
                  onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
                  className="field-underline border-chronos-sand-300/40 text-chronos-sand-900 transition-colors placeholder:text-chronos-sand-300/50 focus:border-chronos-sand-700"
                />
              </div>
              <div className="sm:col-span-2 pt-4">
                <Button
                  type="submit"
                  className="w-full rounded-none bg-chronos-sand-700 px-16 py-4 text-xs font-medium uppercase tracking-[0.2em] text-chronos-ivory transition-all duration-500 hover:bg-chronos-sand-900 md:w-auto"
                >
                  {tr.submit}
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
