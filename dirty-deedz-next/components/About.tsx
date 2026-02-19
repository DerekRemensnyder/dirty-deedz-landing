"use client";

import { useEffect, useRef } from "react";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    /* ── Reveal animation ── */
    const revealEls = section.querySelectorAll<HTMLElement>(".reveal");
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => revealObserver.observe(el));

    /* ── Clip-reveal animation ── */
    const clipEls = section.querySelectorAll<HTMLElement>(".clip-reveal");
    const clipObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            clipObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    clipEls.forEach((el) => clipObserver.observe(el));

    /* ── Count-up animation ── */
    const countEls = section.querySelectorAll<HTMLElement>(".count-up");
    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          countObserver.unobserve(el);

          const target = parseFloat(el.dataset.target || "0");
          const suffix = el.dataset.suffix || "";
          const isZero = el.dataset.isZero === "true";

          if (isZero) {
            el.textContent = "0" + suffix;
            return;
          }

          const duration = 1600;
          const start = performance.now();

          const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);
            const current = Math.round(easedProgress * target);
            el.textContent = current + suffix;
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        });
      },
      { threshold: 0.5 }
    );
    countEls.forEach((el) => countObserver.observe(el));

    return () => {
      revealObserver.disconnect();
      clipObserver.disconnect();
      countObserver.disconnect();
    };
  }, []);

  return (
    <section className="section about" id="about" ref={sectionRef}>
      <img src="/DirtyDeedzLogo.svg" alt="Dirty Deedz" className="about-logo" />
      <div className="container">
        <div
          className="about-intro reveal"
          style={{ textAlign: "center", margin: "0 auto 64px" }}
        >
          <h2 className="section-title" style={{ maxWidth: "none" }}>
            This is advertising with street cred...Literally.
          </h2>
          <p className="section-sub" style={{ maxWidth: "900px", margin: "0 auto" }}>
            Ads don{"\u2019"}t need to shout to be seen. They just need to be right under
            your feet. Dirty Deedz turns overlooked sidewalk space into high-contrast,
            ground-level advertising{"\u2014"}cleaned into existence using water and
            pressure. No ink. No stickers. No permanent marks. Just smart placements
            where people are already looking: down.
          </p>
        </div>
        <div className="grid">
          <div className="about-visual reveal">
            <div className="clip-reveal">
              <img src="/about-img.jpg" alt="Dirty Deedz sidewalk ad with phone" />
            </div>
          </div>
          <div className="reveal">
            <span className="section-label">About Us</span>
            <h2 className="section-title">
              Guerrilla Marketing Meets Clean{"\u00A0"}Streets
            </h2>
            <p className="section-sub">
              Dirty Deedz{"\u2122"} is ground-level advertising{"\u2014"}literally. We
              partner with property owners, clean their sidewalks for free, and turn
              that space into high-impact ad placements for local and national brands.
              No ink. No vinyl. No waste. Just water, pressure, and a whole lot of
              street cred.
            </p>
          </div>
        </div>
        <div className="about-stats reveal">
          <div>
            <strong
              className="count-up"
              data-target="100"
              data-suffix="%"
            >
              100%
            </strong>
            <span>Environmentally Friendly</span>
          </div>
          <div>
            <strong
              className="count-up"
              data-target="10"
              data-suffix="%"
            >
              10%
            </strong>
            <span>Revenue Share</span>
          </div>
          <div>
            <strong
              className="count-up"
              data-target="0"
              data-suffix=""
              data-is-zero="true"
            >
              0
            </strong>
            <span>Permanent Marks</span>
          </div>
          <div>
            <strong
              className="count-up"
              data-target="100"
              data-suffix="%"
            >
              100%
            </strong>
            <span>Unforgettable</span>
          </div>
        </div>
      </div>
    </section>
  );
}
