"use client";

import { useState, useEffect, useRef } from "react";

interface Step {
  img: string;
  icon: React.ReactNode;
  title: string;
  body: string;
}

const steps: Step[] = [
  {
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80",
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="22"
        height="22"
        fill="none"
        stroke="#d4ff45"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="14" cy="3" r="2" />
        <path d="M10 9l1-4 4 1 2 4" />
        <path d="M11 5l-3 4 2 3 3 1" />
        <path d="M13 13l-2 8" />
        <path d="M10 12l-4 8" />
      </svg>
    ),
    title: "We identify high foot traffic sidewalks",
    body: "Retail corridors, corners, storefronts, transit paths.",
  },
  {
    img: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80",
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="22"
        height="22"
        fill="none"
        stroke="#d4ff45"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    title: "Property owners opt in",
    body: "Clean their sidewalks at no cost and turn designated areas into temporary ad space.",
  },
  {
    img: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80",
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="22"
        height="22"
        fill="none"
        stroke="#d4ff45"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 3l-4 4-4-4" />
      </svg>
    ),
    title: "Brands lease the ground",
    body: "Ads are revealed through contrast: dirt vs. clean concrete.",
  },
  {
    img: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=800&q=80",
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="22"
        height="22"
        fill="none"
        stroke="#d4ff45"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: "Campaign runs",
    body: "2-4-6 month durations, priced by size, location and foot traffic.",
  },
  {
    img: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80",
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="22"
        height="22"
        fill="none"
        stroke="#d4ff45"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    title: "We clean everything",
    body: "When the Deedz are done (campaign ends), the sidewalk returns to a clean slate.",
  },
];

export default function HowItWorks() {
  const [openSteps, setOpenSteps] = useState<Set<number>>(new Set([0]));
  const howImageRef = useRef<HTMLImageElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  /* ── Entrance animations ── */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const targets = section.querySelectorAll<HTMLElement>(
      ".how-image, .how-steps, .reveal"
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  /* ── Step click handler ── */
  const handleStepClick = (index: number) => {
    const img = howImageRef.current;
    if (img) {
      img.style.opacity = "0";
      setTimeout(() => {
        img.src = steps[index].img;
        img.style.opacity = "1";
      }, 300);
    }

    setOpenSteps((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <section className="section how-it-works" id="how-it-works" ref={sectionRef}>
      <div className="container">
        <div className="how-header reveal">
          <span className="section-label">The Process</span>
          <h2 className="section-title">How It Works</h2>
          <p className="section-sub">
            We clean dirty sidewalks to reveal temporary, high-impact ads, right
            where foot traffic slows, pauses, and looks down. It{"\u2019"}s
            advertising at an all-time low and that{"\u2019"}s the point.
          </p>
        </div>
        <div className="how-layout">
          <div className="how-image">
            <img
              ref={howImageRef}
              src={steps[0].img}
              alt="How it works"
              style={{ transition: "opacity 0.3s ease" }}
            />
          </div>
          <div className="how-steps">
            {steps.map((step, i) => {
              const isOpen = openSteps.has(i);
              return (
                <div
                  key={i}
                  className={`how-step${isOpen ? " active" : ""}`}
                  data-img={step.img}
                >
                  <button
                    className="how-step-btn"
                    onClick={() => handleStepClick(i)}
                  >
                    <span className="how-step-icon">{step.icon}</span>
                    <span className="how-step-title">{step.title}</span>
                    <span className={`icon${isOpen ? " icon-close" : ""}`}>
                      {isOpen ? "\u00D7" : "+"}
                    </span>
                  </button>
                  <div className="how-step-body">
                    <p>{step.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
