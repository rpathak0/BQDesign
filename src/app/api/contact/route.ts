import { NextResponse } from "next/server";

export type ContactBody = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

/** Stub contact API. Replace with real email/send when backend is ready. */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactBody;
    const { name, email, subject, message } = body;
    // Stub: validate and return success. In production: send email, save to DB, etc.
    if (!email || !message) {
      return NextResponse.json(
        { error: "Email and message are required" },
        { status: 400 }
      );
    }
    // eslint-disable-next-line no-console
    console.log("[Contact stub]", { name, email, subject, message: message.slice(0, 50) });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
