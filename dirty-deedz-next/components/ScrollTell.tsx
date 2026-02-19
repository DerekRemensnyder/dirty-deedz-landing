"use client";

import { useEffect, useRef } from "react";

export default function ScrollTell() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const cards = track.querySelectorAll<HTMLElement>(".scroll-tell-card");
    const totalCards = cards.length;

    const handleScroll = () => {
      const rect = track.getBoundingClientRect();
      const trackHeight = track.scrollHeight - window.innerHeight;
      const scrolled = -rect.top;
      const progress = Math.min(Math.max(scrolled / trackHeight, 0), 1);
      const activeIndex = Math.min(
        Math.floor(progress * totalCards),
        totalCards - 1
      );

      cards.forEach((card, i) => {
        if (i <= activeIndex) {
          card.classList.add("active");
        } else {
          card.classList.remove("active");
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="scroll-tell" id="scroll-tell">
      <div className="scroll-tell-track" ref={trackRef}>
        <div className="scroll-tell-sticky">
          <div className="scroll-tell-inner">
            <div className="scroll-tell-text">
              <span className="section-label">Property Owners</span>
              <h2>Turn passersby into passive{"\u00A0"}income.</h2>
              <p>
                Your sidewalk already gets walked all over. Now it can pay rent.
                Dirty Deedz{"\u2122"} covers the cleaning cost and shares ad
                revenue with you. All you do is sign the 2, 4 or 6 month Deedz
                {"\u2122"} to a sidewalk or wall parcel you own. That{"\u2019"}s
                it! It{"\u2019"}s a win/win.
              </p>
              <div className="scroll-tell-ctas">
                <div className="scroll-tell-cta-block">
                  <span className="scroll-tell-cta-micro">Pick a spot. Own the block.</span>
                  <a href="/map" className="btn btn-primary">Lease a Deedz</a>
                </div>
                <div className="scroll-tell-cta-block">
                  <span className="scroll-tell-cta-micro">Your sidewalk. Your revenue.</span>
                  <a href="/map?list=true" className="btn btn-outline">List Your Deedz</a>
                </div>
              </div>
            </div>
            <div className="scroll-tell-cards">

              {/* ── Card 1 ── */}
              <div className="scroll-tell-card" data-index="0">
                <div className="scroll-tell-card-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#00d29a"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <h3>Professionally Cleaned Sidewalks</h3>
                <p>
                  Why pay for clean sidewalks when Dirty Deedz will pay you to
                  clean them. It{"\u2019"}s a win-win!
                </p>
                <div className="scroll-tell-card-img">
                  <svg
                    viewBox="0 0 360 200"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect x="20" y="160" width="320" height="1" fill="#e0e0e0" />
                    <rect x="45" y="90" width="36" height="70" rx="6" fill="#d5ff45" />
                    <rect x="95" y="60" width="36" height="100" rx="6" fill="#d5ff45" />
                    <rect x="145" y="40" width="36" height="120" rx="6" fill="#d5ff45" />
                    <rect x="195" y="70" width="36" height="90" rx="6" fill="#00d29a" />
                    <rect x="245" y="30" width="36" height="130" rx="6" fill="#00d29a" />
                    <rect x="295" y="50" width="36" height="110" rx="6" fill="#00d29a" />
                    <text x="55" y="185" fontFamily="Roboto" fontSize="10" fill="#999" textAnchor="middle">Jan</text>
                    <text x="110" y="185" fontFamily="Roboto" fontSize="10" fill="#999" textAnchor="middle">Feb</text>
                    <text x="163" y="185" fontFamily="Roboto" fontSize="10" fill="#999" textAnchor="middle">Mar</text>
                    <text x="213" y="185" fontFamily="Roboto" fontSize="10" fill="#999" textAnchor="middle">Apr</text>
                    <text x="263" y="185" fontFamily="Roboto" fontSize="10" fill="#999" textAnchor="middle">May</text>
                    <text x="313" y="185" fontFamily="Roboto" fontSize="10" fill="#999" textAnchor="middle">Jun</text>
                    <text x="30" y="18" fontFamily="Roboto" fontSize="11" fontWeight="500" fill="#0a0a0a">Cleanliness Score</text>
                    <text x="250" y="18" fontFamily="Roboto" fontSize="11" fill="#00d29a">{"\u25B2"} 94%</text>
                  </svg>
                </div>
                <div className="scroll-tell-card-num">01 / 03</div>
              </div>

              {/* ── Card 2 ── */}
              <div className="scroll-tell-card" data-index="1">
                <div className="scroll-tell-card-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#00d29a"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                  </svg>
                </div>
                <h3>Revenue Sharing from Ad Placements</h3>
                <p>
                  Each of your dirty sidewalk frames are your {"\u201C"}Deedz
                  {"\u201D"}. Let us fill it with passive income! Make up to $200
                  for each slab of sidewalk!
                </p>
                <div className="scroll-tell-card-img">
                  <svg
                    viewBox="0 0 360 200"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect x="20" y="160" width="320" height="1" fill="#e0e0e0" />
                    <polyline
                      points="40,140 90,120 140,90 190,100 240,55 290,40 330,25"
                      stroke="#d5ff45"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <defs>
                      <linearGradient id="stGrad1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#d5ff45" />
                        <stop offset="100%" stopColor="#d5ff45" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <polygon
                      points="40,140 90,120 140,90 190,100 240,55 290,40 330,25 330,160 40,160"
                      fill="url(#stGrad1)"
                      opacity=".15"
                    />
                    <circle cx="240" cy="55" r="5" fill="#d5ff45" />
                    <circle cx="290" cy="40" r="5" fill="#d5ff45" />
                    <circle cx="330" cy="25" r="5" fill="#d5ff45" />
                    <text x="30" y="18" fontFamily="Roboto" fontSize="11" fontWeight="500" fill="#0a0a0a">Monthly Revenue Share</text>
                    <text x="258" y="18" fontFamily="Roboto" fontSize="11" fill="#00d29a">{"\u25B2"} 25%</text>
                    <text x="40" y="185" fontFamily="Roboto" fontSize="10" fill="#999">Q1</text>
                    <text x="140" y="185" fontFamily="Roboto" fontSize="10" fill="#999">Q2</text>
                    <text x="240" y="185" fontFamily="Roboto" fontSize="10" fill="#999">Q3</text>
                    <text x="320" y="185" fontFamily="Roboto" fontSize="10" fill="#999">Q4</text>
                  </svg>
                </div>
                <div className="scroll-tell-card-num">02 / 03</div>
              </div>

              {/* ── Card 3 ── */}
              <div className="scroll-tell-card" data-index="2">
                <div className="scroll-tell-card-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#00d29a"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                </div>
                <h3>Full Approval Rights on Advertisers</h3>
                <p>
                  Dirty Deedz{"\u2122"} will not apply direct competitors or
                  illegal ads on your property.
                </p>
                <div className="scroll-tell-card-img">
                  <svg
                    viewBox="0 0 360 200"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="130" cy="100" r="70" fill="none" stroke="#e0e0e0" strokeWidth="12" />
                    <circle
                      cx="130"
                      cy="100"
                      r="70"
                      fill="none"
                      stroke="#d5ff45"
                      strokeWidth="12"
                      strokeDasharray="330 440"
                      strokeLinecap="round"
                      transform="rotate(-90 130 100)"
                    />
                    <circle cx="130" cy="100" r="50" fill="none" stroke="#e0e0e0" strokeWidth="12" />
                    <circle
                      cx="130"
                      cy="100"
                      r="50"
                      fill="none"
                      stroke="#00d29a"
                      strokeWidth="12"
                      strokeDasharray="275 314"
                      strokeLinecap="round"
                      transform="rotate(-90 130 100)"
                    />
                    <text x="130" y="96" fontFamily="Roboto" fontSize="20" fontWeight="700" fill="#0a0a0a" textAnchor="middle">100%</text>
                    <text x="130" y="114" fontFamily="Roboto" fontSize="10" fill="#999" textAnchor="middle">Your Approval</text>
                    <text x="250" y="65" fontFamily="Roboto" fontSize="11" fill="#0a0a0a">{"\u2713"} Brand Vetted</text>
                    <rect x="245" y="72" width="80" height="4" rx="2" fill="#e0e0e0" />
                    <rect x="245" y="72" width="72" height="4" rx="2" fill="#d5ff45" />
                    <text x="250" y="100" fontFamily="Roboto" fontSize="11" fill="#0a0a0a">{"\u2713"} No Competitors</text>
                    <rect x="245" y="107" width="80" height="4" rx="2" fill="#e0e0e0" />
                    <rect x="245" y="107" width="80" height="4" rx="2" fill="#00d29a" />
                    <text x="250" y="135" fontFamily="Roboto" fontSize="11" fill="#0a0a0a">{"\u2713"} Legal Compliant</text>
                    <rect x="245" y="142" width="80" height="4" rx="2" fill="#e0e0e0" />
                    <rect x="245" y="142" width="68" height="4" rx="2" fill="#d5ff45" />
                  </svg>
                </div>
                <div className="scroll-tell-card-num">03 / 03</div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
