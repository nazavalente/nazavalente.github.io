"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  ["Home", "/"],
  ["About", "/#about"],
  ["Projects", "/projects"],
  ["GitHub", "/github"],
  ["Achievements", "/achievements"],
  ["Skills", "/#skills"],
  ["Experience", "/experience"],
  ["Certificates", "/certificates"],
  ["Contact", "/contact"]
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/75 backdrop-blur-xl">
      <nav className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3 font-semibold text-white">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-teal-300 text-sm font-bold tracking-tight text-slate-950">NZ</span>
          <span className="hidden sm:inline">Nazario J. V. da Cruz</span>
        </Link>
        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map(([label, href]) => (
            <Link key={label} href={href} className="rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-white/8 hover:text-white">{label}</Link>
          ))}
        </div>
        <button className="focus-ring rounded-lg p-2 text-white lg:hidden" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </nav>
      {open && (
        <div className="border-t border-white/10 bg-ink px-4 py-3 lg:hidden">
          <div className="grid gap-1">
            {navItems.map(([label, href]) => (
              <Link key={label} href={href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-sm text-slate-200 hover:bg-white/8">{label}</Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
