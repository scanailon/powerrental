"use server";

import { headers } from "next/headers";
import { getClientIP } from "@/lib/auth";
import { sendMail } from "@/lib/mailer";
import { escapeHtml, logoAttachment, renderEmail } from "@/lib/email-template";

export type ContactState = { ok: boolean; message: string };

const FALLBACK_TO = "info@powerrental.cl";
const OK_MESSAGE = "¡Gracias! Te contactaremos en menos de 24 horas.";
const FAIL_MESSAGE = `No pudimos enviar tu mensaje. Escríbenos directamente a ${FALLBACK_TO} o por WhatsApp.`;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Máx. 3 envíos cada 10 minutos por IP.
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 3;
const recent = new Map<string, number[]>();

function allowSubmission(ip: string) {
  if (ip === "unknown") return true;
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (hits.length >= RATE_MAX) {
    recent.set(ip, hits);
    return false;
  }
  hits.push(now);
  recent.set(ip, hits);
  return true;
}

function field(fd: FormData, name: string, max: number) {
  return String(fd.get(name) ?? "").trim().slice(0, max);
}

function formatDate(d: Date) {
  try {
    return d.toLocaleString("es-CL", {
      timeZone: "America/Santiago",
      dateStyle: "long",
      timeStyle: "short",
    });
  } catch {
    return d.toISOString();
  }
}

export async function submitContact(formData: FormData): Promise<ContactState> {
  try {
    return await handleContact(formData);
  } catch (err) {
    console.error("[contact] error inesperado:", err);
    return { ok: false, message: FAIL_MESSAGE };
  }
}

async function handleContact(formData: FormData): Promise<ContactState> {
  // Honeypot: los bots llenan el campo oculto "website".
  if (String(formData.get("website") ?? "").trim()) {
    return { ok: true, message: OK_MESSAGE };
  }

  const data = {
    nombre: field(formData, "nombre", 200),
    empresa: field(formData, "empresa", 200),
    email: field(formData, "email", 200),
    telefono: field(formData, "telefono", 200),
    tipo: field(formData, "tipo", 200),
    mensaje: field(formData, "mensaje", 5000),
  };

  if (!data.nombre || !data.email || !data.mensaje) {
    return { ok: false, message: "Por favor completa tu nombre, tu email y un mensaje." };
  }
  if (!EMAIL_RE.test(data.email)) {
    return { ok: false, message: "Revisa tu email: no parece una dirección válida." };
  }
  if (!allowSubmission(getClientIP(await headers()))) {
    return {
      ok: false,
      message: "Ya recibimos tus solicitudes. Espera unos minutos antes de enviar otra.",
    };
  }

  const received = formatDate(new Date());
  const rows: [string, string][] = [
    ["Nombre", data.nombre],
    ["Empresa", data.empresa || "—"],
    ["Email", data.email],
    ["Teléfono", data.telefono || "—"],
    ["Tipo de proyecto", data.tipo || "—"],
    ["Recibido", received],
  ];

  const logo = await logoAttachment();
  const attachments = logo ? [logo] : undefined;
  const withLogo = logo !== null;
  const empresaSuffix = data.empresa ? ` · ${data.empresa}` : "";

  // 1) Aviso interno
  try {
    await sendMail({
      to: process.env.CONTACT_TO?.trim() || FALLBACK_TO,
      replyTo: data.email,
      attachments,
      subject: `Nueva cotización — ${data.nombre}${empresaSuffix}`,
      text:
        "Nueva solicitud de cotización desde powerrental.cl\n\n" +
        rows.map(([k, v]) => `${k}: ${v}`).join("\n") +
        `\n\nMensaje:\n${data.mensaje}\n\n` +
        `Responde este correo para contactar directamente a ${data.nombre}.`,
      html: renderEmail({
        withLogo,
        preheader: `${data.nombre}${empresaSuffix} — ${data.tipo || "solicitud de cotización"}`,
        title: "Nueva solicitud de cotización",
        intro: "Llegó una solicitud desde el formulario de powerrental.cl.",
        rows: rows.map(([label, value]) => ({ label, value })),
        quote: { label: "Mensaje", text: data.mensaje },
        cta: {
          label: `Responder a ${data.nombre.split(" ")[0]}`,
          href: `mailto:${data.email}?subject=${encodeURIComponent("Tu solicitud a Power Rental")}`,
        },
        note: `También puedes responder este correo directamente: ya viene dirigido a <a href="mailto:${data.email}" style="color:#2C2EFF;text-decoration:none">${escapeHtml(data.email)}</a>.`,
      }),
    });
  } catch (err) {
    console.error("[contact] fallo al enviar el correo:", err);
    return { ok: false, message: FAIL_MESSAGE };
  }

  // 2) Autorespuesta al cliente (si falla, no bloquea)
  try {
    const firstName = data.nombre.split(" ")[0];
    await sendMail({
      to: data.email,
      attachments,
      subject: "Recibimos tu solicitud — Power Rental",
      text: `Hola ${firstName},

Recibimos tu solicitud y un ejecutivo te contactará en menos de 24 horas con una propuesta técnica y comercial.

Esto fue lo que nos enviaste:
${data.mensaje}

Si necesitas hablar antes, escríbenos a ${FALLBACK_TO} o por WhatsApp al +56 9 8461 3714.

Power Rental — Soluciones de energía.
Arriendo de generadores, tableros y distribución eléctrica.`,
      html: renderEmail({
        withLogo,
        preheader: "Un ejecutivo te contactará en menos de 24 horas.",
        title: `Gracias, ${firstName}. Recibimos tu solicitud.`,
        intro:
          "Un ejecutivo revisará tu requerimiento y te contactará en menos de 24 horas con una propuesta técnica y comercial.",
        quote: { label: "Tu mensaje", text: data.mensaje },
        cta: { label: "Escríbenos por WhatsApp", href: "https://wa.me/56984613714" },
        note: `¿Necesitas hablar antes? Respóndenos este correo o escríbenos a <a href="mailto:${FALLBACK_TO}" style="color:#2C2EFF;text-decoration:none">${FALLBACK_TO}</a>.`,
      }),
    });
  } catch (err) {
    console.error("[contact] fallo al enviar la autorespuesta:", err);
  }

  return { ok: true, message: OK_MESSAGE };
}
