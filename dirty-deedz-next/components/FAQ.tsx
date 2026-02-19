"use client";

import { useState, useEffect, useRef } from "react";

const faqData = [
  {
    question: "How does sidewalk advertising work?",
    answer:
      "We use high-pressure water to clean your brand\u2019s message into dirty sidewalks. The contrast between clean and dirty concrete creates a visible, temporary ad \u2014 no ink, paint, or permanent marks.",
  },
  {
    question: "How long does a campaign last?",
    answer:
      "Campaigns run in 1, 2, or 3 month terms \u2014 what we call Deedz. Duration depends on your goals, budget, and the location. Longer terms get better rates.",
  },
  {
    question: "Do property owners get paid?",
    answer:
      "Yes. Property owners receive up to 25% revenue share from ad placements on their sidewalks, plus free professional cleaning. It\u2019s passive income for space you already own.",
  },
  {
    question: "Is this legal?",
    answer:
      "Absolutely. Reverse graffiti (clean advertising) is legal because we\u2019re removing dirt, not adding anything. We also work directly with property owners who approve all placements.",
  },
  {
    question: "What happens when the campaign ends?",
    answer:
      "When the Deedz are done, we clean the entire sidewalk. The ad naturally fades as dirt returns, and the surface goes back to a clean slate \u2014 no trace left behind.",
  },
  {
    question: "Can I choose which brands advertise on my property?",
    answer:
      "100%. You have full approval rights. Dirty Deedz will never place direct competitors or inappropriate ads on your property without your sign-off.",
  },
];

export default function FAQ() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([0]));
  const revealRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const toggleItem = (index: number) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15 }
    );

    if (headerRef.current) observer.observe(headerRef.current);
    if (revealRef.current) observer.observe(revealRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="section faq" id="faq">
      <div className="container">
        <div className="faq-header reveal" ref={headerRef}>
          <span className="section-label">FAQ</span>
          <h2 className="section-title">Questions? Answers.</h2>
          <p className="section-sub">
            Everything you need to know about sidewalk advertising with Dirty
            Deedz.
          </p>
        </div>
        <div className="faq-list reveal" ref={revealRef}>
          {faqData.map((item, i) => (
            <div
              className={`faq-item${openItems.has(i) ? " open" : ""}`}
              key={i}
            >
              <button className="faq-question" onClick={() => toggleItem(i)}>
                <span className="faq-title">{item.question}</span>{" "}
                <span className="icon">+</span>
              </button>
              <div className="faq-answer">
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
