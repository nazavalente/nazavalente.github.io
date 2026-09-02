"use client";

import { useState } from "react";
import { Github, Instagram, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { createContactMessage } from "@/lib/firestore";
import { SectionHeader } from "./SectionHeader";

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "", botField: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");

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
    const nextErrors = {};
    if (form.name.trim().length < 2) nextErrors.name = "Name must be at least 2 characters.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = "Enter a valid email address.";
    if (form.subject.trim().length < 3) nextErrors.subject = "Subject must be at least 3 characters.";
    if (form.message.trim().length < 10) nextErrors.message = "Message must be at least 10 characters.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    try {
      setStatus("Saving your message...");
      const { botField, ...payload } = form;
      await createContactMessage(payload);
      setForm({ name: "", email: "", subject: "", message: "", botField: "" });
      setStatus("Message saved successfully. I will follow up from the dashboard.");
    } catch (error) {
      setStatus(error.message || "Could not send message.");
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
          <form onSubmit={submit} className="grid gap-4">
            <div className="hidden" aria-hidden="true">
              <input type="text" name="botField" tabIndex={-1} value={form.botField} onChange={(e) => update("botField", e.target.value)} autoComplete="off" />
            </div>
            <Input label="Name" value={form.name} onChange={(e) => update("name", e.target.value)} error={errors.name} />
            <Input label="Email" value={form.email} onChange={(e) => update("email", e.target.value)} error={errors.email} />
            <Input label="Subject" value={form.subject} onChange={(e) => update("subject", e.target.value)} error={errors.subject} />
            <Textarea label="Message" value={form.message} onChange={(e) => update("message", e.target.value)} error={errors.message} />
            <Button type="submit">Send Message</Button>
            {status && <p className="text-sm text-slate-300">{status}</p>}
          </form>
        </Card>
      </div>
    </section>
  );
}
