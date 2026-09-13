import nodemailer from "nodemailer";

export interface ContactEmailPayload {
  intent: string;
  name: string;
  email: string;
  primaryDetails: string;
  secondaryDetails?: string;
}

/**
 * Configure Nodemailer transport using environment variables.
 * Supports SMTP_username / smtp_username, smtp_password / SMTP_password,
 * and smtp_server / SMTP_server / SMTP_HOST.
 */
export function getMailTransporter() {
  const host =
    process.env.SMTP_SERVER ||
    process.env.smtp_server ||
    process.env.SMTP_HOST ||
    process.env.smtp_host ||
    "";
  const user =
    process.env.SMTP_USERNAME ||
    process.env.smtp_username ||
    process.env.SMTP_USER ||
    process.env.smtp_user ||
    "";
  const pass =
    process.env.SMTP_PASSWORD ||
    process.env.smtp_password ||
    process.env.SMTP_PASS ||
    process.env.smtp_pass ||
    "";
  const port = parseInt(
    process.env.SMTP_PORT || process.env.smtp_port || "465",
    10
  );
  const secure = port === 465;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
}

/**
 * Send contact form submission to the Directorate inbox and send a confirmation to the sender.
 */
export async function sendContactEmail(payload: ContactEmailPayload) {
  const transporter = getMailTransporter();
  const directorateEmail =
    process.env.DIRECTORATE_EMAIL ||
    process.env.SMTP_USERNAME ||
    process.env.smtp_username ||
    "hello@sustainabilitylab.xyz";

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

  // 1. Send notification to Directorate
  await transporter.sendMail({
    from: `"Sustainability Lab Intake" <${directorateEmail}>`,
    to: directorateEmail,
    replyTo: payload.email,
    subject: `[Intake: ${payload.intent.toUpperCase()}] Project Brief from ${payload.name}`,
    text: emailBodyText,
    html: emailHtml,
  });

  // 2. Send acknowledgment to the sender
  try {
    await transporter.sendMail({
      from: `"The Sustainability Lab Directorate" <${directorateEmail}>`,
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
