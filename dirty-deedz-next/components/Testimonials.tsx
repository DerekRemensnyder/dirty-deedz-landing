"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const slides = [
  {
    quote:
      "\u201CEvoTrack completely transformed how we handle data. Our team saves 15+ hours a week and our accuracy has never been higher.\u201D",
    initials: "AK",
    name: "Alex Kim",
    title: "VP of Engineering, Arclight",
  },
  {
    quote:
      "\u201CThe predictive analytics alone paid for our subscription in the first month. It\u2019s like having a crystal ball for our metrics.\u201D",
    initials: "SR",
    name: "Sarah Reeves",
    title: "Head of Product, Novalink",
  },
  {
    quote:
      "\u201CWe evaluated 12 platforms before choosing EvoTrack. Nothing else comes close in terms of speed, design, and flexibility.\u201D",
    initials: "JM",
    name: "James Moreno",
    title: "CTO, Baseline Systems",
  },
  {
    quote:
      "\u201CIntegration was seamless. We were up and running in under a day and the support team is incredibly responsive.\u201D",
    initials: "LP",
    name: "Lisa Park",
    title: "Operations Lead, Helix Health",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((index: number) => {
    setCurrent(index);
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(-${index * 100}%)`;
    }
  }, []);

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, goTo]);

  /* Auto-advance */
  useEffect(() => {
    const startAutoPlay = () => {
      intervalRef.current = setInterval(() => {
        setCurrent((prev) => {
          const nextIndex = (prev + 1) % slides.length;
          if (trackRef.current) {
            trackRef.current.style.transform = `translateX(-${nextIndex * 100}%)`;
          }
          return nextIndex;
        });
      }, 5000);
    };

    startAutoPlay();

    const wrapper = wrapperRef.current;

    const pauseAutoPlay = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };

    if (wrapper) {
      wrapper.addEventListener("mouseenter", pauseAutoPlay);
      wrapper.addEventListener("mouseleave", startAutoPlay);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (wrapper) {
        wrapper.removeEventListener("mouseenter", pauseAutoPlay);
        wrapper.removeEventListener("mouseleave", startAutoPlay);
      }
    };
  }, []);

  return (
    <section className="section testimonials" id="testimonials">
      <div className="container">
        <div className="testimonials-header reveal">
          <span className="section-label">Testimonials</span>
          <h2 className="section-title">Loved by Thousands</h2>
          <p className="section-sub">
            Don't take our word for it — hear from the teams already using
            EvoTrack.
          </p>
        </div>
        <div className="slider-wrapper reveal" ref={wrapperRef}>
          <div className="slider-track" ref={trackRef}>
            {slides.map((slide, i) => (
              <div className="slide" key={i}>
                <div className="slide-inner">
                  <div className="stars">{"\u2605\u2605\u2605\u2605\u2605"}</div>
                  <blockquote>{slide.quote}</blockquote>
                  <div className="author">
                    <div className="avatar">{slide.initials}</div>
                    <div className="author-info">
                      <strong>{slide.name}</strong>
                      <span>{slide.title}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="slider-controls">
            <button
              className="slider-btn"
              aria-label="Previous"
              onClick={prev}
            >
              {"\u2039"}
            </button>
            <div className="slider-dots">
              {slides.map((_, i) => (
                <button
                  key={i}
                  className={`dot${i === current ? " active" : ""}`}
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
            <button
              className="slider-btn"
              aria-label="Next"
              onClick={next}
            >
              {"\u203A"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
