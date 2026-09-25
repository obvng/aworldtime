"use client";

import Link from "next/link";
import { Globe2, Menu, Search, X } from "lucide-react";
import { useState } from "react";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header" style={{ position: "relative", zIndex: 50 }}>
      <Link href="/" className="brand" aria-label="AWORLDTIME.COM home">
        <span className="brand-mark"><Globe2 aria-hidden="true" /></span>
        <span>AWORLDTIME.COM</span>
      </Link>
      <nav aria-label="Main navigation">
        <Link href="/world-clock">World Clock</Link>
        <Link href="/converter">Convert</Link>
        <Link href="/blog">Blog</Link>
      </nav>
      <div className="header-actions">
        <Link href="/world-clock" aria-label="Search cities"><Search aria-hidden="true" /></Link>
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
      {menuOpen ? (
        <nav
          id="mobile-navigation"
          className="mobile-navigation"
          aria-label="Mobile navigation"
          style={{
            position: "absolute",
            zIndex: 30,
            top: "calc(100% + 8px)",
            right: 0,
            minWidth: 190,
            padding: 8,
            display: "grid",
            gap: 4,
            border: "1px solid #c9dcf2",
            borderRadius: 16,
            background: "white",
            boxShadow: "0 18px 45px rgba(30, 75, 126, .18)",
          }}
        >
          <Link href="/world-clock" onClick={() => setMenuOpen(false)}>World Clock</Link>
          <Link href="/converter" onClick={() => setMenuOpen(false)}>Convert time</Link>
          <Link href="/meeting-planner" onClick={() => setMenuOpen(false)}>Meeting planner</Link>
          <Link href="/blog" onClick={() => setMenuOpen(false)}>Blog</Link>
        </nav>
      ) : null}
    </header>
  );
}
