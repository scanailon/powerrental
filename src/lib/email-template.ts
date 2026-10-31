import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";

const ACCENT = "#2C2EFF";
const INK = "#111114";
const MUTED = "#63636E";
const LINE = "#E6E6EC";
const LOGO_CID = "pr-logo";

export function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Logo embebido (CID) para que se vea aunque el cliente bloquee imágenes remotas. */
export async function logoAttachment() {
  try {
    const file = path.join(process.cwd(), "public", "assets", "logo-power-rental.png");
    return {
      filename: "power-rental.png",
      content: await fs.readFile(file),
      cid: LOGO_CID,
    };
  } catch {
    return null;
  }
}

type EmailOptions = {
  withLogo: boolean;
  preheader: string;
  title: string;
  intro: string;
  rows?: { label: string; value: string }[];
  quote?: { label: string; text: string };
  cta?: { label: string; href: string };
  /** HTML ya escapado. */
  note?: string;
};

function renderRows(rows: { label: string; value: string }[]) {
  return `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;margin:0 0 8px">
    ${rows
      .map(
        ({ label, value }, i) => `
      <tr>
        <td style="padding:14px 0 4px;border-top:${i === 0 ? "none" : `1px solid ${LINE}`};font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;letter-spacing:1.2px;text-transform:uppercase;color:${MUTED}">
          ${escapeHtml(label)}
        </td>
      </tr>
      <tr>
        <td style="padding:0 0 12px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:22px;color:${INK}">
          ${escapeHtml(value).replace(/\n/g, "<br>")}
        </td>
      </tr>`,
      )
      .join("")}
  </table>`;
}

export function renderEmail(o: EmailOptions) {
  const logo = o.withLogo
    ? `<img src="cid:${LOGO_CID}" width="210" alt="Power Rental" style="display:block;width:210px;max-width:70%;height:auto;border:0;margin:0 auto">`
    : `<div style="font-family:Arial,Helvetica,sans-serif;font-size:22px;font-weight:bold;letter-spacing:2px;color:${INK};text-align:center">POWER RENTAL</div>`;

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light only">
<title>${escapeHtml(o.title)}</title>
</head>
<body style="margin:0;padding:0;background:#F2F2F5;-webkit-text-size-adjust:100%">
  <!-- Preheader: se muestra en la lista de correos, no dentro del mensaje. -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;height:0;width:0">
    ${escapeHtml(o.preheader)}
  </div>

  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;background:#F2F2F5">
    <tr>
      <td align="center" style="padding:28px 14px 36px">

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px;max-width:100%;border-collapse:collapse;background:#FFFFFF;border:1px solid ${LINE};border-radius:14px;overflow:hidden">

          <!-- Franja de acento -->
          <tr><td style="height:4px;line-height:4px;font-size:0;background:${ACCENT}">&nbsp;</td></tr>

          <!-- Logo -->
          <tr>
            <td align="center" style="padding:30px 32px 26px;border-bottom:1px solid ${LINE}">
              ${logo}
            </td>
          </tr>

          <!-- Contenido -->
          <tr>
            <td style="padding:32px 32px 8px">
              <h1 style="margin:0 0 12px;font-family:Arial,Helvetica,sans-serif;font-size:23px;line-height:30px;font-weight:normal;color:${INK}">
                ${escapeHtml(o.title)}
              </h1>
              <p style="margin:0 0 22px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:23px;color:${MUTED}">
                ${escapeHtml(o.intro)}
              </p>
              ${o.rows?.length ? renderRows(o.rows) : ""}
              ${
                o.quote
                  ? `
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;letter-spacing:1.2px;text-transform:uppercase;color:${MUTED};padding:14px 0 8px;border-top:1px solid ${LINE}">
                ${escapeHtml(o.quote.label)}
              </div>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;margin:0 0 8px">
                <tr>
                  <td style="border-left:3px solid ${ACCENT};background:#F7F7FA;padding:14px 16px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:23px;color:${INK}">
                    ${escapeHtml(o.quote.text).replace(/\n/g, "<br>")}
                  </td>
                </tr>
              </table>`
                  : ""
              }
            </td>
          </tr>

          ${
            o.cta
              ? `
          <tr>
            <td style="padding:14px 32px 6px">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse">
                <tr>
                  <td style="border-radius:999px;background:${ACCENT}">
                    <a href="${o.cta.href}" style="display:inline-block;padding:13px 30px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;color:#FFFFFF;text-decoration:none;border-radius:999px">
                      ${escapeHtml(o.cta.label)}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`
              : ""
          }

          ${
            o.note
              ? `
          <tr>
            <td style="padding:22px 32px 30px">
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:21px;color:${MUTED}">
                ${o.note}
              </p>
            </td>
          </tr>`
              : '<tr><td style="padding:0 32px 30px">&nbsp;</td></tr>'
          }

          <!-- Pie de marca -->
          <tr>
            <td style="background:#0F0F12;padding:26px 32px">
              <p style="margin:0 0 10px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:20px;color:#FFFFFF">
                <strong>Power Rental</strong> · Soluciones de energía
              </p>
              <p style="margin:0 0 4px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:22px;color:rgba(255,255,255,0.62)">
                Arriendo de generadores, tableros y distribución eléctrica.
              </p>
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:22px;color:rgba(255,255,255,0.62)">
                <a href="mailto:info@powerrental.cl" style="color:#FFFFFF;text-decoration:none">info@powerrental.cl</a>
                &nbsp;·&nbsp;
                <a href="https://wa.me/56984613714" style="color:#FFFFFF;text-decoration:none">+56 9 8461 3714</a>
                &nbsp;·&nbsp;
                <a href="https://powerrental.cl" style="color:#FFFFFF;text-decoration:none">powerrental.cl</a>
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;
}
