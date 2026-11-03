"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        phone: form.get("phone"),
        password: form.get("password"),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Registration failed");
      return;
    }
    router.push("/account");
    router.refresh();
  }

  return (
    <div className="container page-hero" style={{ paddingBottom: "3rem" }}>
      <p className="eyebrow">Create account</p>
      <h1 className="page-title">Customer registration</h1>
      <form className="panel stack" onSubmit={onSubmit} style={{ maxWidth: 520 }}>
        {error ? <div className="alert error">{error}</div> : null}
        <label>
          Full name
          <input name="name" required minLength={2} />
        </label>
        <label>
          Email
          <input type="email" name="email" required />
        </label>
        <label>
          Phone
          <input name="phone" required placeholder="+2507…" />
        </label>
        <label>
          Password
          <input
            type="password"
            name="password"
            required
            minLength={8}
            placeholder="At least 8 characters with a number"
          />
        </label>
        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Creating…" : "Register"}
        </button>
        <p className="muted">
          Already registered? <Link href="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
