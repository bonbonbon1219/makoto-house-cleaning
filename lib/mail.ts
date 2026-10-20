import nodemailer from "nodemailer";
import { site } from "@/lib/site";

function requiredEnv(name: string) {
  return process.env[name]?.trim() || "";
}

export function getMailConfig() {
  const smtpUser = requiredEnv("SMTP_USER") || site.email;
  const smtpPass = requiredEnv("SMTP_PASS");
  const smtpHost = requiredEnv("SMTP_HOST") || "smtp.lolipop.jp";
  const smtpPort = Number(requiredEnv("SMTP_PORT") || "465");
  const mailTo = requiredEnv("CONTACT_TO") || site.email;

  return { smtpUser, smtpPass, smtpHost, smtpPort, mailTo };
}

export async function sendMail(options: {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}) {
  const { smtpUser, smtpPass, smtpHost, smtpPort } = getMailConfig();
  if (!smtpPass) {
    throw new Error("mail_not_configured");
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  await transporter.sendMail({
    from: `"${site.brandJa}" <${smtpUser}>`,
    to: options.to,
    replyTo: options.replyTo,
    subject: options.subject,
    text: options.text,
  });
}
