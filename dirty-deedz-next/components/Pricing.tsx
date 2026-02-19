"use client";

import { useState, useEffect, useRef } from "react";

export default function Pricing() {
  const [ownerIncomeOpen, setOwnerIncomeOpen] = useState<Record<number, boolean>>({});
  const revealRefs = useRef<HTMLElement[]>([]);

  const toggleOwnerIncome = (cardIndex: number) => {
    setOwnerIncomeOpen((prev) => ({
      ...prev,
      [cardIndex]: !prev[cardIndex],
    }));
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

    revealRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const addRevealRef = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  return (
    <section className="section pricing" id="pricing">
      <div className="container">
        <div className="pricing-header reveal" ref={addRevealRef}>
          <span className="section-label">Pricing</span>
          <h2 className="section-title">Do the Deedz</h2>
          <p className="section-sub">
            A product so good it stops you in your stroll. Sure, we get looked
            down on and walked all over—that's the whole point. Dirty Deedz,
            done dirt cheap. Here's the down low.
          </p>
        </div>
        <div className="pricing-grid">

          {/* Card 1 — Street Cred */}
          <div className="pricing-card reveal" ref={addRevealRef}>
            <div className="card-badge">Best for Short Events</div>
            <div className="tier">The Street Cred</div>
            <div className="savings">$400/mo</div>
            <div className="price">
              $800<span className="asterisk">*</span> <span>/ 2 months</span>
            </div>
            <p className="desc">
              Stand your ground. Drop your mark on the map. Two months to test
              the pavement and see what sticks. No commitment speeches—just
              concrete results.
            </p>
            <div className={`owner-income${ownerIncomeOpen[0] ? " open" : ""}`}>
              <div
                className="owner-income-toggle"
                onClick={() => toggleOwnerIncome(0)}
              >
                <strong>$80 Owner Payout</strong>
                <span className="icon">+</span>
              </div>
              <div className="owner-income-body">
                <span>
                  10% passive income paid to property owner after the final wash
                  to a clean{"\u00A0"}slate.
                </span>
              </div>
            </div>
            <ul>
              <li>1 sidewalk or wall Deedz</li>
              <li>Professional pressure-wash install</li>
              <li>Final clean-slate wash included</li>
              <li>Deedz starts within 2 weeks of approval</li>
            </ul>
            <a href="#" className="btn btn-outline">
              Lock It Down <span className="arrow">{"\u2192"}</span>
            </a>
            <p className="design-note">
              *Price with your design. <strong>+$200</strong> if we design it.
            </p>
          </div>

          {/* Card 2 — Hustle */}
          <div className="pricing-card reveal" ref={addRevealRef}>
            <div className="card-badge">Best for Campaign Runs</div>
            <div className="tier">The Hustle</div>
            <div className="savings">
              $350/mo
              <br />
              save $200
            </div>
            <div className="price">
              $1,400<span className="asterisk">*</span>{" "}
              <span>/ 4 months</span>
            </div>
            <p className="desc">
              The real play. Four months of foot traffic pounding your name into
              the neighborhood. This is where brands stop being logos and start
              being landmarks.
            </p>
            <div className={`owner-income${ownerIncomeOpen[1] ? " open" : ""}`}>
              <div
                className="owner-income-toggle"
                onClick={() => toggleOwnerIncome(1)}
              >
                <strong>$140 Owner Payout</strong>
                <span className="icon">+</span>
              </div>
              <div className="owner-income-body">
                <span>
                  10% passive income paid to property owner after the final wash
                  to a clean{"\u00A0"}slate.
                </span>
              </div>
            </div>
            <ul>
              <li>1 sidewalk or wall Deedz</li>
              <li>Professional pressure-wash install</li>
              <li>Final clean-slate wash included</li>
              <li>Deedz starts within 2 weeks of approval</li>
              <li>Priority placement scheduling</li>
            </ul>
            <a href="#" className="btn btn-outline">
              Stake Your Claim <span className="arrow">{"\u2192"}</span>
            </a>
            <p className="design-note">
              *Price with your design. <strong>+$200</strong> if we design it.
            </p>
          </div>

          {/* Card 3 — Takeover */}
          <div className="pricing-card reveal" ref={addRevealRef}>
            <div className="card-badge">Best for Brand Awareness</div>
            <div className="tier">The Takeover</div>
            <div className="savings">
              $333/mo
              <br />
              save $400
            </div>
            <div className="price">
              $2,000<span className="asterisk">*</span>{" "}
              <span>/ 6 months</span>
            </div>
            <p className="desc">
              Six months. One block. Total dominance. You're not renting a
              sidewalk—you're claiming territory. The longest run at the lowest
              burn.
            </p>
            <div className={`owner-income${ownerIncomeOpen[2] ? " open" : ""}`}>
              <div
                className="owner-income-toggle"
                onClick={() => toggleOwnerIncome(2)}
              >
                <strong>$200 Owner Payout</strong>
                <span className="icon">+</span>
              </div>
              <div className="owner-income-body">
                <span>
                  10% passive income paid to property owner after the final wash
                  to a clean{"\u00A0"}slate.
                </span>
              </div>
            </div>
            <ul>
              <li>1 sidewalk or wall Deedz</li>
              <li>Professional pressure-wash install</li>
              <li>Final clean-slate wash included</li>
              <li>Deedz starts within 2 weeks of approval</li>
              <li>Priority placement scheduling</li>
            </ul>
            <a href="#" className="btn btn-outline">
              Take The Block <span className="arrow">{"\u2192"}</span>
            </a>
            <p className="design-note">
              *Price with your design. <strong>+$200</strong> if we design it.
            </p>
          </div>

          {/* Custom horizontal card */}
          <div className="pricing-custom reveal" ref={addRevealRef}>
            <div className="pricing-custom-img">
              <img src="/dd-van.png" alt="Dirty Deedz Van" loading="lazy" />
            </div>
            <div className="pricing-custom-content">
              <div className="tier">The Full Crew</div>
              <h3>
                Multiple Deedz. Bigger Messages. Custom Campaign.
              </h3>
              <p>
                Need to blanket a neighborhood, run multi-block campaigns, or go
                bigger than a single parcel? We'll build a custom package with
                volume pricing, dedicated project management, and a rollout plan
                that hits every sidewalk on your list.
              </p>
              <a href="#" className="btn btn-outline">
                Talk To Us <span className="arrow">{"\u2192"}</span>
              </a>
            </div>
          </div>

        </div>
        <div className="pricing-terms reveal" ref={addRevealRef}>
          <p>
            All contract terms must be agreed to by both parties (Advertiser &
            Property Owner). Scheduled Deedz will begin within 2 weeks of mutual
            approval. The Lessor (property owner) is solely responsible for
            confirming property rights and legal authorization for the placement.
            Dirty Deedz™ is exempt from any liability related to property rights
            or ownership disputes. All ads are subject to size, safe-zone, and
            design spec requirements outlined in our{" "}
            <a
              href="#ad-guidelines"
              style={{ color: "var(--accent)", textDecoration: "underline" }}
            >
              Ad Guidelines
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
