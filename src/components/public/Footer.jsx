import Link from "next/link";
import { Github, Instagram, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/60 py-8">
      <div className="container flex flex-col items-center justify-between gap-5 border-t border-white/10 pt-6 text-sm text-slate-400 md:flex-row">
        <p>©Copyright 2026 <span className="text-teal-200">Nazario Jose Valente da Cruz</span> All Rights Reserved</p>
        <div className="flex items-center gap-4">
          <span className="font-semibold text-white">Stay connected</span>
          <Link href="mailto:nazario.valente03@gmail.com" className="transition hover:text-teal-200" aria-label="Email">
            <Mail className="h-4 w-4" />
          </Link>
          <Link href="https://www.linkedin.com/in/nazario-valente/" className="transition hover:text-teal-200" aria-label="LinkedIn">
            <Linkedin className="h-4 w-4" />
          </Link>
          <Link href="https://www.instagram.com/naza_valente/" className="transition hover:text-teal-200" aria-label="Instagram">
            <Instagram className="h-4 w-4" />
          </Link>
          <Link href="https://github.com/nazavalente" className="transition hover:text-teal-200" aria-label="GitHub">
            <Github className="h-4 w-4" />
          </Link>
          <Link href="/admin/login" className="text-xs transition hover:text-teal-200">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
