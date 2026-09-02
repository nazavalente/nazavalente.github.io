"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Code2, Database, Github, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-14 md:pb-24 md:pt-24">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-200/50 to-transparent" />
      <div className="absolute left-1/2 top-8 h-80 w-80 -translate-x-1/2 rounded-full bg-teal-300/12 blur-3xl" />
      <div className="absolute right-0 top-32 h-72 w-72 rounded-full bg-indigo-300/10 blur-3xl" />
      <div className="container grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr]">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
          <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/7 px-4 py-2 text-sm text-teal-100 shadow-glow backdrop-blur">
            <Sparkles className="h-4 w-4" /> Informatics Student | Full-Stack Developer | Data Analyst Enthusiast
          </div>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="relative h-36 w-36 shrink-0 overflow-hidden rounded-full border-2 border-teal-200/70 shadow-[0_0_45px_rgba(45,212,191,0.24)] sm:h-44 sm:w-44">
              <Image
                src="/images/nazario-portrait.jpeg"
                alt="Nazario Jose Valente da Cruz"
                width={176}
                height={176}
                priority
                className="h-full w-full scale-[1.35] object-cover object-[50%_64%]"
              />
            </div>
            <h1 className="max-w-3xl text-4xl font-semibold leading-[1.04] text-white sm:text-5xl md:text-6xl">
              Nazario Jose Valente da Cruz
            </h1>
          </div>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
            Building digital solutions through data, design, and clean technology.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button href="/projects">View Projects <ArrowRight className="h-4 w-4" /></Button>
            <Button href="https://github.com/nazavalente" variant="secondary"><Github className="h-4 w-4" /> GitHub</Button>
            <Button href="/contact" variant="secondary"><Mail className="h-4 w-4" /> Contact Me</Button>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.12, ease: "easeOut" }} className="relative">
          <div className="premium-border glass relative mx-auto max-w-xl overflow-hidden rounded-[2rem] p-5 sm:p-6">
            <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(45,212,191,0.18),transparent_34%,rgba(129,140,248,0.18))]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:52px_52px]" />
            <div className="relative space-y-5">
              <div className="rounded-2xl border border-white/10 bg-slate-950/65 p-5 shadow-soft backdrop-blur">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="section-kicker">Portfolio Focus</p>
                    <h2 className="mt-3 text-2xl font-semibold text-white">Full-stack, data, and product quality</h2>
                  </div>
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-teal-300 text-slate-950">
                    <Code2 className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-2 text-center text-xs text-slate-300">
                  <span className="rounded-full border border-white/10 px-3 py-2">React</span>
                  <span className="rounded-full border border-white/10 px-3 py-2">Laravel</span>
                  <span className="rounded-full border border-white/10 px-3 py-2">Python</span>
                </div>
              </div>
              {[
                { icon: Code2, index: "01", title: "Full-Stack Systems", body: "Interfaces and APIs alike, from React to Laravel" },
                { icon: Database, index: "02", title: "Data Workflows", body: "Python analysis, notebooks, and model experiments" },
                { icon: ShieldCheck, index: "03", title: "Software Quality", body: "Validation, testing, debugging, and product polish" },
              ].map((item) => (
                <motion.div
                  key={item.title}
                  whileHover={{ y: -3 }}
                  className="flex items-center gap-5 rounded-2xl border border-white/10 bg-slate-950/60 p-5 shadow-soft backdrop-blur"
                >
                  <item.icon className="h-6 w-6 shrink-0 text-teal-200" />
                  <div>
                    <p className="text-sm font-semibold text-teal-200">{item.index} <span className="text-white">{item.title}</span></p>
                    <p className="mt-1 text-sm text-slate-400">{item.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
