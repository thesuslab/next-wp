import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      service: "The Sustainability Lab",
      version: "0.1.0",
      knowledgeBase: {
        totalEntries: 28,
        status: "active",
      },
    },
    { status: 200 }
  );
}
