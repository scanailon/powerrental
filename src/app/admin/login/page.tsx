import type { Metadata } from "next";
import { Suspense } from "react";
import { pageVars } from "@/lib/theme";
import LoginForm from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Admin · Power Rental",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-5 py-16"
      style={{ background: "#0A0A0B", ...pageVars }}
    >
      <div className="flex flex-col items-center gap-8 w-full">
        <span className="relative inline-flex items-center gap-3 text-white/90">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
            aria-hidden="true"
            style={{ color: "var(--pr-accent)" }}
          >
            <path d="M13 2L4.5 13.5h6L9 22l9.5-12h-6L14 2z" />
          </svg>
          <span className="text-[15px] font-medium tracking-[0.02em]">Power Rental · Admin</span>
        </span>
        <div
          className="w-full max-w-sm rounded-[1.5rem] border p-8 md:p-10 flex flex-col items-center gap-7"
          style={{ background: "#0F0F12", borderColor: "rgba(255,255,255,0.08)" }}
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-[22px] md:text-[24px] font-light text-white tracking-[-0.01em]">
              Acceso privado
            </h1>
            <p className="text-[13px] text-white/50 leading-relaxed">
              Ingresa la contraseña para administrar la galería.
            </p>
          </div>
          {/* LoginForm usa useSearchParams → necesita Suspense */}
          <Suspense fallback={<div className="h-12" />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
