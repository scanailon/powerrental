/**
 * Geometría del logo "P ⚡ R" de Power Rental (coordenadas en el sistema del rayo).
 * La P y la R se dibujan a izquierda y derecha del rayo.
 */

export const BOLT_D =
  "M163.98 0 L81.99 119.91 L159.44 168.19 L0 279.68 L91.06 172.08 L4.54 140.32 Z";
export const BOLT_BOX = { x0: 0, x1: 165.28, y0: 0, y1: 279.68 };
export const BOLT_TIGHT_VIEWBOX = "0 0 165.28 279.68";
export const BOLT_VIEWBOX = "-6 -8 192 316";

export const P_D =
  "M-116.99 58.01 L-13.29 58.01 L-23.33 145.83 L-92.69 146.48 L-100.46 205.14 L-135.46 205.79 L-117.31 58.33 Z M-84.26 87.82 L-52.18 88.15 L-55.42 116.34 L-88.47 116.67 L-84.58 88.15 Z";
export const P_BOX = { x0: -135.79, x1: -12.64, y0: 58.01, y1: 205.79 };

export const R_D =
  "M203.19 57.04 L307.55 57.69 L296.85 144.86 L280.97 146.16 L292.96 177.92 L289.4 204.81 L254.72 204.81 L256.99 185.69 L238.19 145.51 L226.85 146.81 L219.4 204.81 L184.72 204.81 L202.87 57.36 Z M235.6 86.85 L268.01 86.85 L265.42 114.72 L231.39 115.37 L235.28 87.18 Z";
export const R_BOX = { x0: 184.72, x1: 307.55, y0: 57.04, y1: 205.14 };

/** Centro vertical de las letras. */
export const MARK_CY = 140;
