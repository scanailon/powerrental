import { Fragment } from "react";
import BoltMark from "./BoltMark";
import SectionBackdrop from "./SectionBackdrop";

function MarqueeRow({ rowKey, events }: { rowKey: string; events: string[] }) {
  return (
    <div className="flex items-center shrink-0">
      {events.map((name, i) => (
        <Fragment key={`${rowKey}-${i}`}>
          <span className="pr-marquee-item whitespace-nowrap">{name}</span>
          <BoltMark
            className="inline-block w-[13px] h-[22px] md:w-[16px] md:h-[27px] mx-8 md:mx-14"
            style={{ color: "var(--pr-accent)" }}
          />
        </Fragment>
      ))}
    </div>
  );
}

/** Cinta "Hemos energizado" con los eventos administrados desde el panel. */
export default function EventsMarquee({ events }: { events: string[] }) {
  const hasEvents = events.length > 0;
  // Repite la lista hasta llenar ~260 caracteres para que la cinta no quede corta.
  const repeats = Math.max(
    1,
    Math.ceil(260 / (events.reduce((n, e) => n + (e.length + 6), 0) || 1)),
  );
  const items = hasEvents ? Array.from({ length: repeats }, () => events).flat() : [];
  // Velocidad constante sin importar el largo del contenido.
  const duration = Math.round(items.reduce((n, e) => n + (e.length + 6), 0) * 0.21);

  return (
    <section
      className="relative w-full overflow-hidden py-14 md:py-20"
      style={{ background: "#FAFAFA" }}
      aria-label="Eventos energizados por Power Rental"
    >
      <SectionBackdrop tone="light" aura="tr" auraStrength={7} />

      <div className="relative z-10 max-w-[1536px] mx-auto px-5 md:px-10 mb-10 md:mb-12 flex items-center justify-center gap-5 md:gap-7">
        <span
          className="h-px flex-1 max-w-[90px] md:max-w-[140px]"
          style={{ background: "rgba(10,10,11,0.16)" }}
          aria-hidden="true"
        />
        <span className="flex items-center gap-3">
          <span
            className="relative flex w-[12px] h-[21px] shrink-0"
            style={{ color: "var(--pr-accent)" }}
            aria-hidden="true"
          >
            <BoltMark
              className="absolute inset-0 w-full h-full animate-ping opacity-50"
              style={{ animationDuration: "2.6s" }}
            />
            <BoltMark className="relative w-full h-full" />
          </span>
          <span className="font-mono text-[12px] md:text-[13px] font-medium uppercase tracking-[0.22em] text-black/70 whitespace-nowrap">
            Hemos energizado
          </span>
        </span>
        <span
          className="h-px flex-1 max-w-[90px] md:max-w-[140px]"
          style={{ background: "rgba(10,10,11,0.16)" }}
          aria-hidden="true"
        />
      </div>

      {hasEvents && (
        <div
          className="relative z-10 flex items-center w-max pr-marquee-track"
          style={{ animationDuration: `${duration}s` }}
          aria-hidden="true"
        >
          <MarqueeRow rowKey="a" events={items} />
          <MarqueeRow rowKey="b" events={items} />
        </div>
      )}

      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-24 md:w-48 z-10"
        style={{ background: "linear-gradient(90deg, #FAFAFA 0%, rgba(250,250,250,0) 100%)" }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-24 md:w-48 z-10"
        style={{ background: "linear-gradient(270deg, #FAFAFA 0%, rgba(250,250,250,0) 100%)" }}
      />
    </section>
  );
}
