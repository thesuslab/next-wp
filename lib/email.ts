import nodemailer from "nodemailer";

export interface ContactEmailPayload {
  intent: string;
  name: string;
  email: string;
  primaryDetails: string;
  secondaryDetails?: string;
}

/**
 * Helper to auto-detect SMTP server host if only username is provided.
 */
function inferSmtpHost(username: string): { host: string; port?: number; secure?: boolean } | null {
  const cleanUser = username.trim().toLowerCase();
  if (cleanUser.endsWith("@gmail.com") || cleanUser.endsWith("@googlemail.com")) {
    return { host: "smtp.gmail.com", port: 465, secure: true };
  }
  if (
    cleanUser.endsWith("@outlook.com") ||
    cleanUser.endsWith("@hotmail.com") ||
    cleanUser.endsWith("@live.com")
  ) {
    return { host: "smtp-mail.outlook.com", port: 587, secure: false };
  }
  if (cleanUser.endsWith("@yahoo.com")) {
    return { host: "smtp.mail.yahoo.com", port: 465, secure: true };
  }
  if (cleanUser === "apikey") {
    return { host: "smtp.sendgrid.net", port: 587, secure: false };
  }
  if (cleanUser === "resend") {
    return { host: "smtp.resend.com", port: 465, secure: true };
  }
  return null;
}

/**
 * Configure Nodemailer transport using environment variables.
 * Supports SMTP_SERVER, SMTP_HOST, MAIL_HOST,
 * SMTP_USERNAME, SMTP_USER, MAIL_USERNAME,
 * SMTP_PASSWORD, SMTP_PASS, MAIL_PASSWORD, etc.
 * Auto-detects well-known SMTP providers (like Gmail) if host is omitted.
 */
export function getMailTransporter(overridePort?: number, overrideSecure?: boolean) {
  const user =
    process.env.SMTP_USERNAME ||
    process.env.smtp_username ||
    process.env.SMTP_USER ||
    process.env.smtp_user ||
    process.env.MAIL_USERNAME ||
    process.env.EMAIL_USER ||
    "";
  const pass =
    process.env.SMTP_PASSWORD ||
    process.env.smtp_password ||
    process.env.SMTP_PASS ||
    process.env.smtp_pass ||
    process.env.MAIL_PASSWORD ||
    process.env.EMAIL_PASSWORD ||
    "";
  let host =
    process.env.SMTP_SERVER ||
    process.env.smtp_server ||
    process.env.SMTP_HOST ||
    process.env.smtp_host ||
    process.env.MAIL_HOST ||
    process.env.EMAIL_HOST ||
    "";

  // Auto-detect host from username if host is not explicitly set
  if (!host && user) {
    const inferred = inferSmtpHost(user);
    if (inferred) {
      host = inferred.host;
      console.info(`[SMTP] Auto-detected host '${host}' from username '${user}'.`);
    } else {
      console.warn(
        `[SMTP] Warning: SMTP credentials provided but SMTP_SERVER (or SMTP_HOST) is missing. Set SMTP_SERVER in Railway or Vercel variables.`
      );
    }
  }

  if (!host || !user || !pass) {
    return null;
  }

  const portEnv =
    process.env.SMTP_PORT ||
    process.env.smtp_port ||
    process.env.MAIL_PORT ||
    "";

  const defaultPort = portEnv
    ? parseInt(portEnv, 10)
    : host === "smtp-mail.outlook.com" || host === "smtp.sendgrid.net"
    ? 587
    : 465;

  const port = overridePort !== undefined ? overridePort : defaultPort;

  const secureOverride = process.env.SMTP_SECURE || process.env.smtp_secure;
  const secure =
    overrideSecure !== undefined
      ? overrideSecure
      : secureOverride !== undefined
      ? secureOverride === "true" || secureOverride === "1"
      : port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
    tls: {
      // Allows self-signed certificates or SNI discrepancies on custom domain mail servers
      rejectUnauthorized: false,
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
  });
}

/**
 * Send contact form submission to the Directorate inbox and send a confirmation to the sender.
 */
