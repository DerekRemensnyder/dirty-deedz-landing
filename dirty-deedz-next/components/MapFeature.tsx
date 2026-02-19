"use client";

import { useEffect, useRef } from "react";

export default function MapFeature() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const callouts = section.querySelectorAll<HTMLElement>(".map-callout");
    const frameLayers = section.querySelectorAll<HTMLElement>(".phone-frame-layer");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const callout = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            callout.classList.add("in-view");
            const idx = callout.getAttribute("data-callout");
            frameLayers.forEach((layer) => {
              layer.classList.toggle(
                "active",
                layer.getAttribute("data-frame") === idx
              );
            });
          } else {
            callout.classList.remove("in-view");
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px" }
    );

    callouts.forEach((c) => observer.observe(c));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="map-scroll map-scroll--reversed"
      id="map-feature"
      ref={sectionRef}
    >
      <div className="map-scroll-inner">
        {/* Left (visually): sticky phone with frame layers */}
        <div className="map-scroll-phone">
          <div className="map-scroll-phone-inner">
            <div className="phone-glow"></div>
            <div className="phone-frame">
              <div className="phone-notch"></div>
              <div className="phone-screen">
                {/* Base map (always visible) */}
                <div className="phone-screen-map">
                  <div className="map-grid"></div>
                  <div className="map-roads">
                    <div className="map-road h" style={{top:'25%',left:'10%',width:'80%'}}></div>
                    <div className="map-road h" style={{top:'50%',left:'5%',width:'90%'}}></div>
                    <div className="map-road h" style={{top:'72%',left:'15%',width:'70%'}}></div>
                    <div className="map-road v" style={{left:'30%',top:'10%',height:'80%'}}></div>
                    <div className="map-road v" style={{left:'55%',top:'5%',height:'85%'}}></div>
                    <div className="map-road v" style={{left:'78%',top:'15%',height:'70%'}}></div>
                    <div className="map-road h" style={{top:'38%',left:'20%',width:'50%',opacity:0.5}}></div>
                    <div className="map-road v" style={{left:'42%',top:'20%',height:'55%',opacity:0.5}}></div>
                  </div>
                </div>

                {/* Frame 0: Overview — nav, legend, mixed pins, search */}
                <div className="phone-frame-layer active" data-frame="0">
                  <div className="phone-nav">
                    <div className="phone-nav-logo">
                      <img src="/DirtyDeedzLogo.svg" alt="Dirty Deedz" />
                    </div>
                    <div className="phone-nav-hamburger">
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                  <div className="map-pin" style={{top:'18%',left:'24%'}}>
                    <div className="map-pin-dot" style={{background:'#d5ff45',boxShadow:'0 0 12px rgba(213,255,69,.5)'}}></div>
                    <div className="map-pin-ring"></div>
                  </div>
                  <div className="map-pin" style={{top:'26%',left:'62%'}}>
                    <div className="map-pin-dot" style={{background:'#df3257',boxShadow:'0 0 12px rgba(223,50,87,.4)'}}></div>
                    <div className="map-pin-ring" style={{borderColor:'#df3257'}}></div>
                  </div>
                  <div className="map-pin" style={{top:'35%',left:'42%'}}>
                    <div className="map-pin-dot" style={{background:'#00d29a',boxShadow:'0 0 12px rgba(0,210,154,.4)'}}></div>
                    <div className="map-pin-ring" style={{borderColor:'#00d29a'}}></div>
                  </div>
                  <div className="map-pin" style={{top:'44%',left:'72%'}}>
                    <div className="map-pin-dot" style={{background:'#d5ff45',boxShadow:'0 0 12px rgba(213,255,69,.5)'}}></div>
                    <div className="map-pin-ring"></div>
                  </div>
                  <div className="map-pin" style={{top:'50%',left:'28%'}}>
                    <div className="map-pin-dot" style={{background:'#df3257',boxShadow:'0 0 12px rgba(223,50,87,.4)'}}></div>
                    <div className="map-pin-ring" style={{borderColor:'#df3257'}}></div>
                  </div>
                  <div className="map-pin" style={{top:'58%',left:'55%'}}>
                    <div className="map-pin-dot" style={{background:'#d5ff45',boxShadow:'0 0 12px rgba(213,255,69,.5)'}}></div>
                    <div className="map-pin-ring"></div>
                  </div>
                  <div className="map-pin" style={{top:'66%',left:'38%'}}>
                    <div className="map-pin-dot" style={{background:'#00d29a',boxShadow:'0 0 12px rgba(0,210,154,.4)'}}></div>
                    <div className="map-pin-ring" style={{borderColor:'#00d29a'}}></div>
                  </div>
                  <div className="map-pin" style={{top:'72%',left:'68%'}}>
                    <div className="map-pin-dot" style={{background:'#d5ff45',boxShadow:'0 0 12px rgba(213,255,69,.5)'}}></div>
                    <div className="map-pin-ring"></div>
                  </div>
                  <div className="phone-search-row">
                    <div className="map-legend">
                      <div className="map-legend-item"><div className="map-legend-dot avail"></div>Available</div>
                      <div className="map-legend-item"><div className="map-legend-dot coming"></div>Coming Soon</div>
                      <div className="map-legend-item"><div className="map-legend-dot placed"></div>Ad Placed</div>
                    </div>
                    <div className="phone-filter"><strong>Filter by:</strong> All</div>
                    <div className="phone-search">
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                      <span>New York City</span>
                    </div>
                  </div>
                </div>

                {/* Frame 1: Live Availability — filter open, foot traffic selected */}
                <div className="phone-frame-layer" data-frame="1">
                  {/* Pins with traffic level bar icons */}
                  <div className="map-pin" style={{top:'22%',left:'28%'}}>
                    <div className="map-pin-dot" style={{background:'#d5ff45'}}></div>
                    <div className="map-pin-ring"></div>
                    <div className="pin-traffic-level">
                      <div className="bar lit" style={{height:'4px'}}></div>
                      <div className="bar" style={{height:'7px'}}></div>
                      <div className="bar" style={{height:'10px'}}></div>
                      <span className="level-label low">Low</span>
                    </div>
                  </div>
                  <div className="map-pin" style={{top:'35%',left:'52%'}}>
                    <div className="map-pin-dot" style={{background:'#00d29a'}}></div>
                    <div className="map-pin-ring" style={{borderColor:'#00d29a'}}></div>
                    <div className="pin-traffic-level">
                      <div className="bar lit-med" style={{height:'4px'}}></div>
                      <div className="bar lit-med" style={{height:'7px'}}></div>
                      <div className="bar" style={{height:'10px'}}></div>
                      <span className="level-label med">Med</span>
                    </div>
                  </div>
                  <div className="map-pin" style={{top:'48%',left:'32%'}}>
                    <div className="map-pin-dot" style={{background:'#df3257'}}></div>
                    <div className="map-pin-ring" style={{borderColor:'#df3257'}}></div>
                    <div className="pin-traffic-level">
                      <div className="bar lit-high" style={{height:'4px'}}></div>
                      <div className="bar lit-high" style={{height:'7px'}}></div>
                      <div className="bar lit-high" style={{height:'10px'}}></div>
                      <span className="level-label high">High</span>
                    </div>
                  </div>
                  <div className="map-pin" style={{top:'60%',left:'72%'}}>
                    <div className="map-pin-dot" style={{background:'#d5ff45'}}></div>
                    <div className="map-pin-ring"></div>
                    <div className="pin-traffic-level">
                      <div className="bar lit" style={{height:'4px'}}></div>
                      <div className="bar" style={{height:'7px'}}></div>
                      <div className="bar" style={{height:'10px'}}></div>
                      <span className="level-label low">Low</span>
                    </div>
                  </div>
                  <div className="map-pin" style={{top:'70%',left:'45%'}}>
                    <div className="map-pin-dot" style={{background:'#df3257'}}></div>
                    <div className="map-pin-ring" style={{borderColor:'#df3257'}}></div>
                    <div className="pin-traffic-level">
                      <div className="bar lit-high" style={{height:'4px'}}></div>
                      <div className="bar lit-high" style={{height:'7px'}}></div>
                      <div className="bar lit-high" style={{height:'10px'}}></div>
                      <span className="level-label high">High</span>
                    </div>
                  </div>
                  {/* Filter dropdown open */}
                  <div className="phone-filter-dropdown">
                    <div className="phone-filter-option">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      Neighborhood
                    </div>
                    <div className="phone-filter-option selected">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#d5ff45" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="14" width="4" height="7" rx="1" />
                        <rect x="10" y="9" width="4" height="12" rx="1" />
                        <rect x="17" y="4" width="4" height="17" rx="1" />
                      </svg>
                      Foot Traffic
                    </div>
                    <div className="phone-filter-option">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="1" x2="12" y2="23" />
                        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                      </svg>
                      Price Range
                    </div>
                  </div>
                  {/* Search bar + filter showing selected */}
                  <div className="phone-search-row">
                    <div className="phone-filter"><strong>Filter by:</strong> Foot Traffic</div>
                    <div className="phone-search">
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                      <span>New York City</span>
                    </div>
                  </div>
                </div>

                {/* Frame 2: Foot Traffic */}
                <div className="phone-frame-layer" data-frame="2">
                  <div className="heat-zone" style={{top:'14%',left:'18%',width:'80px',height:'80px'}}></div>
                  <div className="heat-zone" style={{top:'42%',left:'22%',width:'60px',height:'60px'}}></div>
                  <div className="heat-zone" style={{top:'54%',left:'62%',width:'70px',height:'70px'}}></div>
                  <div className="map-pin" style={{top:'22%',left:'28%'}}>
                    <div className="map-pin-dot"></div>
                    <div className="map-pin-ring"></div>
                    <span className="pin-traffic">1.2K/day</span>
                  </div>
                  <div className="map-pin" style={{top:'35%',left:'52%'}}>
                    <div className="map-pin-dot"></div>
                    <div className="map-pin-ring"></div>
                    <span className="pin-traffic">890/day</span>
                  </div>
                  <div className="map-pin" style={{top:'48%',left:'32%'}}>
                    <div className="map-pin-dot"></div>
                    <div className="map-pin-ring"></div>
                    <span className="pin-traffic">2.4K/day</span>
                  </div>
                  <div className="map-pin" style={{top:'60%',left:'72%'}}>
                    <div className="map-pin-dot"></div>
                    <div className="map-pin-ring"></div>
                    <span className="pin-traffic">1.8K/day</span>
                  </div>
                  <div className="map-pin" style={{top:'70%',left:'45%'}}>
                    <div className="map-pin-dot"></div>
                    <div className="map-pin-ring"></div>
                    <span className="pin-traffic">3.1K/day</span>
                  </div>
                  <div className="phone-ui-bar"><span>2.4K Daily Impressions Avg</span></div>
                </div>

                {/* Frame 3: Instant Booking */}
                <div className="phone-frame-layer" data-frame="3">
                  <div className="map-pin" style={{top:'22%',left:'28%'}}>
                    <div className="map-pin-dot" style={{opacity:0.3}}></div>
                  </div>
                  <div className="map-pin" style={{top:'35%',left:'52%'}}>
                    <div className="map-pin-dot" style={{opacity:0.3}}></div>
                  </div>
                  <div className="map-pin highlight" style={{top:'48%',left:'32%'}}>
                    <div className="map-pin-dot" style={{background:'#00d29a',boxShadow:'0 0 24px rgba(0,210,154,.7)',transform:'scale(1.6)'}}></div>
                    <div className="map-pin-ring" style={{borderColor:'#00d29a'}}></div>
                  </div>
                  <div className="map-pin" style={{top:'60%',left:'72%'}}>
                    <div className="map-pin-dot" style={{opacity:0.3}}></div>
                  </div>
                  <div className="map-pin" style={{top:'70%',left:'45%'}}>
                    <div className="map-pin-dot" style={{opacity:0.3}}></div>
                  </div>
                  <div className="phone-booking-card">
                    <h5>3rd & Main St</h5>
                    <p>High-traffic sidewalk {"\u2022"} 2.4K daily impressions {"\u2022"} Available now</p>
                    <div className="phone-booking-btn">Book This Deed {"\u2192"}</div>
                  </div>
                  <div className="phone-ui-bar"><span>Book This Deed</span></div>
                </div>

                {/* Frame 4: Lease Terms */}
                <div className="phone-frame-layer" data-frame="4">
                  <div className="map-pin highlight" style={{top:'48%',left:'32%'}}>
                    <div className="map-pin-dot" style={{background:'#00d29a',boxShadow:'0 0 24px rgba(0,210,154,.7)',transform:'scale(1.6)'}}></div>
                    <div className="map-pin-ring" style={{borderColor:'#00d29a'}}></div>
                  </div>
                  <div className="phone-term-picker">
                    <div className="phone-term-pill">
                      <strong>2 Mo</strong>
                      <span>$399</span>
                    </div>
                    <div className="phone-term-pill selected">
                      <strong>4 Mo</strong>
                      <span>$349</span>
                    </div>
                    <div className="phone-term-pill">
                      <strong>6 Mo</strong>
                      <span>$299</span>
                    </div>
                  </div>
                  <div className="phone-ui-bar"><span style={{background:'#00d29a'}}>Lock In Your Deed</span></div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Right (visually): scrolling callouts */}
        <div className="map-scroll-callouts">

          <div className="map-callout" data-callout="0">
            <div className="map-callout-content">
              <span className="section-label">Find Your Deed</span>
              <h2>Lease a Sidewalk.<br />Anywhere.</h2>
              <p>Browse available sidewalk and wall deedz across the city. Pick your location, choose your duration, and lock in your ad space.</p>
              <div className="map-callout-num">Scroll to explore {"\u2193"}</div>
            </div>
          </div>

          <div className="map-callout" data-callout="1">
            <div className="map-callout-content">
              <div className="map-callout-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#d5ff45" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <h3>Live Availability</h3>
              <p>Real-time sidewalk inventory updated daily. See which parcels are open, which are booked, and filter by neighborhood, foot traffic, or price range.</p>
              <a href="/map" className="map-callout-map-link">
                View Deedz Map <svg viewBox="0 0 205.82 196.86" width="12" height="12" fill="#DF3257" style={{transform:"rotate(-90deg)"}}><path d="M123,179.88l78.22-75.9c6-5.82,6.15-15.41.32-21.41h0c-5.82-6-15.41-6.15-21.41-.32l-62.86,60.99,1.93-127.87C119.32,7.01,112.65.13,104.28,0h0c-8.36-.13-15.24,6.55-15.37,14.91l-1.93,127.85-60.98-62.84c-5.82-6-15.41-6.15-21.41-.32h0c-6,5.82-6.15,15.41-.32,21.41l75.9,78.22,14.18,14.62c3.82,3.93,10.1,4.03,14.03.21l14.62-14.18Z"/></svg>
              </a>
              <div className="map-callout-num">01 / 04</div>
            </div>
          </div>

          <div className="map-callout" data-callout="2">
            <div className="map-callout-content">
              <div className="map-callout-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#d5ff45" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <h3>Foot Traffic Data</h3>
              <p>Every Deed comes with impression estimates based on real pedestrian data. Know exactly how many eyes will see your ad before you commit.</p>
              <a href="/map" className="map-callout-map-link">
                View Deedz Map <svg viewBox="0 0 205.82 196.86" width="12" height="12" fill="#DF3257" style={{transform:"rotate(-90deg)"}}><path d="M123,179.88l78.22-75.9c6-5.82,6.15-15.41.32-21.41h0c-5.82-6-15.41-6.15-21.41-.32l-62.86,60.99,1.93-127.87C119.32,7.01,112.65.13,104.28,0h0c-8.36-.13-15.24,6.55-15.37,14.91l-1.93,127.85-60.98-62.84c-5.82-6-15.41-6.15-21.41-.32h0c-6,5.82-6.15,15.41-.32,21.41l75.9,78.22,14.18,14.62c3.82,3.93,10.1,4.03,14.03.21l14.62-14.18Z"/></svg>
              </a>
              <div className="map-callout-num">02 / 04</div>
            </div>
          </div>

          <div className="map-callout" data-callout="3">
            <div className="map-callout-content">
              <div className="map-callout-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#d5ff45" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
              </div>
              <h3>Instant Booking</h3>
              <p>Reserve and pay in minutes. No phone calls, no back-and-forth. Pick your parcel, upload your ad, and you{"\u2019"}re live within days.</p>
              <a href="/map" className="map-callout-map-link">
                View Deedz Map <svg viewBox="0 0 205.82 196.86" width="12" height="12" fill="#DF3257" style={{transform:"rotate(-90deg)"}}><path d="M123,179.88l78.22-75.9c6-5.82,6.15-15.41.32-21.41h0c-5.82-6-15.41-6.15-21.41-.32l-62.86,60.99,1.93-127.87C119.32,7.01,112.65.13,104.28,0h0c-8.36-.13-15.24,6.55-15.37,14.91l-1.93,127.85-60.98-62.84c-5.82-6-15.41-6.15-21.41-.32h0c-6,5.82-6.15,15.41-.32,21.41l75.9,78.22,14.18,14.62c3.82,3.93,10.1,4.03,14.03.21l14.62-14.18Z"/></svg>
              </a>
              <div className="map-callout-num">03 / 04</div>
            </div>
          </div>

          <div className="map-callout" data-callout="4">
            <div className="map-callout-content">
              <div className="map-callout-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#d5ff45" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <h3>2{"\u2013"}4{"\u2013"}6 Month Terms</h3>
              <p>Flexible lease durations that fit any campaign. Short sprints or long runs{"\u2014"}lock in your Deed on your terms. Longer commitments get better rates.</p>
              <a href="/map" className="map-callout-map-link">
                View Deedz Map <svg viewBox="0 0 205.82 196.86" width="12" height="12" fill="#DF3257" style={{transform:"rotate(-90deg)"}}><path d="M123,179.88l78.22-75.9c6-5.82,6.15-15.41.32-21.41h0c-5.82-6-15.41-6.15-21.41-.32l-62.86,60.99,1.93-127.87C119.32,7.01,112.65.13,104.28,0h0c-8.36-.13-15.24,6.55-15.37,14.91l-1.93,127.85-60.98-62.84c-5.82-6-15.41-6.15-21.41-.32h0c-6,5.82-6.15,15.41-.32,21.41l75.9,78.22,14.18,14.62c3.82,3.93,10.1,4.03,14.03.21l14.62-14.18Z"/></svg>
              </a>
              <div className="map-callout-num">04 / 04</div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
