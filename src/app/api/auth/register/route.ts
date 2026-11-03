import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createSession,
  findUserByEmail,
  hashPassword,
  toPublicUser,
} from "@/lib/auth";
import { createId, updateStore } from "@/lib/store";

const schema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  email: z.string().trim().email("Valid email required"),
  phone: z.string().trim().min(10, "Phone is required").optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Za-z]/, "Password must include a letter")
    .regex(/[0-9]/, "Password must include a number"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const email = parsed.data.email.toLowerCase();
    if (findUserByEmail(email)) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const id = createId();
    const passwordHash = await hashPassword(parsed.data.password);
    const now = new Date().toISOString().replace("T", " ").slice(0, 19);

    updateStore((store) => {
      store.users.push({
        id,
        name: parsed.data.name,
        email,
        password_hash: passwordHash,
        phone: parsed.data.phone || null,
        role: "CUSTOMER",
        created_at: now,
      });
    });

    const user = findUserByEmail(email)!;
    const sessionUser = toPublicUser(user);
    await createSession(sessionUser);

    return NextResponse.json({ user: sessionUser });
  } catch {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
