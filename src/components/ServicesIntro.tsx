import BoltMark from "./BoltMark";
import SectionBackdrop from "./SectionBackdrop";
import SectionLabel from "./SectionLabel";
import ShowreelVideo from "./ShowreelVideo";

export default function ServicesIntro() {
  return (
    <section className="relative w-full overflow-hidden" style={{ background: "#FAFAFA" }}>
      <SectionBackdrop tone="light" aura="none" grain={4} />
      <div className="relative z-10 max-w-[1536px] mx-auto px-5 md:px-10 pt-20 md:pt-32 pb-16 md:pb-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 md:gap-16">
          <div className="flex flex-col gap-5 md:gap-6 max-w-3xl">
            <SectionLabel label="Lo que viene" />
            <p className="font-display text-[22px] sm:text-[28px] md:text-[36px] lg:text-[44px] font-light text-[#0A0A0B] tracking-[-0.02em] leading-[1.1]">
              Cuatro disciplinas. <span className="text-black/40">Una sola operación,</span>
              <br className="hidden md:inline" /> de principio a fin.
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
            <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.18em] text-black/45">
              Sigue scrolleando
            </span>
            <div className="flex items-center gap-2">
              <span className="block h-px w-12 bg-black/25" />
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 text-black/55 pr-arrow-bounce"
                aria-hidden="true"
              >
                <path d="M12 5v14" />
                <path d="M6 13l6 6 6-6" />
              </svg>
            </div>
          </div>
        </div>

        <ShowreelVideo />

        <div className="mt-14 md:mt-20 flex items-center gap-3">
          <BoltMark className="w-[11px] h-[19px] text-black/20" />
          <span className="block h-px flex-1 bg-black/10" />
          <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.16em] tabular-nums text-black/35 px-2">
            Servicios · 01 → 05
          </span>
          <span className="block h-px flex-1 bg-black/10" />
          <BoltMark className="w-[11px] h-[19px]" style={{ color: "var(--pr-accent)" }} />
        </div>
      </div>
    </section>
  );
}
