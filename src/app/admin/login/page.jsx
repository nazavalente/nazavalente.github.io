"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { loginAdmin } from "@/lib/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");

  async function submit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = "Enter your Firebase Auth email.";
    if (form.password.length < 6) nextErrors.password = "Password must be at least 6 characters.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    try {
      setStatus("Signing in...");
      await loginAdmin(form.email, form.password);
      router.push("/admin/dashboard");
    } catch (error) {
      setStatus(error.message || "Login failed.");
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-ink p-4">
      <Card className="w-full max-w-md">
        <div className="mb-6">
          <span className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-teal-300 text-slate-950"><Lock /></span>
          <h1 className="text-2xl font-semibold text-white">Admin Login</h1>
          <p className="mt-2 text-sm text-slate-400">Use a Firebase Authentication email/password account.</p>
        </div>
        <form onSubmit={submit} className="grid gap-4">
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} />
          <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} error={errors.password} />
          <Button type="submit">Login</Button>
          {status && <p className="text-sm text-slate-300">{status}</p>}
        </form>
      </Card>
    </main>
  );
}
