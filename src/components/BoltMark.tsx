import type { CSSProperties } from "react";
import { BOLT_D, BOLT_TIGHT_VIEWBOX } from "@/lib/brand";

/** Rayo del logo de Power Rental. */
export default function BoltMark({
  className = "w-[10px] h-[17px]",
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      viewBox={BOLT_TIGHT_VIEWBOX}
      className={"shrink-0 " + className}
      style={style}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d={BOLT_D} />
    </svg>
  );
}
