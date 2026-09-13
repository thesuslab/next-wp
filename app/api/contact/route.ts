import { NextResponse } from "next/server";
import { sendContactEmail, type ContactEmailPayload } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { intent, name, email, primaryDetails, secondaryDetails } = body;

    if (!name || !email || !primaryDetails) {
      return NextResponse.json(
        { error: "Name, email, and primary inquiry details are required." },
        { status: 400 }
      );
    }

    const payload: ContactEmailPayload = {
      intent: intent || "General Inquiry",
      name: String(name).trim(),
      email: String(email).trim(),
      primaryDetails: String(primaryDetails).trim(),
      secondaryDetails: secondaryDetails ? String(secondaryDetails).trim() : undefined,
    };

    const result = await sendContactEmail(payload);

    return NextResponse.json({
      success: true,
      message: "Inquiry successfully received and routed to Directorate.",
      simulated: result.simulated,
    });
  } catch (error: any) {
    console.error("Error in /api/contact:", error);
    return NextResponse.json(
      {
        error: "Failed to process inquiry submission.",
        details: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
