"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { submitContact, type ContactState } from "@/app/actions/contact";
import { PR_ACCENT, boltTintMatrix } from "@/lib/theme";
import SectionLabel from "./SectionLabel";

function ContactLogo() {
  return (
    <span className="relative inline-block h-16 md:h-[88px]">
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <filter id="pr-bolt-tint-contact" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values={boltTintMatrix(PR_ACCENT)} />
          </filter>
        </defs>
      </svg>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/logo-power-rental.png"
        alt="Power Rental"
        className="h-full w-auto select-none block"
        style={{ filter: "brightness(0) invert(1)" }}
        draggable={false}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/logo-power-rental.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-auto select-none pointer-events-none"
        style={{ filter: "url(#pr-bolt-tint-contact)" }}
        draggable={false}
      />
    </span>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  multiline = false,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  multiline?: boolean;
  required?: boolean;
}) {
  const cls =
    "w-full bg-transparent border-0 border-b border-white/15 focus:border-white/60 outline-none py-3 text-[15px] md:text-[16px] text-white placeholder:text-white/30 transition-colors duration-200";
  return (
    <label className="flex flex-col gap-2 group/field">
      <span className="font-mono text-[10.5px] md:text-[11px] font-medium uppercase tracking-[0.16em] text-white/50">
        {label}
      </span>
      {multiline ? (
        <textarea name={name} placeholder={placeholder} required={required} rows={4} className={cls + " resize-none"} />
      ) : (
        <input name={name} type={type} placeholder={placeholder} required={required} className={cls} />
      )}
    </label>
  );
}

type Person = { name: string; email: string; phone?: string; wa?: string };

const PEOPLE: Person[] = [
  { name: "Gerente General", email: "vromo@powerrental.cl", phone: "+56 9 9998 7810", wa: "56999987810" },
  { name: "Jefatura Técnica", email: "vrm@powerrental.cl", phone: "+56 9 9918 0141", wa: "56999180141" },
  { name: "Administración", email: "info@powerrental.cl", phone: "+56 9 8461 3714", wa: "56984613714" },
];

function PersonCard({ c }: { c: Person }) {
  const linkCls =
    "group/link flex items-center gap-2.5 no-underline w-fit max-w-full transition-colors duration-200";
  const textCls =
    "text-[14px] md:text-[15px] text-white/65 group-hover/link:text-white transition-colors duration-200 truncate";
  return (
    <div className="flex flex-col gap-3 py-5 border-t border-white/10">
      <span className="text-[16px] md:text-[17px] text-white font-normal tracking-[-0.01em]">{c.name}</span>
      <div className="flex flex-col gap-3">
        <a href={`mailto:${c.email}`} className={linkCls}>
          <Image
            src="/assets/gmail.png"
            alt=""
            width={22}
            height={22}
            className="w-[22px] h-[22px] shrink-0 object-contain"
          />
          <span className={textCls}>{c.email}</span>
        </a>
        {c.phone && c.wa && (
          <a href={`https://wa.me/${c.wa}`} target="_blank" rel="noreferrer" className={linkCls}>
            <Image
              src="/assets/whatsapp.png"
              alt=""
              width={22}
              height={22}
              className="w-[22px] h-[22px] shrink-0 object-contain"
            />
            <span className={textCls}>{c.phone}</span>
          </a>
        )}
      </div>
    </div>
  );
}

