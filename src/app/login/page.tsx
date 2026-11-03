"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/account";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Login failed");
      return;
    }
    router.push(data.user.role === "ADMIN" && next === "/account" ? "/admin" : next);
    router.refresh();
  }

  return (
    <form className="panel stack" onSubmit={onSubmit} style={{ maxWidth: 460 }}>
      {error ? <div className="alert error">{error}</div> : null}
      <label>
        Email
        <input type="email" name="email" required placeholder="you@example.com" />
      </label>
      <label>
        Password
        <input type="password" name="password" required />
      </label>
      <button className="btn" type="submit" disabled={loading}>
        {loading ? "Signing in…" : "Login"}
      </button>
      <p className="muted">
        No account? <Link href="/register">Register</Link>
      </p>
      <p className="muted" style={{ fontSize: "0.85rem" }}>
        Demo admin: admin@kacollection.rw / Admin123!
        <br />
        Demo customer: customer@kacollection.rw / Customer123!
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="container page-hero" style={{ paddingBottom: "3rem" }}>
      <p className="eyebrow">Welcome back</p>
      <h1 className="page-title">Login</h1>
      <Suspense fallback={<div className="panel">Loading…</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
