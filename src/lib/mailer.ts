import "server-only";
import type { Transporter } from "nodemailer";
import type Mail from "nodemailer/lib/mailer";

function requireEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`SMTP no configurado: falta la variable ${name}.`);
  return value;
}

let cached: Transporter | null = null;

/**
 * Intenta varias rutas SMTP (el host configurado, el puerto alternativo y el
 * servidor local del hosting) y se queda con la primera que responde.
 */
async function getTransport() {
  if (cached) return cached;
  const nodemailer = (await import("nodemailer")).default;
  const user = requireEnv("SMTP_USER");
  const pass = requireEnv("SMTP_PASS");
  const errors: string[] = [];

  const host = requireEnv("SMTP_HOST");
  const port = Number(process.env.SMTP_PORT ?? 465);
  const seen = new Set<string>();
  const routes = [
    { host, port },
    { host, port: port === 465 ? 587 : 465 },
    { host: "localhost", port: 465 },
    { host: "localhost", port: 587 },
    { host: "localhost", port: 25 },
  ].filter((r) => {
    const key = `${r.host}:${r.port}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  for (const { host: h, port: p } of routes) {
    const transport = nodemailer.createTransport({
      host: h,
      port: p,
      secure: p === 465,
      ...(p === 25 ? {} : { auth: { user, pass } }),
      tls: { rejectUnauthorized: false },
      connectionTimeout: 8000,
      greetingTimeout: 8000,
    });
    try {
      await transport.verify();
      console.log(`[mailer] SMTP conectado por ${h}:${p}`);
      cached = transport;
      return transport;
    } catch (err) {
      transport.close();
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`${h}:${p} → ${msg}`);
    }
  }
  throw new Error(`Ninguna ruta SMTP funcionó. Intentos: ${errors.join(" | ")}`);
}

export async function sendMail({
  to,
  subject,
  text,
  html,
  replyTo,
  attachments,
}: {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
  attachments?: Mail.Attachment[];
}) {
  const from = requireEnv("SMTP_USER");
  return (await getTransport()).sendMail({
    from: `"Power Rental" <${from}>`,
    to,
    subject,
    ...(attachments?.length ? { attachments } : {}),
    text,
    ...(html ? { html } : {}),
    ...(replyTo ? { replyTo } : {}),
  });
}