export async function sendContactEmail(payload: ContactEmailPayload) {
  const transporter = getMailTransporter();
  const user =
    process.env.SMTP_USERNAME ||
    process.env.smtp_username ||
    process.env.SMTP_USER ||
    process.env.smtp_user ||
    "";

  const directorateEmail =
    process.env.DIRECTORATE_EMAIL ||
    process.env.SMTP_TO ||
    process.env.CONTACT_EMAIL ||
    (user && user.includes("@") ? user : "hello@sustainabilitylab.xyz");

  const fromEmail =
    process.env.SMTP_FROM ||
    process.env.MAIL_FROM ||
    (user && user.includes("@") ? user : directorateEmail);

  const emailBodyText = `
New Project Intake / Inquiry Received via Sustainability Lab Portal

Intent: ${payload.intent.toUpperCase()}
Name: ${payload.name}
Email: ${payload.email}

Primary Project Details / Response:
${payload.primaryDetails}

${payload.secondaryDetails ? `Secondary Context:\n${payload.secondaryDetails}\n` : ""}
Submitted at: ${new Date().toISOString()}
Headquarters: Maharajgunj Research Station, Kathmandu Valley (27.7408° N, 85.3365° E)
`.trim();

  const emailHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #111110; line-height: 1.6;">
      <div style="border-bottom: 2px solid #5D7924; padding-bottom: 12px; margin-bottom: 20px;">
        <h2 style="margin: 0; color: #5D7924; font-size: 20px; text-transform: uppercase; letter-spacing: 1px;">
          The Sustainability Lab • Project Intake
        </h2>
        <p style="margin: 4px 0 0 0; color: #666; font-size: 12px; font-family: monospace;">
          Maharajgunj Research Station, Kathmandu Valley
        </p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
        <tr>
          <td style="padding: 8px 0; color: #666; width: 140px;"><strong>Intent:</strong></td>
          <td style="padding: 8px 0; color: #111; font-weight: 600;">${payload.intent.toUpperCase()}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;"><strong>Sender Name:</strong></td>
          <td style="padding: 8px 0; color: #111;">${payload.name}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;"><strong>Sender Email:</strong></td>
          <td style="padding: 8px 0; color: #111;"><a href="mailto:${payload.email}" style="color: #5D7924;">${payload.email}</a></td>
        </tr>
      </table>

      <div style="background-color: #f7f9f2; border-left: 4px solid #5D7924; padding: 16px; margin-bottom: 20px; border-radius: 4px;">
        <h4 style="margin: 0 0 8px 0; font-size: 13px; text-transform: uppercase; color: #5D7924; letter-spacing: 0.5px;">
          Contextual Inquiry & Details:
        </h4>
        <p style="margin: 0; white-space: pre-wrap; font-size: 14px; color: #222;">${payload.primaryDetails}</p>
        ${
          payload.secondaryDetails
            ? `<div style="margin-top: 12px; padding-top: 12px; border-top: 1px dashed #d5deca;">
                <strong style="font-size: 12px; color: #666;">Secondary Information:</strong>
                <p style="margin: 4px 0 0 0; white-space: pre-wrap; font-size: 13px; color: #333;">${payload.secondaryDetails}</p>
              </div>`
            : ""
        }
      </div>

      <div style="font-size: 11px; color: #888; border-top: 1px solid #eee; padding-top: 16px; margin-top: 32px; font-family: monospace;">
        Received from portal form at /collaborate/contact • The Sustainability Lab
      </div>
    </div>
  `;

  if (!transporter) {
    console.warn(
      "[SMTP] Mail transporter not configured. Inquiry logged:",
      payload
    );
    return { success: true, simulated: true };
  }

  // Helper to send with automatic fallback to alternate port (465 <-> 587) if connection fails
  const sendWithFallback = async (mailOptions: Parameters<typeof transporter.sendMail>[0]) => {
    try {
      return await transporter.sendMail(mailOptions);
    } catch (primaryError: any) {
      console.warn("[SMTP] Primary dispatch attempt failed. Checking fallback options...", {
        message: primaryError?.message,
        code: primaryError?.code,
        command: primaryError?.command,
      });

      // Attempt alternate port if connection/timeout error
      const currentPort = Number(process.env.SMTP_PORT || process.env.smtp_port || 465);
      const fallbackPort = currentPort === 465 ? 587 : 465;
      const fallbackSecure = fallbackPort === 465;

      console.info(`[SMTP] Retrying transmission via fallback port ${fallbackPort} (secure: ${fallbackSecure})...`);
      const fallbackTransporter = getMailTransporter(fallbackPort, fallbackSecure);
      if (fallbackTransporter) {
        return await fallbackTransporter.sendMail(mailOptions);
      }
      throw primaryError;
    }
  };

  // 1. Send notification to Directorate
  try {
    const info = await sendWithFallback({
      from: `"Sustainability Lab Intake" <${fromEmail}>`,
      to: directorateEmail,
      replyTo: payload.email,
      subject: `[Intake: ${payload.intent.toUpperCase()}] Project Brief from ${payload.name}`,
      text: emailBodyText,
      html: emailHtml,
    });
    console.info("[SMTP] Directorate notification dispatched successfully:", {
      messageId: info.messageId,
      accepted: info.accepted,
      response: info.response,
    });
  } catch (sendError: any) {
    console.error("[SMTP] Failed to send intake notification email:", {
      message: sendError?.message,
      code: sendError?.code,
      response: sendError?.response,
      command: sendError?.command,
    });
    throw sendError;
  }

  // 2. Send acknowledgment to the sender
  try {
    await sendWithFallback({
      from: `"The Sustainability Lab Directorate" <${fromEmail}>`,
      to: payload.email,
      subject: `Inquiry Received: Sustainability Lab Directorate Intake`,
      text: `Hello ${payload.name},\n\nThank you for reaching out to The Sustainability Lab. We have received your project brief under "${payload.intent}".\n\nOur Directorate and research team at the Maharajgunj Research Station review incoming proposals and inquiries and will follow up within 2 business days.\n\nWarm regards,\nDirectorate Secretariat\nThe Sustainability Lab\nMaharajgunj, Kathmandu Valley, Nepal\nhttps://sustainabilitylab.xyz`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 24px; color: #111110; line-height: 1.6;">
          <h3 style="color: #5D7924; margin-top: 0;">Inquiry Received • The Sustainability Lab</h3>
          <p>Hello ${payload.name},</p>
          <p>Thank you for connecting with us regarding <strong>${payload.intent}</strong>. Your project brief has been registered with our Directorate.</p>
          <p>Our team at the Maharajgunj Research Station will review your submission and follow up with contextual next steps within 2 business days.</p>
          <hr style="border: 0; border-top: 1px solid #e5e5e5; margin: 24px 0;" />
          <p style="font-size: 12px; color: #666; font-family: monospace; margin: 0;">
            The Sustainability Lab<br/>
            Maharajgunj Research Station, Kathmandu Valley, Nepal<br/>
            Coordinates: 27.7408° N, 85.3365° E<br/>
            <a href="https://sustainabilitylab.xyz" style="color: #5D7924;">sustainabilitylab.xyz</a>
          </p>
        </div>
      `,
    });
  } catch (ackError) {
    console.warn("[SMTP] Confirmation to sender failed:", ackError);
  }

  return { success: true, simulated: false };
}
