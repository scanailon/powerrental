import type { CSSProperties } from "react";

export const PR_ACCENT = "#2C2EFF";

/** Matriz feColorMatrix que tiñe el rayo del logo con el color de acento. */
export function boltTintMatrix(hex: string = PR_ACCENT) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  return `0 0 0 0 ${r}  0 0 0 0 ${g}  0 0 0 0 ${b}  -1 0 1 0 0`;
}

export const pageVars = {
  "--pr-accent": PR_ACCENT,
  "--pr-bg": "#0A0A0B",
} as CSSProperties;
