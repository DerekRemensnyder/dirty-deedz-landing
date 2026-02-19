"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const HASH_LINKS = [
  { href: "#about", label: "About" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#scroll-tell", label: "Property Owners" },
  { href: "#map-feature", label: "Deedz" },
  { href: "#ad-guidelines", label: "Ads" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export default function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      if (!isHome) return;
      const sectionIds = HASH_LINKS.map((l) => l.href.replace("#", ""));
      let current = "";
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150) {
            current = id;
          }
        }
      }
      setActiveLink(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  const closeMobile = () => setMobileOpen(false);

  /* When on a non-home page, prefix hash links with "/" so they navigate back */
  const resolveHref = (href: string) => {
    if (href.startsWith("#") && !isHome) return "/" + href;
    return href;
  };

  return (
    <>
      {/* ═══ NAV ═══ */}
      <nav className={`nav${scrolled ? " scrolled" : ""}${pathname.startsWith("/map") ? " nav-map" : ""}`} id="nav">
        <div className="container">
          <a href={isHome ? "#" : "/"} className="nav-logo">
            <img src="/DirtyDeedzLogo.svg" alt="Dirty Deedz" />
          </a>

          <div className="nav-links">
            {HASH_LINKS.map((link) => (
              <a
                key={link.href}
                href={resolveHref(link.href)}
                className={
                  isHome && activeLink === link.href.replace("#", "")
                    ? "active"
                    : ""
                }
              >
                {link.label}
              </a>
            ))}
            <a
              href="/map"
              className={pathname === "/map" ? "active" : ""}
            >
              Map
            </a>
          </div>

          <div className="nav-cta">
            <a
              href="/map"
              className="btn btn-primary"
              style={{
                fontFamily: "'Roboto', sans-serif",
                fontWeight: 400,
              }}
            >
              Do the Deedz <span className="arrow"><svg className="nav-arrow" viewBox="0 0 205.82 196.86" width="9" height="9" fill="#DF3257" style={{transform:"rotate(-90deg)"}}><path d="M123,179.88l78.22-75.9c6-5.82,6.15-15.41.32-21.41h0c-5.82-6-15.41-6.15-21.41-.32l-62.86,60.99,1.93-127.87C119.32,7.01,112.65.13,104.28,0h0c-8.36-.13-15.24,6.55-15.37,14.91l-1.93,127.85-60.98-62.84c-5.82-6-15.41-6.15-21.41-.32h0c-6,5.82-6.15,15.41-.32,21.41l75.9,78.22,14.18,14.62c3.82,3.93,10.1,4.03,14.03.21l14.62-14.18Z"/></svg></span>
            </a>
          </div>

          <button
            className={`hamburger${mobileOpen ? " active" : ""}`}
            aria-label="Menu"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu${mobileOpen ? " open" : ""}`} id="mobileMenu">
        {HASH_LINKS.map((link) => (
          <a key={link.href} href={resolveHref(link.href)} onClick={closeMobile}>
            {link.label}
          </a>
        ))}
        <a href="/map" onClick={closeMobile}>
          Map
        </a>
        <a
          href="/map"
          className="btn btn-primary"
          style={{ marginTop: "12px" }}
          onClick={closeMobile}
        >
          Do The Deedz <span className="arrow">{"\u2192"}</span>
        </a>
      </div>
    </>
  );
}
