/** Transición curva entre dos secciones de distinto color de fondo. */
export default function SectionCurve({
  from,
  to,
  radius = 44,
  lip = true,
  shadow = true,
}: {
  from: string;
  to: string;
  radius?: number;
  lip?: boolean;
  shadow?: boolean;
}) {
  return (
    <div className="relative w-full" style={{ height: radius, background: from }} aria-hidden="true">
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          background: to,
          borderTopLeftRadius: radius,
          borderTopRightRadius: radius,
          boxShadow: shadow ? "0 -20px 44px -22px rgba(0,0,0,0.45)" : "none",
        }}
      >
        {lip && (
          <div
            className="absolute top-0 h-px"
            style={{
              left: radius,
              right: radius,
              background:
                "linear-gradient(90deg, transparent, color-mix(in oklab, var(--pr-accent) 60%, transparent), transparent)",
            }}
          />
        )}
      </div>
    </div>
  );
}
