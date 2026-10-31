import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default function AdminHeader({ backTo = "/admin" }: { backTo?: string }) {
  const toPanel = backTo === "/admin";
  return (
    <header className="max-w-[1100px] mx-auto px-5 md:px-8 py-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/" className="inline-flex items-center gap-2.5 text-white/90">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
            aria-hidden="true"
            style={{ color: "var(--pr-accent)" }}
          >
            <path d="M13 2L4.5 13.5h6L9 22l9.5-12h-6L14 2z" />
          </svg>
          <span className="text-[14px] font-medium tracking-[0.02em]">Power Rental · Admin</span>
        </Link>
        <Link href={backTo} className="text-[13px] text-white/45 hover:text-white/80 transition-colors">
          {toPanel ? "← Panel" : "← Volver al sitio"}
        </Link>
      </div>
      <div className="flex items-center gap-2.5">
        <a
          href="/galeria"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-medium border transition-colors hover:bg-white/5"
          style={{ borderColor: "rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.85)" }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3.5 h-3.5"
            aria-hidden="true"
          >
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
            <path d="M15 3h6v6M10 14L21 3" />
          </svg>
          Ver galería
        </a>
        <LogoutButton />
      </div>
    </header>
  );
}
