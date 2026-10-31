import Image from "next/image";
import Link from "next/link";
import { getFeaturedProjects, type Project } from "@/lib/projects";
import SectionBackdrop from "./SectionBackdrop";
import SectionLabel from "./SectionLabel";

function ProjectCard({ p, large }: { p: Project; large: boolean }) {
  const hasImage = !!p.img;
  return (
    <Link
      href="/galeria"
      data-spotlight-exclude
      className={
        "group/proj relative overflow-hidden rounded-[1.25rem] md:rounded-[1.5rem] no-underline transition-transform duration-300 hover:-translate-y-1 " +
        (large
          ? "lg:col-span-2 lg:row-span-2 aspect-[4/3] lg:aspect-auto"
          : "aspect-[4/3] lg:aspect-auto")
      }
      style={{ background: "#1A1A1B" }}
    >
      {hasImage ? (
        <Image
          src={p.img!}
          alt={p.title}
          fill
          sizes={
            large
              ? "(min-width: 1024px) 50vw, 100vw"
              : "(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
          }
          className="object-cover transition-transform duration-[1200ms] ease-out group-hover/proj:scale-[1.04]"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-10 h-10 md:w-14 md:h-14"
            aria-hidden="true"
            style={{ color: "var(--pr-accent)", opacity: 0.7 }}
          >
            <path d="M13 2L4.5 13.5h6L9 22l9.5-12h-6L14 2z" />
          </svg>
        </div>
      )}

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      <span
        className="absolute top-5 right-5 md:top-6 md:right-6 w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center border border-white/20 bg-white/10 backdrop-blur-md transition-all duration-300 group-hover/proj:scale-110 group-hover/proj:-rotate-12 group-hover/proj:bg-[var(--pr-accent)] group-hover/proj:border-transparent"
        style={{ color: "#fff" }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
          aria-hidden="true"
        >
          <path d="M7 17L17 7" />
          <path d="M7 7h10v10" />
        </svg>
      </span>

      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7 flex flex-col gap-2">
        <span className="font-mono text-[10.5px] md:text-[11px] font-medium uppercase tracking-[0.16em] text-white/65">
          {p.kicker}
        </span>
        <h3
          className={
            "text-white font-normal tracking-[-0.01em] leading-[1.15] " +
            (large ? "text-[28px] md:text-[40px]" : "text-[20px] md:text-[24px]")
          }
        >
          {p.title}
        </h3>
        <span
          className="block h-[2px] w-9 mt-0.5 origin-left scale-x-0 group-hover/proj:scale-x-100 transition-transform duration-500 ease-out"
          style={{ background: "var(--pr-accent)" }}
          aria-hidden="true"
        />
        {large && p.desc && (
          <p className="text-[14px] md:text-[15px] text-white/60 leading-relaxed max-w-md mt-1">
            {p.desc}
          </p>
        )}
      </div>

      <span
        className="absolute inset-0 rounded-[1.25rem] md:rounded-[1.5rem] pointer-events-none opacity-0 group-hover/proj:opacity-100 transition-opacity duration-300"
        style={{
          boxShadow:
            "inset 0 0 0 1.5px var(--pr-accent), 0 18px 50px -12px color-mix(in oklab, var(--pr-accent) 45%, transparent)",
        }}
        aria-hidden="true"
      />
    </Link>
  );
}

/** Sección "Registros": los 4 proyectos destacados desde el panel admin. */
export default async function FeaturedProjects() {
  const projects = await getFeaturedProjects(4);
  return (
    <section
      id="registros"
      className="relative w-full overflow-hidden py-20 md:py-32"
      style={{ background: "#0F0F12" }}
    >
      <SectionBackdrop tone="dark" aura="tr" auraStrength={10} />
      <div className="relative z-10 max-w-[1536px] mx-auto px-5 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12 md:mb-16">
          <div className="flex flex-col gap-4 max-w-2xl">
            <SectionLabel label="Registros" tone="light" />
            <h2 className="font-display text-[40px] md:text-[64px] font-light text-white tracking-[-0.025em] leading-[1.02]">
              Energía que dejó
              <br />
              huella.
            </h2>
          </div>
          <Link
            href="/galeria"
            className="group/all flex items-center gap-3 rounded-full pl-5 pr-2 py-2 w-fit shrink-0 no-underline transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] hover:shadow-[0_0_30px_rgba(44,46,255,0.5)]"
            style={{ background: "var(--pr-accent)", color: "#fff" }}
          >
            <span className="text-[13px] md:text-[14px] font-medium tracking-wide">
              Ver todos los registros
            </span>
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
          </Link>
        </div>

        {projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:auto-rows-[240px] xl:auto-rows-[280px]">
            {projects.map((p, i) => (
              <ProjectCard key={p.id} p={p} large={i === 0} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
