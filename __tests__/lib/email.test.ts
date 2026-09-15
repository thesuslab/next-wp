import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getMailTransporter, sendContactEmail, type ContactEmailPayload } from "@/lib/email";
import nodemailer from "nodemailer";

vi.mock("nodemailer", () => {
  const sendMailMock = vi.fn().mockResolvedValue({ messageId: "test-id-123" });
  return {
    default: {
      createTransport: vi.fn(() => ({
        sendMail: sendMailMock,
      })),
    },
  };
});

describe("Email Service (lib/email.ts)", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns null if no credentials or server are configured", () => {
    delete process.env.SMTP_SERVER;
    delete process.env.SMTP_HOST;
    delete process.env.SMTP_USERNAME;
    delete process.env.SMTP_PASSWORD;

    const transporter = getMailTransporter();
    expect(transporter).toBeNull();
  });

  it("auto-detects smtp.gmail.com when username is a Gmail address", () => {
    delete process.env.SMTP_SERVER;
    delete process.env.SMTP_HOST;
    process.env.SMTP_USERNAME = "researcher@gmail.com";
    process.env.SMTP_PASSWORD = "secret-app-password";

    const transporter = getMailTransporter();
    expect(transporter).not.toBeNull();
    expect(nodemailer.createTransport).toHaveBeenCalledWith(
      expect.objectContaining({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: "researcher@gmail.com",
          pass: "secret-app-password",
        },
      })
    );
  });

  it("auto-detects smtp.sendgrid.net for apikey user", () => {
    delete process.env.SMTP_SERVER;
    delete process.env.SMTP_HOST;
    process.env.SMTP_USERNAME = "apikey";
    process.env.SMTP_PASSWORD = "SG.123456789";

    const transporter = getMailTransporter();
    expect(transporter).not.toBeNull();
    expect(nodemailer.createTransport).toHaveBeenCalledWith(
      expect.objectContaining({
        host: "smtp.sendgrid.net",
        port: 587,
        secure: false,
      })
    );
  });

  it("creates transporter when custom SMTP_SERVER is provided", () => {
    process.env.SMTP_SERVER = "smtp.custom-mail.com";
    process.env.SMTP_PORT = "587";
    process.env.SMTP_USERNAME = "office@domain.com";
    process.env.SMTP_PASSWORD = "pass";

    const transporter = getMailTransporter();
    expect(transporter).not.toBeNull();
    expect(nodemailer.createTransport).toHaveBeenCalledWith(
      expect.objectContaining({
        host: "smtp.custom-mail.com",
        port: 587,
        secure: false,
      })
    );
  });

  it("simulates email send when transporter is not configured", async () => {
    delete process.env.SMTP_SERVER;
    delete process.env.SMTP_USERNAME;
    delete process.env.SMTP_PASSWORD;

    const payload: ContactEmailPayload = {
      intent: "Project Brief",
      name: "Tenzing Norgay",
      email: "tenzing@example.com",
      primaryDetails: "Solar microgrid installation",
    };

    const result = await sendContactEmail(payload);
    expect(result.success).toBe(true);
    expect(result.simulated).toBe(true);
  });

  it("dispatches real intake email when credentials exist", async () => {
    process.env.SMTP_SERVER = "smtp.gmail.com";
    process.env.SMTP_USERNAME = "lab@gmail.com";
    process.env.SMTP_PASSWORD = "app-password";

    const payload: ContactEmailPayload = {
      intent: "research",
      name: "Jane Doe",
      email: "jane@example.com",
      primaryDetails: "River sedimentation study",
    };

    const result = await sendContactEmail(payload);
    expect(result.success).toBe(true);
    expect(result.simulated).toBe(false);
  });
});
