"use client";

import { useState, useEffect, useRef } from "react";

const MERCH_IMAGES = [
  { src: "/merch-tee.jpg", alt: "Dirty Deedz Watch Your Step Tee", cls: "merch-tee" },
  { src: "/merch-snapback.jpg", alt: "Dirty Deedz Snapback", cls: "merch-hat" },
];

export default function CTA() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % MERCH_IMAGES.length);
    }, 3500);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <section className="section cta" id="cta">
      <div className="container">
        <div className="cta-grid reveal">

          {/* ── Merch / Swag ── */}
          <div className="cta-card">
            <div className="cta-card-carousel">
              {MERCH_IMAGES.map((img, i) => (
                <img
                  key={img.src}
                  src={img.src}
                  alt={img.alt}
                  className={`cta-carousel-img ${img.cls}${i === currentSlide ? " active" : ""}`}
                />
              ))}
              <div className="cta-carousel-dots">
                {MERCH_IMAGES.map((_, i) => (
                  <button
                    key={i}
                    className={`cta-dot${i === currentSlide ? " active" : ""}`}
                    onClick={() => setCurrentSlide(i)}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>
            <div className="cta-card-body">
              <span className="section-label">Rep the Brand</span>
              <h3>Get Your Dirty Deedz Swag</h3>
              <p>Hats, tees, and gear for the crew that likes it down {"\u0026"} dirty.</p>
              <a href="#" className="btn btn-primary">
                Shop Merch <span className="arrow">{"\u2192"}</span>
              </a>
            </div>
          </div>

          {/* ── Register Your Deedz ── */}
          <div className="cta-card">
            <div className="cta-card-image">
              <div className="cta-image-placeholder">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
            </div>
            <div className="cta-card-body">
              <span className="section-label">Property Owners</span>
              <h3>Register Your Deedz</h3>
              <p>Own a storefront? Turn your sidewalk into a revenue stream. Sign up and start earning.</p>
              <a href="/map" className="btn btn-primary">
                Register Now <span className="arrow">{"\u2192"}</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
