const AURA_POSITIONS = {
  tr: "120% -10% at 100% 0%",
  tl: "120% -10% at 0% 0%",
  bl: "120% 110% at 0% 100%",
  br: "120% 110% at 100% 100%",
  center: "90% 80% at 50% 35%",
} as const;

type Aura = keyof typeof AURA_POSITIONS | "none";

/** Fondo de sección: grilla + aura de acento + grano. */
export default function SectionBackdrop({
  tone = "dark",
  aura = "tr",
  auraStrength = 8,
  grain = 4,
  className = "",
}: {
  tone?: "dark" | "light";
  aura?: Aura;
  auraStrength?: number;
  grain?: number;
  className?: string;
}) {
  return (
    <div
      className={"absolute inset-0 overflow-hidden pointer-events-none " + className}
      aria-hidden="true"
    >
      <div className={"absolute inset-0 " + (tone === "light" ? "pr-grid-light" : "pr-grid")} />
      {aura !== "none" && (
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(${AURA_POSITIONS[aura]}, color-mix(in oklab, var(--pr-accent) ${auraStrength}%, transparent) 0%, transparent 60%)`,
          }}
        />
      )}
      <div
        className={
          "absolute inset-0 pr-grain " +
          (tone === "light" ? "mix-blend-multiply" : "mix-blend-screen")
        }
        style={{ opacity: grain * 0.01 }}
      />
    </div>
  );
}
