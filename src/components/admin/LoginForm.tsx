"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { login } from "@/app/actions/admin";

export default function LoginForm() {
  const router = useRouter();
  const next = useSearchParams().get("next") || "/admin";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await login(new FormData(e.currentTarget));
      if (res.ok) {
        router.refresh();
        router.push(next);
      } else {
        setError(res.message);
      }
    } catch {
      setError("No se pudo iniciar sesión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5 w-full max-w-sm">
      <label className="flex flex-col gap-2">
        <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/50">
          Contraseña
        </span>
        <input
          name="password"
          type="password"
          autoFocus
          required
          placeholder="••••••••"
          className="w-full bg-transparent border-0 border-b border-white/15 focus:border-white/60 outline-none py-3 text-[16px] text-white placeholder:text-white/30 transition-colors duration-200"
        />
      </label>
      {error && <p className="text-[13px] text-red-300/90 -mt-1">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded-full px-6 py-3 text-[14px] font-medium tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none"
        style={{ background: "var(--pr-accent)", color: "#fff" }}
      >
        {loading ? "Ingresando…" : "Ingresar"}
      </button>
    </form>
  );
}
