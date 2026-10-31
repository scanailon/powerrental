import {
  BOLT_BOX,
  BOLT_D,
  BOLT_VIEWBOX,
  MARK_CY,
  P_BOX,
  P_D,
  R_BOX,
  R_D,
} from "@/lib/brand";

/* Capas de extrusión: cada capa se desplaza un poco para simular profundidad. */
const DEPTH = 14;
const STEP_X = 1.1;
const STEP_Y = 1.45;
/* Las letras P y R se dibujan más pequeñas y separadas del rayo. */
const LETTER_SCALE = 0.56;
const LETTER_GAP = 14;

const P_SHIFT = -LETTER_GAP - P_BOX.x1;
const R_SHIFT = BOLT_BOX.x1 + LETTER_GAP - R_BOX.x0;
const P_TRANSFORM = `translate(${P_SHIFT} 0) translate(${P_BOX.x1} ${MARK_CY}) scale(${LETTER_SCALE}) translate(${-P_BOX.x1} ${-MARK_CY})`;
const R_TRANSFORM = `translate(${R_SHIFT} 0) translate(${R_BOX.x0} ${MARK_CY}) scale(${LETTER_SCALE}) translate(${-R_BOX.x0} ${-MARK_CY})`;
const LETTERS_X0 = P_BOX.x1 + P_SHIFT - (P_BOX.x1 - P_BOX.x0) * LETTER_SCALE;
const LETTERS_X1 = R_BOX.x0 + R_SHIFT + (R_BOX.x1 - R_BOX.x0) * LETTER_SCALE + DEPTH * STEP_X;
const LETTERS_VIEWBOX = `${(LETTERS_X0 - 8).toFixed(2)} -8 ${(LETTERS_X1 - LETTERS_X0 + 16).toFixed(2)} 316`;

/** Rayo de Power Rental en pseudo-3D (opcionalmente con las letras P y R). */
export default function Bolt3D({
  className = "",
  glow = true,
  current = false,
  letters = false,
  idPrefix = "pr-bolt",
}: {
  className?: string;
  glow?: boolean;
  current?: boolean;
  letters?: boolean;
  idPrefix?: string;
}) {
  const layers = Array.from({ length: DEPTH }, (_, i) => DEPTH - i);
  const frontId = `${idPrefix}-front`;
  const bloomId = `${idPrefix}-bloom`;
  const coreId = `${idPrefix}-core`;
  const clipId = `${idPrefix}-clip`;
  const letterId = `${idPrefix}-letter`;

  return (
    <div className={"relative " + className} aria-hidden="true">
      {glow && (
        <div
          className="pointer-events-none absolute -inset-[12%] -z-10"
          style={{
            background:
              "radial-gradient(46% 52% at 52% 46%, color-mix(in oklab, var(--pr-accent) 42%, transparent) 0%, transparent 72%)",
            filter: "blur(46px)",
            opacity: 0.85,
          }}
        />
      )}
      <svg
        viewBox={letters ? LETTERS_VIEWBOX : BOLT_VIEWBOX}
        className="w-full h-full"
        style={{
          filter:
            "drop-shadow(0 18px 40px rgba(5,3,20,0.55)) drop-shadow(0 0 26px color-mix(in oklab, var(--pr-accent) 45%, transparent))",
        }}
        role="img"
        aria-label={letters ? "Power Rental" : "Rayo Power Rental"}
      >
        <defs>
          <linearGradient id={frontId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" style={{ stopColor: "color-mix(in oklab, var(--pr-accent) 50%, #ffffff)" }} />
            <stop offset="42%" style={{ stopColor: "var(--pr-accent)" }} />
            <stop offset="100%" style={{ stopColor: "color-mix(in oklab, var(--pr-accent) 78%, #04020e)" }} />
          </linearGradient>
          <linearGradient id={letterId} x1="0" y1="0" x2="0.35" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="55%" stopColor="#dfe4f2" />
            <stop offset="100%" stopColor="#9aa4c4" />
          </linearGradient>
          <filter id={bloomId} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
          <filter id={coreId} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
          <clipPath id={clipId}>
            <path d={BOLT_D} />
          </clipPath>
        </defs>

        <path d={BOLT_D} style={{ fill: "var(--pr-accent)" }} filter={`url(#${bloomId})`} opacity="0.8" />

        {letters &&
          [
            { key: "p", d: P_D, t: P_TRANSFORM },
            { key: "r", d: R_D, t: R_TRANSFORM },
          ].map(({ key, d, t }) => (
            <g key={key} transform={t}>
              {layers.map((i) => {
                const mix = Math.round(10 + (1 - i / DEPTH) * 26);
                return (
                  <path
                    key={i}
                    d={d}
                    fillRule="evenodd"
                    transform={`translate(${(STEP_X * i) / LETTER_SCALE} ${(STEP_Y * i) / LETTER_SCALE})`}
                    style={{ fill: `color-mix(in oklab, #7d88ad ${mix}%, #05030f)` }}
                  />
                );
              })}
              <path
                d={d}
                fillRule="evenodd"
                fill={`url(#${letterId})`}
                strokeWidth={1.2 / LETTER_SCALE}
                strokeLinejoin="miter"
                style={{ stroke: "rgba(255,255,255,0.5)" }}
              />
            </g>
          ))}

        {layers.map((i) => {
          const mix = Math.round(14 + (1 - i / DEPTH) * 24);
          return (
            <path
              key={i}
              d={BOLT_D}
              transform={`translate(${STEP_X * i} ${STEP_Y * i})`}
              style={{ fill: `color-mix(in oklab, var(--pr-accent) ${mix}%, #05030f)` }}
            />
          );
        })}

        <path
          d={BOLT_D}
          fill={`url(#${frontId})`}
          strokeWidth="1.5"
          strokeLinejoin="miter"
          style={{ stroke: "color-mix(in oklab, var(--pr-accent) 38%, #ffffff)" }}
        />

        {/* Brillo diagonal */}
        <g clipPath={`url(#${clipId})`}>
          <line
            x1="160"
            y1="6"
            x2="6"
            y2="274"
            stroke="#e6e9ff"
            strokeWidth="22"
            strokeLinecap="round"
            opacity="0.5"
            filter={`url(#${coreId})`}
          />
        </g>

        {current && (
          <path
            className="pr-current"
            d={BOLT_D}
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="30 60"
            style={{
              stroke: "color-mix(in oklab, var(--pr-accent) 70%, #ffffff)",
              animationDuration: "5s",
            }}
          />
        )}
      </svg>
    </div>
  );
}