function ResultDialog({ result, onClose }: { result: ContactState; onClose: () => void }) {
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    btnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const { ok, message } = result;
  return (
    <div
      className="pr-dialog-veil fixed inset-0 z-[2147483600] flex items-center justify-center px-5 py-8"
      style={{ background: "rgba(5,5,5,0.9)", backdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="pr-contact-dialog-title"
        onClick={(e) => e.stopPropagation()}
        className="pr-dialog-panel relative w-full max-w-[420px] flex flex-col items-center text-center gap-5 px-7 py-9 md:px-9 md:py-10 rounded-[1.5rem] border"
        style={{ background: "#131316", borderColor: "rgba(255,255,255,0.1)" }}
      >
        <span
          className="flex items-center justify-center w-12 h-12 rounded-full"
          style={{ background: ok ? "var(--pr-accent)" : "rgba(255,255,255,0.08)", color: "#fff" }}
        >
          {ok ? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
              aria-hidden="true"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
              aria-hidden="true"
            >
              <path d="M12 8v5" />
              <path d="M12 16.5v.5" />
              <circle cx="12" cy="12" r="9" />
            </svg>
          )}
        </span>
        <div className="flex flex-col gap-2.5">
          <h3
            id="pr-contact-dialog-title"
            className="font-display text-[24px] md:text-[27px] font-light text-white tracking-[-0.02em] leading-tight"
          >
            {ok ? "Solicitud enviada" : "No pudimos enviarla"}
          </h3>
          <p className="text-[14.5px] md:text-[15px] text-white/60 leading-relaxed">{message}</p>
        </div>
        <button
          ref={btnRef}
          type="button"
          onClick={onClose}
          className="mt-1 rounded-full px-7 py-2.5 text-[13px] font-medium tracking-wide transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
          style={
            ok
              ? { background: "var(--pr-accent)", color: "#fff" }
              : { background: "rgba(255,255,255,0.08)", color: "#fff" }
          }
        >
          {ok ? "Listo" : "Entendido"}
        </button>
      </div>
    </div>
  );
}

export default function Contact() {
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<ContactState | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setSending(true);
    try {
      const res = await submitContact(new FormData(form));
      setResult(res);
      if (res.ok) form.reset();
    } catch {
      setResult({
        ok: false,
        message: "Hubo un problema de conexión. Revisa tu red e inténtalo de nuevo.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      id="contacto"
      className="relative w-full overflow-hidden pt-20 md:pt-32 pb-8 md:pb-10"
      style={{ background: "#0F0F12" }}
    >
      <div className="pr-grid absolute inset-0 pointer-events-none" aria-hidden="true" />
      <div className="relative z-10 max-w-[1536px] mx-auto px-5 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-5 flex flex-col gap-10">
            <div className="flex flex-col gap-5">
              <SectionLabel label="Contacto" tone="light" />
              <h2 className="font-display text-[40px] md:text-[64px] font-light text-white tracking-[-0.025em] leading-[1.02]">
                Hablemos
                <br />
                de tu proyecto.
              </h2>
              <p className="text-[15px] md:text-[16px] text-white/55 leading-relaxed max-w-md">
                Cuéntanos qué necesitas. Recibirás una propuesta técnica y comercial en menos de 24
                horas.
              </p>
            </div>
            <div className="flex flex-col">
              {PEOPLE.map((p) => (
                <PersonCard key={p.email} c={p} />
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <form
              onSubmit={onSubmit}
              className="flex flex-col gap-8 p-6 md:p-10 rounded-[1.5rem] md:rounded-[2rem] border"
              style={{ background: "rgba(255,255,255,0.025)", borderColor: "rgba(255,255,255,0.08)" }}
            >
              {/* Honeypot anti-spam */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute -left-[9999px] h-0 w-0 opacity-0"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7">
                <Field label="Nombre" name="nombre" placeholder="Tu nombre" required />
                <Field label="Empresa" name="empresa" placeholder="Tu empresa u organización" />
                <Field label="Email" name="email" type="email" placeholder="tu@empresa.cl" required />
                <Field label="Teléfono" name="telefono" type="tel" placeholder="+56 9 1234 5678" />
                <div className="md:col-span-2">
                  <Field
                    label="Tipo de proyecto"
                    name="tipo"
                    placeholder="Evento, faena industrial, producción audiovisual…"
                  />
                </div>
                <div className="md:col-span-2">
                  <Field
                    label="Mensaje"
                    name="mensaje"
                    placeholder="Cuéntanos brevemente sobre tu proyecto."
                    multiline
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-5 pt-2">
                <p className="text-[12.5px] md:text-[13px] text-white/45 leading-relaxed max-w-sm">
                  Al enviar aceptas que un ejecutivo de Power Rental te contacte. Respondemos en menos
                  de 24 horas.
                </p>
                <button
                  type="submit"
                  disabled={sending}
                  className="group/send flex items-center justify-between rounded-full pl-2 pr-5 py-2 gap-3 transition-all duration-200 active:scale-[0.98] hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(44,46,255,0.5)] shrink-0 disabled:opacity-60 disabled:pointer-events-none"
                  style={{ background: "var(--pr-accent)", color: "#fff" }}
                >
                  <span className="bg-white/20 p-1.5 rounded-full flex items-center justify-center">
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
                      <path d="M7 17L17 7" />
                      <path d="M7 7h10v10" />
                    </svg>
                  </span>
                  <span className="text-[13px] font-medium tracking-wide">
                    {sending ? "Enviando…" : "Solicitar cotización"}
                  </span>
                </button>
              </div>
            </form>
            <div className="flex justify-center mt-10 md:mt-12">
              <ContactLogo />
            </div>
            {result && <ResultDialog result={result} onClose={() => setResult(null)} />}
          </div>
        </div>
      </div>
    </section>
  );
}
