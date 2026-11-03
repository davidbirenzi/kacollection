import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { createId, updateStore } from "@/lib/store";

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
    const now = new Date().toISOString().replace("T", " ").slice(0, 19);

    updateStore((store) => {
      store.messages.push({
        id: createId(),
        name: parsed.data.name,
        email: parsed.data.email.toLowerCase(),
        subject: parsed.data.subject,
        message: parsed.data.message,
        user_id: user?.id || null,
        created_at: now,
      });
    });

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
