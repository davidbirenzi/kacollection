"use client";

import { FormEvent, useState } from "react";

export default function ContactPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        subject: form.get("subject"),
        message: form.get("message"),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Could not send message");
      return;
    }
    setSuccess(data.message);
    event.currentTarget.reset();
  }

  return (
    <div className="container page-hero" style={{ paddingBottom: "3rem" }}>
      <p className="eyebrow">Customer care</p>
      <h1 className="page-title">Contact KaCollection</h1>
      <div className="split" style={{ marginTop: "1.5rem" }}>
        <form className="panel stack" onSubmit={onSubmit}>
          {error ? <div className="alert error">{error}</div> : null}
          {success ? <div className="alert">{success}</div> : null}
          <label>
            Name
            <input name="name" required />
          </label>
          <label>
            Email
            <input type="email" name="email" required />
          </label>
          <label>
            Subject
            <input name="subject" required />
          </label>
          <label>
            Message
            <textarea name="message" required minLength={10} />
          </label>
          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Sending…" : "Send message"}
          </button>
        </form>
        <aside className="panel stack">
          <h2 style={{ margin: 0 }}>Visit / call</h2>
          <p>KN 4 Ave, Nyarugenge, Kigali</p>
          <p>0791759449</p>
          <p>hello@kacollection.rw</p>
          <p className="muted">Monday–Saturday · 08:00–18:00</p>
          <a
            className="btn btn-secondary"
            href="https://wa.me/250791759449"
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp live chat link
          </a>
        </aside>
      </div>
    </div>
  );
}
