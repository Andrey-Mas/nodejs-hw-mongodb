// src/services/email.js
import nodemailer from "nodemailer";
import createError from "http-errors";

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASSWORD,
  SMTP_FROM,
  APP_DOMAIN,
  SMTP_ALLOW_INSECURE_TLS,
  BREVO_API_KEY,
  NODE_ENV,
} = process.env;

function buildResetUrl(token) {
  if (!APP_DOMAIN)
    throw createError(500, "Server misconfigured: APP_DOMAIN missing");
  return `${APP_DOMAIN.replace(/\/$/, "")}/reset-password?token=${encodeURIComponent(token)}`;
}

function getSmtpTransporter() {
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD || !SMTP_FROM) {
    throw createError(500, "Server misconfigured: SMTP env vars missing");
  }
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
    tls:
      SMTP_ALLOW_INSECURE_TLS === "true"
        ? { rejectUnauthorized: false }
        : undefined,
    connectionTimeout: 15000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
  });
}

async function sendViaSMTP(to, resetUrl) {
  const transporter = getSmtpTransporter();
  const info = await transporter.sendMail({
    from: SMTP_FROM,
    to,
    subject: "Reset your password",
    html: `<p>We received a request to reset your password.</p>
           <p>This link is valid for 5 minutes:</p>
           <p><a href="${resetUrl}">${resetUrl}</a></p>`,
  });
  if (!info || (!info.accepted?.length && info.rejected?.length)) {
    throw createError(500, "Failed to send the email, please try again later.");
  }
}

async function sendViaBrevoHTTP(to, resetUrl) {
  if (!BREVO_API_KEY)
    throw createError(500, "Server misconfigured: BREVO_API_KEY missing");
  if (!SMTP_FROM)
    throw createError(500, "Server misconfigured: SMTP_FROM missing");

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": BREVO_API_KEY,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      to: [{ email: to }],
      sender: { email: SMTP_FROM },
      subject: "Reset your password",
      htmlContent: `<p>We received a request to reset your password.</p>
                    <p>This link is valid for 5 minutes:</p>
                    <p><a href="${resetUrl}">${resetUrl}</a></p>`,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw createError(500, `Brevo API error: ${res.status} ${text}`);
  }
}

export async function sendResetPasswordEmail({ to, token }) {
  const resetUrl = buildResetUrl(token);

  // У проді з наявним BREVO_API_KEY: шлемо по HTTPS API (на Render це стабільно).
  if (NODE_ENV === "production" && BREVO_API_KEY) {
    await sendViaBrevoHTTP(to, resetUrl);
    return;
  }

  // Інакше пробуємо SMTP (локальні тести/інші середовища).
  try {
    await sendViaSMTP(to, resetUrl);
  } catch (e) {
    const msg = String(e?.message || e);
    const timeout = /ETIMEDOUT|EHOSTUNREACH|ECONNREFUSED|timeout/i.test(msg);
    // Якщо SMTP “впав” таймаутом і є BREVO_API_KEY — робимо фолбек
    if (timeout && BREVO_API_KEY) {
      await sendViaBrevoHTTP(to, resetUrl);
      return;
    }
    throw e;
  }
}
