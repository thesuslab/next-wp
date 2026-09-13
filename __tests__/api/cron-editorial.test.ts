import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "@/app/api/cron/editorial/route";

describe("Cron Editorial API Route (/api/cron/editorial)", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  it("returns 401 Unauthorized if CRON_SECRET is set and request has invalid secret", async () => {
    process.env.CRON_SECRET = "super-secret-cron-token";

    const req = new Request("http://localhost:3000/api/cron/editorial?secret=wrong-secret", {
      method: "GET",
    });

    const res = await GET(req);
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error).toContain("Unauthorized");
  });

  it("authorizes when valid secret is provided via query parameter or header", async () => {
    process.env.CRON_SECRET = "super-secret-cron-token";

    const req = new Request("http://localhost:3000/api/cron/editorial?secret=super-secret-cron-token&limit=1", {
      method: "GET",
    });

    const res = await GET(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.timestamp).toBeDefined();
  });

  it("supports POST method similarly with Bearer token authorization", async () => {
    process.env.CRON_SECRET = "super-secret-cron-token";

    const req = new Request("http://localhost:3000/api/cron/editorial?limit=1", {
      method: "POST",
      headers: {
        Authorization: "Bearer super-secret-cron-token",
      },
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
  });
});
