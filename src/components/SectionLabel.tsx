import BoltMark from "./BoltMark";

export default function SectionLabel({
  label,
  tone = "dark",
  className = "",
}: {
  label: string;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <div className={"flex items-center gap-3 " + className}>
      <span
        className="relative flex w-[12px] h-[21px] shrink-0"
        style={{ color: "var(--pr-accent)" }}
      >
        <BoltMark
          className="absolute inset-0 w-full h-full animate-ping opacity-50"
          style={{ animationDuration: "2.6s" }}
        />
        <BoltMark className="relative w-full h-full" />
      </span>
      <span
        className={
          "font-mono text-[11px] md:text-[12px] font-medium uppercase tracking-[0.18em] " +
          (tone === "light" ? "text-white/60" : "text-black/55")
        }
      >
        {label}
      </span>
    </div>
  );
}
