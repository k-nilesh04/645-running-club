import nodemailer from "nodemailer";

// Gmail SMTP over STARTTLS, forced to IPv4 because many hosts have no IPv6 route.
export const createEmailTransport = () =>
  nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    family: 4,
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

let cachedTransport = null;

const getTransport = () => {
  if (!cachedTransport) {
    cachedTransport = createEmailTransport();
  }

  return cachedTransport;
};

const NETWORK_ERROR_CODES = new Set([
  "ETIMEDOUT",
  "ESOCKET",
  "ECONNREFUSED",
  "ENETUNREACH",
  "EDNS",
]);

// Hosts such as Render's free tier block outbound SMTP ports (25/465/587),
// so an HTTP email API is used whenever one is configured.
export const getEmailProvider = () => {
  if (process.env.RESEND_API_KEY) return "resend";
  if (process.env.BREVO_API_KEY) return "brevo";
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) return "smtp";
  return null;
};

const sendViaResend = async ({ fromName, fromEmail, to, subject, html }) => {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `${fromName} <${fromEmail}>`,
      to: [to],
      subject,
      html,
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend API error (${response.status}): ${await response.text()}`);
  }
};

const sendViaBrevo = async ({ fromName, fromEmail, to, subject, html }) => {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      sender: { name: fromName, email: fromEmail },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });

  if (!response.ok) {
    throw new Error(`Brevo API error (${response.status}): ${await response.text()}`);
  }
};

const sendViaSmtp = async ({ fromName, fromEmail, to, subject, html }) => {
  try {
    await getTransport().sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    if (NETWORK_ERROR_CODES.has(error.code)) {
      throw new Error(
        "Could not reach the SMTP server. Hosts like Render's free tier block " +
          "outbound SMTP ports; set RESEND_API_KEY or BREVO_API_KEY to send over HTTPS instead."
      );
    }

    throw error;
  }
};

export const sendEmail = async ({ to, subject, html, fromName = "645 Run Club" }) => {
  const provider = getEmailProvider();
  const fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER;

  if (!provider || !fromEmail) {
    throw new Error(
      "Email service not configured. Set RESEND_API_KEY or BREVO_API_KEY (with EMAIL_FROM), " +
        "or EMAIL_USER and EMAIL_PASS for SMTP."
    );
  }

  const payload = { fromName, fromEmail, to, subject, html };

  if (provider === "resend") return sendViaResend(payload);
  if (provider === "brevo") return sendViaBrevo(payload);
  return sendViaSmtp(payload);
};
