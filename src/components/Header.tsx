"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { useCart } from "@/context/CartContext";

type User = {
  id: string;
  name: string;
  role: "CUSTOMER" | "ADMIN";
};

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount } = useCart();
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
    setOpen(false);
  }, [pathname]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  }

  const links = [
    { href: "/products", label: "Catalogue" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Logo onClick={() => setOpen(false)} />

        <button
          className="nav-toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>

        <nav className={`nav ${open ? "open" : ""}`}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname.startsWith(link.href) ? "active" : ""}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/cart" className="cart-link">
            Cart <span>{itemCount}</span>
          </Link>
          {user?.role === "ADMIN" && <Link href="/admin">Admin</Link>}
          {user ? (
            <>
              <Link href="/account">{user.name.split(" ")[0]}</Link>
              <button type="button" className="link-btn" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register" className="btn btn-small">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
