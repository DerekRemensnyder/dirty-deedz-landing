"use client";

import { useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────
   Shared helpers
───────────────────────────────────────────── */

// Actual brand arrow SVG used throughout the app
const BrandArrow = ({ size = 9, fill = "currentColor" }: { size?: number; fill?: string }) => (
  <svg viewBox="0 0 205.82 196.86" width={size} height={size} fill={fill} style={{ transform: "rotate(-90deg)", display: "inline-block", verticalAlign: "middle" }}>
    <path d="M123,179.88l78.22-75.9c6-5.82,6.15-15.41.32-21.41h0c-5.82-6-15.41-6.15-21.41-.32l-62.86,60.99,1.93-127.87C119.32,7.01,112.65.13,104.28,0h0c-8.36-.13-15.24,6.55-15.37,14.91l-1.93,127.85-60.98-62.84c-5.82-6-15.41-6.15-21.41-.32h0c-6,5.82-6.15,15.41-.32,21.41l75.9,78.22,14.18,14.62c3.82,3.93,10.1,4.03,14.03.21l14.62-14.18Z" />
  </svg>
);

// Marker matching actual .map-marker / .marker-dot / .marker-ring CSS
const Marker = ({
  top, left, color, active = false, faded = false, pulse = false,
}: { top: string; left: string; color: string; active?: boolean; faded?: boolean; pulse?: boolean }) => (
  <div style={{
    position: "absolute", top, left,
    transform: "translate(-50%,-50%)",
    width: 22, height: 22,
    display: "flex", alignItems: "center", justifyContent: "center",
    opacity: faded ? 0.22 : 1,
    zIndex: 3,
  }}>
    <div className={pulse ? "mf-pulse-ring" : undefined} style={{
      position: "absolute",
      width: active ? 28 : 22, height: active ? 28 : 22,
      borderRadius: "50%",
      border: `2px solid ${color}`,
      opacity: active ? 0.8 : 0.4,
    }} />
    <div style={{
      width: active ? 13 : 10, height: active ? 13 : 10,
      borderRadius: "50%",
      background: color,
      position: "absolute",
      zIndex: 2,
      boxShadow: active ? `0 0 14px 4px ${color}66` : `0 0 6px 1px ${color}44`,
    }} />
  </div>
);

export default function MapFeature() {
  const sectionRef = useRef<HTMLElement>(null);
  const [filterStep, setFilterStep] = useState(0);
  const frame1ActiveRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phoneEnteredRef = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Pre-hide phone for entry animation
    const phoneInner = section.querySelector<HTMLElement>(".map-scroll-phone-inner");
    phoneInner?.classList.add("phone-pre-enter");

    const callouts = section.querySelectorAll<HTMLElement>(".map-callout");
    const frameLayers = section.querySelectorAll<HTMLElement>(".phone-frame-layer");

    const handleScroll = () => {
      const midY = window.innerHeight / 2;
      let activeIdx = "0";
      let minDist = Infinity;

      callouts.forEach((callout) => {
        const rect = callout.getBoundingClientRect();
        const centerY = (rect.top + rect.bottom) / 2;
        const dist = Math.abs(centerY - midY);
        if (dist < minDist) {
          minDist = dist;
          activeIdx = callout.getAttribute("data-callout") ?? "0";
        }
      });

      callouts.forEach((callout) => {
        callout.classList.toggle(
          "in-view",
          callout.getAttribute("data-callout") === activeIdx
        );
      });

      frameLayers.forEach((layer) => {
        layer.classList.toggle(
          "active",
          layer.getAttribute("data-frame") === activeIdx
        );
      });

      // Phone entry animation (one-shot)
      const sectionRect = section.getBoundingClientRect();
      if (!phoneEnteredRef.current && sectionRect.top < window.innerHeight * 0.75) {
        phoneEnteredRef.current = true;
        phoneInner?.classList.remove("phone-pre-enter");
        phoneInner?.classList.add("phone-entered");
      }

      // Frame 1 filter animation
      const isFrame1 = activeIdx === "1";
      if (isFrame1 && !frame1ActiveRef.current) {
        frame1ActiveRef.current = true;
        setFilterStep(0);
        intervalRef.current = setInterval(() => {
          setFilterStep((s) => (s + 1) % 3);
        }, 2000);
      } else if (!isFrame1 && frame1ActiveRef.current) {
        frame1ActiveRef.current = false;
        if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <section className="map-scroll map-scroll--reversed" id="map-feature" ref={sectionRef}>
      <div className="map-scroll-inner">

        {/* ── Sticky phone mockup ── */}
        <div className="map-scroll-phone">
          <div className="map-scroll-phone-inner">
            <div className="phone-glow"></div>
            <div className="phone-frame">
              <div className="phone-notch"></div>
              <div className="phone-screen">

                {/* ══════════════════════════════════════
                    BASE MAP — Mapbox dark-v11 style
                    Always visible beneath frame layers
                ══════════════════════════════════════ */}
                <div className="phone-screen-map">
                  <svg
                    viewBox="0 0 280 580"
                    preserveAspectRatio="xMidYMid slice"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
                  >
                    {/* dark-v11 land background */}
                    <rect width="280" height="580" fill="#191a1e" />

                    {/* East River / water strip (right) */}
                    <polygon points="228,0 280,0 280,580 234,580" fill="#111319" />
                    {/* Shoreline squiggle */}
                    <polyline points="228,0 231,95 226,185 232,275 227,370 233,460 228,580" stroke="#1a1d26" strokeWidth="2" fill="none" />

                    {/* ── City blocks (Manhattan grid) ── */}
                    {/* Major N-S avenues at x≈52, 104, 154, 204 */}
                    {/* Streets every ~68px: y≈78, 146, 214, 282, 350, 418, 490 */}

                    {/* Row 0 (top) */}
                    <rect x="0"   y="0"  width="50"  height="75" fill="#1e2026" />
                    <rect x="54"  y="0"  width="47"  height="75" fill="#1d1f24" />
                    <rect x="55"  y="4"  width="45"  height="28" fill="#20222a" rx="1" /> {/* building mass */}
                    <rect x="105" y="0"  width="46"  height="75" fill="#1e2026" />
                    <rect x="155" y="0"  width="46"  height="75" fill="#1d1f24" />
                    <rect x="156" y="6"  width="40"  height="32" fill="#20222a" rx="1" />
                    <rect x="205" y="0"  width="23"  height="75" fill="#1e2026" />

                    {/* Row 1 */}
                    <rect x="0"   y="79" width="50"  height="64" fill="#1d1f24" />
                    <rect x="2"   y="83" width="34"  height="38" fill="#21232b" rx="1" />
                    <rect x="54"  y="79" width="47"  height="64" fill="#1e2026" />
                    <rect x="57"  y="82" width="40"  height="28" fill="#20222a" rx="1" />
                    <rect x="105" y="79" width="46"  height="64" fill="#1d1f24" />
                    <rect x="155" y="79" width="46"  height="64" fill="#1e2026" />
                    <rect x="157" y="83" width="38"  height="30" fill="#20222a" rx="1" />
                    <rect x="205" y="79" width="23"  height="64" fill="#1d1f24" />

                    {/* Row 2 */}
                    <rect x="0"   y="147" width="50"  height="64" fill="#1e2026" />
                    <rect x="54"  y="147" width="47"  height="64" fill="#1d1f24" />
                    <rect x="56"  y="150" width="43"  height="36" fill="#20222a" rx="1" />
                    <rect x="105" y="147" width="46"  height="64" fill="#1e2026" />
                    <rect x="107" y="151" width="40"  height="24" fill="#21232b" rx="1" />
                    {/* Small park */}
                    <rect x="155" y="147" width="46"  height="64" fill="#1b2019" />
                    <rect x="205" y="147" width="23"  height="64" fill="#1e2026" />

                    {/* Row 3 */}
                    <rect x="0"   y="215" width="50"  height="64" fill="#1d1f24" />
                    <rect x="2"   y="218" width="38"  height="32" fill="#20222a" rx="1" />
                    <rect x="54"  y="215" width="47"  height="64" fill="#1e2026" />
                    <rect x="105" y="215" width="46"  height="64" fill="#1d1f24" />
                    <rect x="108" y="218" width="38"  height="30" fill="#20222a" rx="1" />
                    <rect x="155" y="215" width="46"  height="64" fill="#1e2026" />
                    <rect x="158" y="218" width="40"  height="28" fill="#21232b" rx="1" />
                    <rect x="205" y="215" width="23"  height="64" fill="#1d1f24" />

                    {/* Row 4 */}
                    <rect x="0"   y="283" width="50"  height="64" fill="#1e2026" />
                    <rect x="54"  y="283" width="47"  height="64" fill="#1d1f24" />
                    <rect x="56"  y="286" width="42"  height="30" fill="#20222a" rx="1" />
                    <rect x="105" y="283" width="46"  height="64" fill="#1e2026" />
                    {/* Park block */}
                    <rect x="155" y="283" width="46"  height="64" fill="#1b2019" />
                    <rect x="205" y="283" width="23"  height="64" fill="#1e2026" />

                    {/* Row 5 */}
                    <rect x="0"   y="351" width="50"  height="64" fill="#1d1f24" />
                    <rect x="3"   y="354" width="36"  height="30" fill="#20222a" rx="1" />
                    <rect x="54"  y="351" width="47"  height="64" fill="#1e2026" />
                    <rect x="57"  y="354" width="40"  height="34" fill="#21232b" rx="1" />
                    <rect x="105" y="351" width="46"  height="64" fill="#1d1f24" />
                    <rect x="108" y="354" width="38"  height="26" fill="#20222a" rx="1" />
                    <rect x="155" y="351" width="46"  height="64" fill="#1e2026" />
                    <rect x="205" y="351" width="23"  height="64" fill="#1d1f24" />

                    {/* Row 6 */}
                    <rect x="0"   y="419" width="50"  height="64" fill="#1e2026" />
                    <rect x="54"  y="419" width="47"  height="64" fill="#1d1f24" />
                    <rect x="56"  y="422" width="42"  height="32" fill="#20222a" rx="1" />
                    <rect x="105" y="419" width="46"  height="64" fill="#1e2026" />
                    <rect x="107" y="422" width="40"  height="28" fill="#21232b" rx="1" />
                    <rect x="155" y="419" width="46"  height="64" fill="#1d1f24" />
                    <rect x="205" y="419" width="23"  height="64" fill="#1e2026" />

                    {/* Row 7 (bottom) */}
                    <rect x="0"   y="487" width="50"  height="93" fill="#1d1f24" />
                    <rect x="54"  y="487" width="47"  height="93" fill="#1e2026" />
                    <rect x="105" y="487" width="46"  height="93" fill="#1d1f24" />
                    <rect x="155" y="487" width="46"  height="93" fill="#1e2026" />
                    <rect x="205" y="487" width="23"  height="93" fill="#1d1f24" />

                    {/* ── Major Streets (E-W) — 2.5px, lighter ── */}
                    <rect x="0" y="76"  width="228" height="2.5" fill="#393c44" />
                    <rect x="0" y="144" width="228" height="2.5" fill="#393c44" />
                    <rect x="0" y="212" width="228" height="2.5" fill="#393c44" />
                    <rect x="0" y="280" width="228" height="2.5" fill="#393c44" />
                    <rect x="0" y="348" width="228" height="2.5" fill="#393c44" />
                    <rect x="0" y="416" width="228" height="2.5" fill="#393c44" />
                    <rect x="0" y="484" width="228" height="2.5" fill="#393c44" />

                    {/* ── Major Avenues (N-S) — 2.5px ── */}
                    <rect x="51"  y="0" width="2.5" height="580" fill="#393c44" />
                    <rect x="102" y="0" width="2.5" height="580" fill="#393c44" />
                    <rect x="152" y="0" width="2.5" height="580" fill="#393c44" />
                    <rect x="203" y="0" width="2.5" height="580" fill="#393c44" />

                    {/* ── Minor streets (E-W, 1px) ── */}
                    <rect x="0" y="110" width="228" height="1" fill="#2c2e36" />
                    <rect x="0" y="178" width="228" height="1" fill="#2c2e36" />
                    <rect x="0" y="247" width="228" height="1" fill="#2c2e36" />
                    <rect x="0" y="315" width="228" height="1" fill="#2c2e36" />
                    <rect x="0" y="383" width="228" height="1" fill="#2c2e36" />
                    <rect x="0" y="451" width="228" height="1" fill="#2c2e36" />

                    {/* Broadway diagonal */}
                    <line x1="80" y1="0" x2="10" y2="580" stroke="#2e3038" strokeWidth="2.5" />

                    {/* ── Street labels (dark-v11 muted style) ── */}
                    <text x="5"   y="73"  fontFamily="Roboto" fontSize="5" fill="#585c6b" letterSpacing="0.6">BROADWAY</text>
                    <text x="5"   y="141" fontFamily="Roboto" fontSize="5" fill="#585c6b" letterSpacing="0.6">W 34TH ST</text>
                    <text x="5"   y="209" fontFamily="Roboto" fontSize="5" fill="#585c6b" letterSpacing="0.6">W 23RD ST</text>
                    <text x="5"   y="277" fontFamily="Roboto" fontSize="5" fill="#585c6b" letterSpacing="0.6">W 14TH ST</text>
                    <text x="5"   y="345" fontFamily="Roboto" fontSize="5" fill="#585c6b" letterSpacing="0.6">HOUSTON ST</text>
                    <text x="5"   y="413" fontFamily="Roboto" fontSize="5" fill="#585c6b" letterSpacing="0.6">CANAL ST</text>
                    <text x="54"  y="12"  fontFamily="Roboto" fontSize="5" fill="#585c6b" letterSpacing="0.4">5TH AVE</text>
                    <text x="105" y="12"  fontFamily="Roboto" fontSize="5" fill="#585c6b" letterSpacing="0.4">PARK AVE</text>
                    <text x="155" y="12"  fontFamily="Roboto" fontSize="5" fill="#585c6b" letterSpacing="0.4">3RD AVE</text>

                    {/* Mapbox attribution */}
                    <text x="5" y="576" fontFamily="Roboto" fontSize="4" fill="#383b42">© Mapbox  © OpenStreetMap</text>
                  </svg>
                </div>

                {/* ══════════════════════════════════════
                    FRAME 0 — Intro: map overview
                ══════════════════════════════════════ */}
                <div className="phone-frame-layer active" data-frame="0">

                  {/* Pins — actual marker-dot + marker-ring style */}
                  <Marker top="18%" left="22%" color="#d5ff45" />
                  <Marker top="26%" left="58%" color="#df3257" />
                  <Marker top="36%" left="38%" color="#00d29a" />
                  <Marker top="44%" left="75%" color="#d5ff45" />
                  <Marker top="52%" left="20%" color="#df3257" />
                  <Marker top="55%" left="52%" color="#d5ff45" />
                  <Marker top="63%" left="42%" color="#00d29a" />
                  <Marker top="71%" left="66%" color="#d5ff45" />

                  {/* Top nav bar (matches app top bar) */}
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0,
                    background: "rgba(17,17,20,.92)", backdropFilter: "blur(6px)",
                    borderBottom: "1px solid rgba(255,255,255,.06)",
                    padding: "10px 12px",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    zIndex: 10,
                  }}>
                    <img src="/DirtyDeedzLogo.svg" alt="Dirty Deedz" style={{ height: 16 }} />
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <div style={{ fontFamily: "'Roboto',sans-serif", fontSize: 7, color: "rgba(255,255,255,.5)", letterSpacing: ".04em" }}>Filter by:</div>
                      <div style={{ padding: "2px 8px", borderRadius: 20, border: "1px solid rgba(255,255,255,.18)", fontFamily: "'Roboto',sans-serif", fontSize: 7, color: "#fff" }}>All</div>
                    </div>
                  </div>

                  {/* Legend + view-toggle bar (matches actual .map-controls-bar) */}
                  <div style={{
                    position: "absolute", bottom: 12, left: 10, right: 10,
                    background: "rgba(17,17,20,.88)", backdropFilter: "blur(6px)",
                    borderRadius: 10, border: "1px solid rgba(255,255,255,.08)",
                    padding: "7px 10px",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    zIndex: 10,
                  }}>
                    <div style={{ display: "flex", gap: 10 }}>
                      {[
                        { label: "Available",      color: "#d5ff45" },
                        { label: "Multi Deedz",    color: "#00d29a" },
                        { label: "Coming Soon",    color: "#df3257" },
                      ].map(({ label, color }) => (
                        <div key={label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <div style={{ width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0 }} />
                          <span style={{ fontFamily: "'Roboto',sans-serif", fontSize: 6.5, color: "rgba(255,255,255,.65)", whiteSpace: "nowrap" }}>{label}</span>
                        </div>
                      ))}
                    </div>
                    {/* Card/Map toggle */}
                    <div style={{ padding: "3px 7px", borderRadius: 6, border: "1px solid rgba(255,255,255,.15)", fontFamily: "'Roboto',sans-serif", fontSize: 6.5, color: "rgba(255,255,255,.6)", display: "flex", alignItems: "center", gap: 3 }}>
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                      Cards
                    </div>
                  </div>

                </div>

                {/* ══════════════════════════════════════
                    FRAME 1 — Live Availability: full Browse Deedz layout
                ══════════════════════════════════════ */}
                <div className="phone-frame-layer" data-frame="1">

                  {/* ── Pins over base map (top 38% of screen) ── */}
                  {filterStep === 0 && <>
                    <Marker top="9%"  left="40%" color="#00d29a" pulse />
                    <Marker top="12%" left="29%" color="#00d29a" pulse />
                    <Marker top="7%"  left="18%" color="#d5ff45" pulse />
                    <Marker top="15%" left="63%" color="#df3257" pulse />
                    <Marker top="21%" left="36%" color="#00d29a" pulse />
                    <Marker top="26%" left="56%" color="#df3257" pulse />
                    <Marker top="30%" left="70%" color="#d5ff45" pulse />
                    <Marker top="28%" left="22%" color="#00d29a" pulse />
                  </>}
                  {filterStep > 0 && <>
                    <Marker top="9%"  left="40%" color="#00d29a" active pulse />
                    <Marker top="12%" left="29%" color="#00d29a" pulse />
                    <Marker top="17%" left="43%" color="#00d29a" pulse />
                    <Marker top="21%" left="36%" color="#00d29a" pulse />
                    <Marker top="25%" left="51%" color="#00d29a" pulse />
                    <Marker top="28%" left="44%" color="#00d29a" pulse />
                    <Marker top="28%" left="22%" color="#00d29a" pulse />
                  </>}

                  {/* ── Nav bar ── */}
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 38,
                    background: "rgba(17,17,20,.92)", backdropFilter: "blur(6px)",
                    borderBottom: "1px solid rgba(255,255,255,.06)",
                    padding: "0 14px",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    zIndex: 10,
                  }}>
                    <img src="/DirtyDeedzLogo.svg" alt="Dirty Deedz" style={{ height: 20 }} />
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 22, height: 15 }}>
                      {[0,1,2].map(i => (
                        <div key={i} style={{ height: 2, background: "rgba(255,255,255,.6)", borderRadius: 2 }} />
                      ))}
                    </div>
                  </div>

                  {/* ── Browse Deedz panel (bottom 62%) ── */}
                  <div style={{
                    position: "absolute", top: "38%", bottom: 0, left: 0, right: 0,
                    background: "#111114",
                    borderTop: "2px solid rgba(255,255,255,.07)",
                    display: "flex", flexDirection: "column",
                    overflow: "hidden",
                    zIndex: 10,
                  }}>

                    {/* Panel header */}
                    <div style={{
                      padding: "9px 12px 8px",
                      borderBottom: "1px solid rgba(255,255,255,.06)",
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      flexShrink: 0,
                    }}>
                      <div>
                        <div style={{ fontFamily: "'Archivo',sans-serif", fontSize: 13, fontWeight: 800, color: "#fff", lineHeight: 1 }}>Browse Deedz</div>
                        <div style={{ fontFamily: "'Roboto',sans-serif", fontSize: 6.5, color: "rgba(255,255,255,.35)", marginTop: 2 }}>
                          {filterStep === 0 ? "25" : filterStep === 1 ? "13" : "8"} results
                        </div>
                      </div>
                      <div style={{ padding: "3px 8px", borderRadius: 6, border: "1px solid rgba(255,255,255,.15)", fontFamily: "'Roboto',sans-serif", fontSize: 7, color: "rgba(255,255,255,.55)", display: "flex", alignItems: "center", gap: 3 }}>
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                        Cards
                      </div>
                    </div>

                    {/* Filter sections */}
                    <div style={{ flex: 1, padding: "9px 12px 0", display: "flex", flexDirection: "column", gap: 10, overflow: "hidden" }}>

                      {/* LOCATION */}
                      <div>
                        <div style={{ fontFamily: "'Roboto',sans-serif", fontSize: 6, textTransform: "uppercase", letterSpacing: ".1em", color: "rgba(255,255,255,.4)", marginBottom: 5, fontWeight: 700 }}>Location</div>
                        <div style={{ display: "flex", gap: 6 }}>
                          {/* State dropdown */}
                          <div style={{
                            flex: 1, height: 28, padding: "0 8px 0 10px", borderRadius: 8,
                            background: "#1a1c22",
                            border: `1.5px solid ${filterStep > 0 ? "#d5ff45" : "rgba(255,255,255,.2)"}`,
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                          }}>
                            <span style={{ fontFamily: "'Roboto',sans-serif", fontSize: 8, color: filterStep > 0 ? "#d5ff45" : "rgba(255,255,255,.8)" }}>
                              {filterStep > 0 ? "NY" : "All States"}
                            </span>
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={filterStep > 0 ? "#d5ff45" : "rgba(255,255,255,.4)"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                          </div>
                          {/* City dropdown */}
                          <div style={{
                            flex: 1, height: 28, padding: "0 8px 0 10px", borderRadius: 8,
                            background: "#1a1c22",
                            border: `1.5px solid ${filterStep > 0 ? "#d5ff45" : "rgba(255,255,255,.2)"}`,
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                          }}>
                            <span style={{ fontFamily: "'Roboto',sans-serif", fontSize: 8, color: filterStep > 0 ? "#d5ff45" : "rgba(255,255,255,.8)" }}>
                              {filterStep > 0 ? "New York" : "All Cities"}
                            </span>
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={filterStep > 0 ? "#d5ff45" : "rgba(255,255,255,.4)"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                          </div>
                        </div>
                      </div>

                      {/* STATUS */}
                      <div>
                        <div style={{ fontFamily: "'Roboto',sans-serif", fontSize: 6, textTransform: "uppercase", letterSpacing: ".1em", color: "rgba(255,255,255,.4)", marginBottom: 5, fontWeight: 700 }}>Status</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                          {([
                            { label: "View All (25)",      dot: null,      active: filterStep === 0 },
                            { label: "Available (6)",      dot: "#d5ff45", active: false },
                            { label: "Multiple Deedz (13)",dot: "#00d29a", active: filterStep > 0 },
                            { label: "Coming Soon (6)",    dot: "#df3257", active: false },
                          ] as const).map(({ label, dot, active }) => (
                            <div key={label} style={{
                              padding: "3px 8px", borderRadius: 20,
                              border: `1px solid ${active ? "#d5ff45" : "rgba(255,255,255,.18)"}`,
                              background: active ? "rgba(213,255,69,.06)" : "rgba(255,255,255,.03)",
                              display: "flex", alignItems: "center", gap: 4,
                            }}>
                              {dot && <div style={{ width: 5, height: 5, borderRadius: "50%", background: dot, flexShrink: 0 }} />}
                              <span style={{ fontFamily: "'Roboto',sans-serif", fontSize: 6.5, color: active ? "#d5ff45" : "rgba(255,255,255,.7)", whiteSpace: "nowrap" }}>{label}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* NEIGHBORHOOD */}
                      <div>
                        <div style={{ fontFamily: "'Roboto',sans-serif", fontSize: 6, textTransform: "uppercase", letterSpacing: ".1em", color: "rgba(255,255,255,.4)", marginBottom: 5, fontWeight: 700 }}>Neighborhood</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                          {([
                            { label: "Midtown",           active: filterStep > 0 },
                            { label: "SoHo",              active: filterStep > 0 },
                            { label: "Chelsea",           active: filterStep > 0 },
                            { label: "Flatiron",          active: false },
                            { label: "East Village",      active: false },
                            { label: "West Village",      active: false },
                            { label: "Lower East Side",   active: false },
                            { label: "Financial District",active: false },
                            { label: "Tribeca",           active: false },
                            { label: "Williamsburg",      active: false },
                            { label: "DUMBO",             active: false },
                            { label: "Park Slope",        active: false },
                            { label: "Bushwick",          active: false },
                            { label: "NoHo",              active: false },
                            { label: "Hell's Kitchen",    active: false },
                          ] as const).map(({ label, active }) => (
                            <div key={label} style={{
                              padding: "2.5px 7px", borderRadius: 20,
                              border: `1px solid ${active ? "#d5ff45" : "rgba(255,255,255,.18)"}`,
                              background: active ? "rgba(213,255,69,.06)" : "rgba(255,255,255,.03)",
                            }}>
                              <span style={{ fontFamily: "'Roboto',sans-serif", fontSize: 6.5, color: active ? "#d5ff45" : "rgba(255,255,255,.7)" }}>{label}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* FOOT TRAFFIC */}
                      <div>
                        <div style={{ fontFamily: "'Roboto',sans-serif", fontSize: 6, textTransform: "uppercase", letterSpacing: ".1em", color: "rgba(255,255,255,.4)", marginBottom: 5, fontWeight: 700 }}>Foot Traffic</div>
                        <div style={{ display: "flex", gap: 4 }}>
                          {([
                            { label: "High Traffic",   active: filterStep === 2 },
                            { label: "Medium Traffic", active: false },
                            { label: "Low Traffic",    active: false },
                          ] as const).map(({ label, active }) => (
                            <div key={label} style={{
                              padding: "2.5px 7px", borderRadius: 20,
                              border: `1px solid ${active ? "#d5ff45" : "rgba(255,255,255,.18)"}`,
                              background: active ? "rgba(213,255,69,.06)" : "rgba(255,255,255,.03)",
                            }}>
                              <span style={{ fontFamily: "'Roboto',sans-serif", fontSize: 6.5, color: active ? "#d5ff45" : "rgba(255,255,255,.7)" }}>{label}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Clear filters */}
                      {filterStep > 0 && (
                        <div style={{ fontFamily: "'Roboto',sans-serif", fontSize: 7, color: "rgba(255,255,255,.35)", textDecoration: "underline" }}>
                          Clear all filters
                        </div>
                      )}

                    </div>
                  </div>

                </div>

                {/* ══════════════════════════════════════
                    FRAME 2 — Lock In Your Terms: booking panel (term + design)
                ══════════════════════════════════════ */}
                <div className="phone-frame-layer" data-frame="2">

                  {/* Faded background pins */}
                  <Marker top="12%" left="20%" color="#d5ff45" faded />
                  <Marker top="22%" left="58%" color="#00d29a" faded />
                  {/* Selected / active pin */}
                  <Marker top="28%" left="40%" color="#d5ff45" active />

                  {/* Booking panel — matches actual .booking-panel dark bg */}
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0,
                    height: "72%",
                    background: "#111114",
                    borderRadius: "14px 14px 0 0",
                    borderTop: "1px solid rgba(255,255,255,.08)",
                    display: "flex", flexDirection: "column",
                    overflow: "hidden",
                    zIndex: 10,
                  }}>
                    {/* Sidewalk image strip (matches .booking-carousel) */}
                    <div style={{ height: 48, background: "#1a1c22", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative" }}>
                      <div style={{ fontFamily: "'Roboto',sans-serif", fontSize: 6.5, color: "rgba(255,255,255,.2)" }}>Sidewalk Preview</div>
                      {/* Carousel dots */}
                      <div style={{ position: "absolute", bottom: 6, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 4 }}>
                        {[0,1,2].map(i => <div key={i} style={{ width: i===0?14:5, height: 5, borderRadius: 10, background: i===0?"#d5ff45":"rgba(255,255,255,.25)" }} />)}
                      </div>
                    </div>

                    {/* Scrollable inner content */}
                    <div style={{ flex: 1, padding: "10px 14px", overflow: "hidden", display: "flex", flexDirection: "column", gap: 10 }}>

                      {/* Pin summary — matches .booking-pin-summary */}
                      <div>
                        <div style={{ fontFamily: "'Roboto',sans-serif", fontSize: 7.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: "#d5ff45", marginBottom: 2 }}>Available</div>
                        <div style={{ fontFamily: "'Archivo',sans-serif", fontSize: 15, fontWeight: 800, color: "#fff", lineHeight: 1.1, marginBottom: 2 }}>Tribeca North</div>
                        <div style={{ fontFamily: "'Roboto',sans-serif", fontSize: 8, color: "rgba(255,255,255,.45)", marginBottom: 4 }}>375 Greenwich St</div>
                        <div style={{ display: "flex", gap: 10 }}>
                          {["Tribeca", "Medium Traffic", "18 sq ft"].map(s => (
                            <span key={s} style={{ fontFamily: "'Roboto',sans-serif", fontSize: 7, color: "rgba(255,255,255,.35)" }}>{s}</span>
                          ))}
                        </div>
                      </div>

                      {/* SELECT LEASE TERM — matches .booking-terms */}
                      <div>
                        <div style={{ fontFamily: "'Roboto',sans-serif", fontSize: 7, textTransform: "uppercase", letterSpacing: ".08em", color: "rgba(255,255,255,.4)", marginBottom: 6, fontWeight: 600 }}>Select Lease Term</div>
                        <div style={{ display: "flex", gap: 5 }}>
                          {/* THE STREET CRED */}
                          <div style={{ flex: 1, padding: "10px 4px 8px", borderRadius: 8, border: "1px solid rgba(255,255,255,.15)", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, cursor: "pointer" }}>
                            <span style={{ fontFamily: "'Roboto',sans-serif", fontSize: 5.5, textTransform: "uppercase", letterSpacing: ".05em", color: "rgba(255,255,255,.45)", textAlign: "center" }}>THE STREET CRED</span>
                            <span style={{ fontFamily: "'Archivo',sans-serif", fontSize: 13, fontWeight: 800, color: "#fff" }}>2 Mo</span>
                          </div>
                          {/* THE HUSTLE — active, matches .term-pill.active */}
                          <div style={{ flex: 1, padding: "10px 4px 8px", borderRadius: 8, border: "1px solid #d5ff45", background: "rgba(213,255,69,.1)", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                            <span style={{ fontFamily: "'Roboto',sans-serif", fontSize: 5.5, textTransform: "uppercase", letterSpacing: ".05em", color: "#d5ff45", opacity: .8, textAlign: "center" }}>THE HUSTLE</span>
                            <span style={{ fontFamily: "'Archivo',sans-serif", fontSize: 13, fontWeight: 800, color: "#d5ff45" }}>4 Mo</span>
                            <span style={{ fontFamily: "'Roboto',sans-serif", fontSize: 6, background: "rgba(213,255,69,.15)", color: "#d5ff45", padding: "1px 5px", borderRadius: 10 }}>save $200</span>
                          </div>
                          {/* THE TAKEOVER */}
                          <div style={{ flex: 1, padding: "10px 4px 8px", borderRadius: 8, border: "1px solid rgba(255,255,255,.15)", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                            <span style={{ fontFamily: "'Roboto',sans-serif", fontSize: 5.5, textTransform: "uppercase", letterSpacing: ".05em", color: "rgba(255,255,255,.45)", textAlign: "center" }}>THE TAKEOVER</span>
                            <span style={{ fontFamily: "'Archivo',sans-serif", fontSize: 13, fontWeight: 800, color: "#fff" }}>6 Mo</span>
                          </div>
                        </div>
                      </div>

                      {/* DESIGN & CREATIVE — matches .booking-design-options */}
                      <div>
                        <div style={{ fontFamily: "'Roboto',sans-serif", fontSize: 7, textTransform: "uppercase", letterSpacing: ".08em", color: "rgba(255,255,255,.4)", marginBottom: 6, fontWeight: 600 }}>Design &amp; Creative</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          {/* I'll design it — active, matches .design-radio.active */}
                          <div style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "8px 10px", borderRadius: 8, border: "1px solid #d5ff45", background: "rgba(213,255,69,.04)" }}>
                            <div style={{ width: 12, height: 12, borderRadius: "50%", border: "2px solid #d5ff45", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1 }}>
                              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#d5ff45" }} />
                            </div>
                            <div>
                              <div style={{ fontFamily: "'Roboto',sans-serif", fontSize: 8.5, fontWeight: 600, color: "#fff" }}>I&apos;ll design it using your template</div>
                              <div style={{ fontFamily: "'Roboto',sans-serif", fontSize: 7, color: "rgba(255,255,255,.38)", marginTop: 1 }}>Download our stencil, add your design, upload</div>
                            </div>
                          </div>
                          {/* Design for me */}
                          <div style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(255,255,255,.12)" }}>
                            <div style={{ width: 12, height: 12, borderRadius: "50%", border: "2px solid rgba(255,255,255,.22)", flexShrink: 0, marginTop: 1 }} />
                            <div>
                              <div style={{ fontFamily: "'Roboto',sans-serif", fontSize: 8.5, fontWeight: 600, color: "rgba(255,255,255,.55)" }}>
                                Design it for me{" "}
                                <span style={{ background: "rgba(213,255,69,.14)", color: "#d5ff45", padding: "1px 5px", borderRadius: 10, fontSize: 7 }}>+$200</span>
                              </div>
                              <div style={{ fontFamily: "'Roboto',sans-serif", fontSize: 7, color: "rgba(255,255,255,.28)", marginTop: 1 }}>Our team creates your stencil from scratch</div>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                {/* ══════════════════════════════════════
                    FRAME 3 — Your Ad Brief: ad copy fields
                ══════════════════════════════════════ */}
                <div className="phone-frame-layer" data-frame="3">

                  {/* Ghost pin at top */}
                  <Marker top="10%" left="35%" color="#d5ff45" faded />

                  {/* Booking panel — taller, mostly covers screen */}
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0,
                    height: "80%",
                    background: "#111114",
                    borderRadius: "14px 14px 0 0",
                    borderTop: "1px solid rgba(255,255,255,.08)",
                    zIndex: 10,
                    overflow: "hidden",
                  }}>
                    {/* Header bar */}
                    <div style={{ padding: "10px 14px 8px", borderBottom: "1px solid rgba(255,255,255,.06)", flexShrink: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ fontFamily: "'Roboto',sans-serif", fontSize: 7, color: "#d5ff45", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 700 }}>Tribeca North</div>
                          <div style={{ fontFamily: "'Archivo',sans-serif", fontSize: 12, fontWeight: 800, color: "#fff" }}>Ad Copy</div>
                        </div>
                        <div style={{ fontFamily: "'Roboto',sans-serif", fontSize: 7, color: "rgba(255,255,255,.3)", textAlign: "right" }}>THE HUSTLE<br />4 Mo</div>
                      </div>
                    </div>

                    <div style={{ padding: "10px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
                      {/* AD COPY section label */}
                      <div style={{ fontFamily: "'Roboto',sans-serif", fontSize: 6.5, textTransform: "uppercase", letterSpacing: ".08em", color: "rgba(255,255,255,.4)", fontWeight: 600 }}>Ad Copy</div>

                      {/* Headline — matches .ad-copy-field input */}
                      <div>
                        <div style={{ fontFamily: "'Roboto',sans-serif", fontSize: 6.5, textTransform: "uppercase", letterSpacing: ".06em", color: "rgba(255,255,255,.5)", marginBottom: 3 }}>
                          Headline <span style={{ color: "#d5ff45" }}>★</span>
                        </div>
                        <div style={{ padding: "7px 9px", background: "rgba(255,255,255,.07)", border: "1px solid rgba(213,255,69,.55)", borderRadius: 6, fontFamily: "'Roboto',sans-serif", fontSize: 9, color: "#fff" }}>Watch Your Step!</div>
                      </div>

                      {/* Subheadline */}
                      <div>
                        <div style={{ fontFamily: "'Roboto',sans-serif", fontSize: 6.5, textTransform: "uppercase", letterSpacing: ".06em", color: "rgba(255,255,255,.5)", marginBottom: 3 }}>Subheadline</div>
                        <div style={{ padding: "7px 9px", background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 6, fontFamily: "'Roboto',sans-serif", fontSize: 9, color: "rgba(255,255,255,.65)" }}>Lay the Groundwork...</div>
                      </div>

                      {/* Call to Action */}
                      <div>
                        <div style={{ fontFamily: "'Roboto',sans-serif", fontSize: 6.5, textTransform: "uppercase", letterSpacing: ".06em", color: "rgba(255,255,255,.5)", marginBottom: 3 }}>
                          Call to Action <span style={{ color: "#d5ff45" }}>★</span>
                        </div>
                        <div style={{ padding: "7px 9px", background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 6, fontFamily: "'Roboto',sans-serif", fontSize: 9, color: "rgba(255,255,255,.65)" }}>DirtyDeedz.com</div>
                      </div>

                      {/* Upload — matches actual upload area */}
                      <div>
                        <div style={{ fontFamily: "'Roboto',sans-serif", fontSize: 6.5, textTransform: "uppercase", letterSpacing: ".06em", color: "rgba(255,255,255,.5)", marginBottom: 3 }}>
                          Upload Template <span style={{ color: "#d5ff45" }}>★</span>
                        </div>
                        <div style={{ padding: "8px 10px", background: "rgba(255,255,255,.04)", border: "1px dashed rgba(255,255,255,.18)", borderRadius: 6, display: "flex", alignItems: "center", gap: 7 }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 11, height: 11, flexShrink: 0 }}>
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                          </svg>
                          <span style={{ fontFamily: "'Roboto',sans-serif", fontSize: 7.5, color: "rgba(255,255,255,.3)" }}>Completed template · PNG, SVG, AI, PDF</span>
                        </div>
                      </div>

                      {/* Save & Review — matches .booking-submit (yellow bg, dark text) */}
                      <div style={{ marginTop: 2, padding: "10px 0", background: "#d5ff45", color: "#111", fontFamily: "'Archivo',sans-serif", fontSize: 10, fontWeight: 800, textAlign: "center", borderRadius: 8, letterSpacing: ".04em", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                        Save &amp; Review <BrandArrow size={9} fill="#df3257" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ══════════════════════════════════════
                    FRAME 4 — Review & Checkout: .booking-panel--multi
                ══════════════════════════════════════ */}
                <div className="phone-frame-layer" data-frame="4">

                  {/* Full yellow background — matches .booking-panel--multi */}
                  <div style={{ position: "absolute", inset: 0, background: "#d5ff45", zIndex: 1 }} />

                  <div style={{ position: "absolute", inset: 0, zIndex: 2, padding: "36px 14px 12px", display: "flex", flexDirection: "column", gap: 7 }}>

                    {/* Status + back row */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontFamily: "'Roboto',sans-serif", fontSize: 7, color: "#111", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 700, opacity: .5 }}>CHECKOUT</div>
                      <div style={{ fontFamily: "'Roboto',sans-serif", fontSize: 7, color: "#111", opacity: .4 }}>← Back</div>
                    </div>

                    {/* Heading — matches .booking-pin-summary h3 */}
                    <div style={{ fontFamily: "'Archivo',sans-serif", fontSize: 16, fontWeight: 800, color: "#111", lineHeight: 1 }}>Your Saved Deedz (1)</div>

                    {/* Punchlist card — matches .checkout-punchlist-card on dark bg */}
                    <div style={{ background: "#111", borderRadius: 10, padding: "11px 13px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                        <div>
                          <div style={{ fontFamily: "'Archivo',sans-serif", fontSize: 11, fontWeight: 700, color: "#fff" }}>St. Marks Place</div>
                          <div style={{ fontFamily: "'Roboto',sans-serif", fontSize: 7.5, color: "rgba(255,255,255,.4)", marginTop: 2 }}>27 St Marks Pl · Parcel 1 of 3</div>
                        </div>
                        <div style={{ fontFamily: "'Archivo',sans-serif", fontSize: 13, fontWeight: 800, color: "#d5ff45" }}>$1,400</div>
                      </div>
                      {/* Rows — matches .checkout-punchlist-row */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {[
                          { label: "Lease",    value: "THE HUSTLE · 4 Mo · $350/mo" },
                          { label: "Design",   value: "Client template" },
                          { label: "Headline", value: "Watch Your Step!" },
                          { label: "CTA",      value: "DirtyDeedz.com" },
                        ].map(({ label, value }) => (
                          <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: 6 }}>
                            <span style={{ fontFamily: "'Roboto',sans-serif", fontSize: 7, color: "rgba(255,255,255,.32)", textTransform: "uppercase", letterSpacing: ".06em", flexShrink: 0 }}>{label}</span>
                            <span style={{ fontFamily: "'Roboto',sans-serif", fontSize: 7.5, color: "rgba(255,255,255,.7)", textAlign: "right" }}>{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Grand total — matches .booking-pricing .price-line.total */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(0,0,0,.18)", borderBottom: "1px solid rgba(0,0,0,.18)", padding: "7px 0" }}>
                      <div style={{ fontFamily: "'Roboto',sans-serif", fontSize: 8.5, fontWeight: 700, color: "#111", textTransform: "uppercase", letterSpacing: ".05em" }}>Grand Total (1 Deedz)</div>
                      <div style={{ fontFamily: "'Archivo',sans-serif", fontSize: 13, fontWeight: 800, color: "#111" }}>$1,400</div>
                    </div>

                    {/* YOUR DETAILS label */}
                    <div style={{ fontFamily: "'Roboto',sans-serif", fontSize: 6.5, color: "#111", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".08em", opacity: .45 }}>Your Details</div>

                    {/* Form inputs — matches .booking-panel--multi .booking-form input */}
                    {["Full Name", "Email", "Company (optional)", "Phone"].map((label) => (
                      <div key={label} style={{ padding: "7px 10px", background: "rgba(0,0,0,.07)", border: "1px solid rgba(0,0,0,.14)", borderRadius: 7, fontFamily: "'Roboto',sans-serif", fontSize: 8.5, color: "rgba(0,0,0,.35)" }}>{label}</div>
                    ))}

                    {/* Checkout CTA — matches .booking-panel--multi .booking-submit */}
                    <div style={{ marginTop: "auto", padding: "11px 0", background: "#111", color: "#d5ff45", fontFamily: "'Archivo',sans-serif", fontSize: 10, fontWeight: 800, textAlign: "center", borderRadius: 8, letterSpacing: ".04em", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
                      Checkout All Deedz <BrandArrow size={9} fill="#d5ff45" />
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </div>
        </div>

        {/* ── Right: Scrolling callouts ── */}
        <div className="map-scroll-callouts">

          {/* Intro */}
          <div className="map-callout" data-callout="0">
            <div className="map-callout-content">
              <span className="section-label">Find Your Deed</span>
              <h2>Lease a Sidewalk.<br />Anywhere.</h2>
              <p>Browse available sidewalk and wall Deedz across the city. Pick your location, choose your duration, and lock in your ad space.</p>
              <div className="map-callout-num">Scroll to explore {"\u2193"}</div>
            </div>
          </div>

          {/* 01 / 04 — Live Availability */}
          <div className="map-callout" data-callout="1">
            <div className="map-callout-content">
              <div className="map-callout-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#d5ff45" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <h3>Live Availability</h3>
              <p>Real-time sidewalk inventory updated daily. See which parcels are open, which are multiple parcels, and filter by neighborhood and foot traffic.</p>
              <a href="/map" className="map-callout-map-link">
                View Deedz Map <svg viewBox="0 0 205.82 196.86" width="12" height="12" fill="#DF3257" style={{ transform: "rotate(-90deg)" }}><path d="M123,179.88l78.22-75.9c6-5.82,6.15-15.41.32-21.41h0c-5.82-6-15.41-6.15-21.41-.32l-62.86,60.99,1.93-127.87C119.32,7.01,112.65.13,104.28,0h0c-8.36-.13-15.24,6.55-15.37,14.91l-1.93,127.85-60.98-62.84c-5.82-6-15.41-6.15-21.41-.32h0c-6,5.82-6.15,15.41-.32,21.41l75.9,78.22,14.18,14.62c3.82,3.93,10.1,4.03,14.03.21l14.62-14.18Z" /></svg>
              </a>
              <div className="map-callout-num">01 / 04</div>
            </div>
          </div>

          {/* 02 / 04 — Lock In Your Terms */}
          <div className="map-callout" data-callout="2">
            <div className="map-callout-content">
              <div className="map-callout-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#d5ff45" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              </div>
              <h3>Lock In Your Terms</h3>
              <p>Choose a 2, 4, or 6 month lease{"\u2014"}longer runs get better rates. Then decide: bring your own design or let Dirty Deedz Studios handle it for you.</p>
              <a href="/map" className="map-callout-map-link">
                View Deedz Map <svg viewBox="0 0 205.82 196.86" width="12" height="12" fill="#DF3257" style={{ transform: "rotate(-90deg)" }}><path d="M123,179.88l78.22-75.9c6-5.82,6.15-15.41.32-21.41h0c-5.82-6-15.41-6.15-21.41-.32l-62.86,60.99,1.93-127.87C119.32,7.01,112.65.13,104.28,0h0c-8.36-.13-15.24,6.55-15.37,14.91l-1.93,127.85-60.98-62.84c-5.82-6-15.41-6.15-21.41-.32h0c-6,5.82-6.15,15.41-.32,21.41l75.9,78.22,14.18,14.62c3.82,3.93,10.1,4.03,14.03.21l14.62-14.18Z" /></svg>
              </a>
              <div className="map-callout-num">02 / 04</div>
            </div>
          </div>

          {/* 03 / 04 — Your Ad Brief */}
          <div className="map-callout" data-callout="3">
            <div className="map-callout-content">
              <div className="map-callout-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#d5ff45" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </div>
              <h3>Your Ad Brief</h3>
              <p>Type your headline, subheadline, and call to action. Upload your finished template or let our studio build it. Hit Save &amp; Review when you{"\u2019"}re ready.</p>
              <a href="/map" className="map-callout-map-link">
                View Deedz Map <svg viewBox="0 0 205.82 196.86" width="12" height="12" fill="#DF3257" style={{ transform: "rotate(-90deg)" }}><path d="M123,179.88l78.22-75.9c6-5.82,6.15-15.41.32-21.41h0c-5.82-6-15.41-6.15-21.41-.32l-62.86,60.99,1.93-127.87C119.32,7.01,112.65.13,104.28,0h0c-8.36-.13-15.24,6.55-15.37,14.91l-1.93,127.85-60.98-62.84c-5.82-6-15.41-6.15-21.41-.32h0c-6,5.82-6.15,15.41-.32,21.41l75.9,78.22,14.18,14.62c3.82,3.93,10.1,4.03,14.03.21l14.62-14.18Z" /></svg>
              </a>
              <div className="map-callout-num">03 / 04</div>
            </div>
          </div>

          {/* 04 / 04 — Review & Checkout */}
          <div className="map-callout" data-callout="4">
            <div className="map-callout-content">
              <div className="map-callout-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#d5ff45" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /><line x1="12" y1="22" x2="12" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" />
                </svg>
              </div>
              <h3>Review &amp; Checkout</h3>
              <p>Review your saved Deedz, confirm the grand total, and enter your details. One tap and your sidewalk ad campaign is live{"\u2014"}paid securely via Stripe.</p>
              <a href="/map" className="map-callout-map-link">
                View Deedz Map <svg viewBox="0 0 205.82 196.86" width="12" height="12" fill="#DF3257" style={{ transform: "rotate(-90deg)" }}><path d="M123,179.88l78.22-75.9c6-5.82,6.15-15.41.32-21.41h0c-5.82-6-15.41-6.15-21.41-.32l-62.86,60.99,1.93-127.87C119.32,7.01,112.65.13,104.28,0h0c-8.36-.13-15.24,6.55-15.37,14.91l-1.93,127.85-60.98-62.84c-5.82-6-15.41-6.15-21.41-.32h0c-6,5.82-6.15,15.41-.32,21.41l75.9,78.22,14.18,14.62c3.82,3.93,10.1,4.03,14.03.21l14.62-14.18Z" /></svg>
              </a>
              <div className="map-callout-num">04 / 04</div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
