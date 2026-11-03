import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { createId, db } from "@/lib/db";

const schema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  subject: z.string().trim().min(3),
  message: z.string().trim().min(10),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid message" },
        { status: 400 }
      );
    }

    const user = await getSession();
    db.prepare(
      `INSERT INTO contact_messages (id, name, email, subject, message, user_id)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).run(
      createId(),
      parsed.data.name,
      parsed.data.email.toLowerCase(),
      parsed.data.subject,
      parsed.data.message,
      user?.id || null
    );

    return NextResponse.json({
      ok: true,
      message: "Thank you. Our team will reply within one business day.",
    });
  } catch {
    return NextResponse.json(
      { error: "Could not send message" },
      { status: 500 }
    );
  }
}
