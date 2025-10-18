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
} = process.env;

function getTransporter() {
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD || !SMTP_FROM) {
    throw createError(500, "Server misconfigured: SMTP env vars missing");
  }
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465, // 587 -> false, 465 -> true
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
    // 👇 додаємо тільки для локалки, якщо є перехоплення сертифікатів
    tls:
      SMTP_ALLOW_INSECURE_TLS === "true"
        ? { rejectUnauthorized: false }
        : undefined,
  });
}

export async function sendResetPasswordEmail({ to, token }) {
  if (!APP_DOMAIN)
    throw createError(500, "Server misconfigured: APP_DOMAIN missing");
  const resetUrl = `${APP_DOMAIN.replace(/\/$/, "")}/reset-password?token=${encodeURIComponent(token)}`;
  const transporter = getTransporter();
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
  return true;
}
