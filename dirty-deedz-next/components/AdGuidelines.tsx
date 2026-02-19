"use client";

import { useState } from "react";

export default function AdGuidelines() {
  const [openCards, setOpenCards] = useState<Set<number>>(new Set());

  const handleCardClick = (index: number) => {
    setOpenCards((prev) => {
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
    <section className="section ad-guidelines" id="ad-guidelines">
      <div className="container">
        <div className="ad-guidelines-header reveal">
          <span className="section-label">Your Ad, Your Way</span>
          <h2 className="section-title">
            <div className="ad-title-part"><span>Submit</span><span>Your Ad</span></div>
            <div className="ad-title-or">OR</div>
            <div className="ad-title-part"><span>Let Us</span><span>Design It</span></div>
          </h2>
          <p className="section-sub">Upload your own custom ad or have our team create one for you. Either way, follow the specs below to ensure your ad looks sharp on every surface.</p>
        </div>

        {/* Two options: Upload or Have Us Design */}
        <div className="ad-options reveal">
          <div className="ad-option-card">
            <div className="ad-option-icon">
              <svg viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <h3>Upload Your Own Ad</h3>
            <p>Already have a design? Upload your print-ready file and we{"\u2019"}ll handle the rest. Just make sure it meets our specs below.</p>
          </div>
          <div className="ad-option-card">
            <div className="ad-option-icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 19l7-7 3 3-7 7-3-3z" />
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                <path d="M2 2l7.586 7.586" />
                <circle cx="11" cy="11" r="2" />
              </svg>
            </div>
            <h3>Have Us Create Your Ad</h3>
            <p>Don{"\u2019"}t have a designer? No problem. Our team will craft a professional ad that meets all guidelines and gets your message across.</p>
          </div>
        </div>

        {/* Specs Grid */}
        <div className="ad-specs-grid reveal">

          <div
            className={`ad-spec-card${openCards.has(0) ? " open" : ""}`}
            onClick={() => handleCardClick(0)}
          >
            <h4>
              <svg viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              {" "}Accepted File Types
            </h4>
            <ul>
              <li>Adobe Illustrator (.ai)</li>
              <li>PDF (print-ready, high-res)</li>
              <li>Vector formats only</li>
              <li>No JPG, PNG, or raster files</li>
            </ul>
          </div>

          <div
            className={`ad-spec-card${openCards.has(1) ? " open" : ""}`}
            onClick={() => handleCardClick(1)}
          >
            <h4>
              <svg viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="9" y1="21" x2="9" y2="9" />
              </svg>
              {" "}Size & Safe Zone
            </h4>
            <ul>
              <li>Standard ad sizes available</li>
              <li>3" safe zone border on all sides</li>
              <li>Keep all critical content within safe zone</li>
              <li>Download template for exact dimensions</li>
            </ul>
          </div>

          <div
            className={`ad-spec-card${openCards.has(2) ? " open" : ""}`}
            onClick={() => handleCardClick(2)}
          >
            <h4>
              <svg viewBox="0 0 24 24">
                <path d="M4 7V4h16v3" />
                <path d="M9 20h6" />
                <path d="M12 4v16" />
              </svg>
              {" "}Typography Rules
            </h4>
            <ul>
              <li>Minimum letter height: 2 inches</li>
              <li>Weights: Medium, Semibold, or Extra Bold</li>
              <li>No lightweight or thin font styles</li>
              <li>No script or decorative typefaces</li>
            </ul>
          </div>

          <div
            className={`ad-spec-card${openCards.has(3) ? " open" : ""}`}
            onClick={() => handleCardClick(3)}
          >
            <h4>
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
              </svg>
              {" "}Color & Style
            </h4>
            <ul>
              <li>Black and white only {"\u2014"} no colors</li>
              <li>High contrast for readability</li>
              <li>Solid fills, no gradients</li>
              <li>Clean, bold compositions</li>
            </ul>
          </div>

          <div
            className={`ad-spec-card${openCards.has(4) ? " open" : ""}`}
            onClick={() => handleCardClick(4)}
          >
            <h4>
              <svg viewBox="0 0 24 24">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
              </svg>
              {" "}Best Practices
            </h4>
            <ul>
              <li>Keep messaging simple and direct</li>
              <li>Limit text {"\u2014"} less is more</li>
              <li>Use the provided template</li>
              <li>Test legibility at actual print size</li>
            </ul>
          </div>

          <div
            className={`ad-spec-card${openCards.has(5) ? " open" : ""}`}
            onClick={() => handleCardClick(5)}
          >
            <h4>
              <svg viewBox="0 0 24 24">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              {" "}Not Approved
            </h4>
            <ul>
              <li>Letters smaller than 2" in height</li>
              <li>Light, thin, or ultra-light weights</li>
              <li>Script, cursive, or handwritten fonts</li>
              <li>Color artwork or photographs</li>
            </ul>
          </div>

        </div>

        {/* Template Download */}
        <div className="ad-template-download reveal">
          <h3>Download the Ad Template</h3>
          <p>Use our pre-built template to ensure your ad meets all specs. Available in PDF and Adobe Illustrator formats.</p>
          <div className="ad-template-btns">
            <a href="#" className="ad-template-btn">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="9" y1="15" x2="15" y2="15" />
              </svg>
              Download PDF Template
            </a>
            <a href="#" className="ad-template-btn">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#ff9a00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <path d="M8 13h2l2 4 2-4h2" />
              </svg>
              Download .AI Template
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
