"use client";

import { useState } from "react";
import { Github, Instagram, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { createContactMessage } from "@/lib/firestore";
import { SectionHeader } from "./SectionHeader";

// Must stay in sync with the contactMessages rule in firebase/firestore.rules;
// anything the rule rejects surfaces as a generic permission error.
const LIMITS = {
  name: { min: 2, max: 100 },
  email: { max: 200 },
  subject: { min: 3, max: 200 },
  message: { min: 10, max: 5000 }
};
const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "", botField: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  }

  async function submit(event) {
    event.preventDefault();
    if (form.botField) {
      // Honeypot triggered: simulate success silently without writing to database
      setStatus("Message saved successfully. I will follow up from the dashboard.");
      setForm({ name: "", email: "", subject: "", message: "", botField: "" });
      return;
    }
    if (submitting) return;
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      subject: form.subject.trim(),
      message: form.message.trim()
    };
    const nextErrors = {};
    if (payload.name.length < LIMITS.name.min) nextErrors.name = `Name must be at least ${LIMITS.name.min} characters.`;
    if (payload.name.length > LIMITS.name.max) nextErrors.name = `Name must be at most ${LIMITS.name.max} characters.`;
    if (!EMAIL_PATTERN.test(payload.email) || payload.email.length > LIMITS.email.max) nextErrors.email = "Enter a valid email address.";
    if (payload.subject.length < LIMITS.subject.min) nextErrors.subject = `Subject must be at least ${LIMITS.subject.min} characters.`;
    if (payload.subject.length > LIMITS.subject.max) nextErrors.subject = `Subject must be at most ${LIMITS.subject.max} characters.`;
    if (payload.message.length < LIMITS.message.min) nextErrors.message = `Message must be at least ${LIMITS.message.min} characters.`;
    if (payload.message.length > LIMITS.message.max) nextErrors.message = `Message must be at most ${LIMITS.message.max} characters.`;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    try {
      setSubmitting(true);
      setStatus("Saving your message...");
      await createContactMessage(payload);
      setForm({ name: "", email: "", subject: "", message: "", botField: "" });
      setStatus("Message saved successfully. I will follow up from the dashboard.");
    } catch (error) {
      // Firebase errors are not meant for visitors; keep the detail in the console.
      console.error("Contact form submission failed:", error);
      setStatus("Could not send your message right now. Please try again later or email me directly.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="section">
      <div className="container grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <SectionHeader eyebrow="Contact" title="Let us talk about the next build." description="Use the form to save a message directly into Firestore. Email sending can be added later with Firebase Functions." />
          <div className="grid gap-3 text-sm text-slate-300">
            <a href="mailto:nazario.valente03@gmail.com" className="flex items-center gap-3 transition hover:text-white"><Mail className="h-4 w-4 text-teal-200" /> nazario.valente03@gmail.com</a>
            <a href="https://www.linkedin.com/in/nazario-valente/" target="_blank" rel="noreferrer" className="flex items-center gap-3 transition hover:text-white"><Linkedin className="h-4 w-4 text-teal-200" /> linkedin.com/in/nazario-valente</a>
            <a href="https://www.instagram.com/naza_valente/" target="_blank" rel="noreferrer" className="flex items-center gap-3 transition hover:text-white"><Instagram className="h-4 w-4 text-teal-200" /> instagram.com/naza_valente</a>
            <a href="https://github.com/nazavalente" target="_blank" rel="noreferrer" className="flex items-center gap-3 transition hover:text-white"><Github className="h-4 w-4 text-teal-200" /> github.com/nazavalente</a>
          </div>
        </div>
        <Card>
          <form onSubmit={submit} className="grid gap-4" noValidate>
            <div className="hidden" aria-hidden="true">
              <input type="text" name="botField" tabIndex={-1} value={form.botField} onChange={(e) => update("botField", e.target.value)} autoComplete="off" />
            </div>
            <Input label="Name" name="name" autoComplete="name" maxLength={LIMITS.name.max} value={form.name} onChange={(e) => update("name", e.target.value)} error={errors.name} />
            <Input label="Email" name="email" type="email" autoComplete="email" maxLength={LIMITS.email.max} value={form.email} onChange={(e) => update("email", e.target.value)} error={errors.email} />
            <Input label="Subject" name="subject" maxLength={LIMITS.subject.max} value={form.subject} onChange={(e) => update("subject", e.target.value)} error={errors.subject} />
            <Textarea label="Message" name="message" maxLength={LIMITS.message.max} value={form.message} onChange={(e) => update("message", e.target.value)} error={errors.message} />
            <Button type="submit" disabled={submitting}>{submitting ? "Sending..." : "Send Message"}</Button>
            {status && <p className="text-sm text-slate-300" role="status">{status}</p>}
          </form>
        </Card>
      </div>
    </section>
  );
}
