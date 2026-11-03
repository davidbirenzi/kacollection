import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createSession,
  findUserByEmail,
  toPublicUser,
  verifyPassword,
} from "@/lib/auth";

const schema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1, "Password is required"),
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

    const user = findUserByEmail(parsed.data.email);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const valid = await verifyPassword(parsed.data.password, user.password_hash);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const sessionUser = toPublicUser(user);
    await createSession(sessionUser);
    return NextResponse.json({ user: sessionUser });
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
