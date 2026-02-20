"use client";

import { useState, useRef } from "react";
import {
  MapPin,
  LEASE_TERMS,
  TRAFFIC_LABELS,
  getPinTag,
} from "../../data/map-pins";

interface BookingPanelProps {
  pin: MapPin | null;
  onClose: () => void;
}

export default function BookingPanel({ pin, onClose }: BookingPanelProps) {
  const [selectedTerm, setSelectedTerm] = useState(0);
  const [currentImg, setCurrentImg] = useState(0);
  const [designOption, setDesignOption] = useState<"own" | "need_design">("own");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    adMessage: "",
  });
  const [parcelsToBook, setParcelsToBook] = useState(1);
  const [loading, setLoading] = useState(false);
  const touchStartX = useRef(0);
  const logoInputRef = useRef<HTMLInputElement>(null);

  if (!pin) return null;

  const images = pin.images;
  const term = LEASE_TERMS[selectedTerm];
  const designFee = designOption === "need_design" ? 200 : 0;
  const totalPrice = (term.total + designFee) * parcelsToBook;

  const handleFilePreview = (
    file: File,
    setter: (url: string | null) => void
  ) => {
    const reader = new FileReader();
    reader.onloadend = () => setter(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pinName: pin.name,
        address: pin.address,
        planName: term.name,
        months: term.months,
        monthlyPrice: term.monthlyRate,
        parcels: parcelsToBook,
        totalPrice,
        designOption,
        designFee,
        adMessage: formData.adMessage,
        customerName: formData.name,
        customerEmail: formData.email,
      }),
    });

    const { url } = await res.json();
    if (url) {
      window.location.href = url;
    } else {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setLoading(false);
    setSelectedTerm(0);
    setCurrentImg(0);
    setDesignOption("own");
    setLogoPreview(null);
    setParcelsToBook(1);
    setFormData({ name: "", email: "", company: "", phone: "", adMessage: "" });
    onClose();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0 && currentImg < images.length - 1) {
        setCurrentImg((p) => p + 1);
      } else if (diff < 0 && currentImg > 0) {
        setCurrentImg((p) => p - 1);
      }
    }
  };

  return (
    <div className={`booking-overlay${pin ? " open" : ""}`}>
      <div className="booking-panel">
        <button className="booking-close" onClick={handleClose} aria-label="Close">
          &times;
        </button>

        <>
          {/* Image carousel */}
          {images.length > 0 && (
            <div
              className="booking-carousel"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="booking-carousel-track"
                style={{ transform: `translateX(-${currentImg * 100}%)` }}
              >
                {images.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`${pin.name} sidewalk ${i + 1}`}
                    className="booking-carousel-img"
                    draggable={false}
                  />
                ))}
              </div>
              {images.length > 1 && (
                <>
                  <div className="booking-carousel-dots">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        className={`booking-carousel-dot${i === currentImg ? " active" : ""}`}
                        onClick={() => setCurrentImg(i)}
                        aria-label={`Image ${i + 1}`}
                      />
                    ))}
                  </div>
                  {currentImg > 0 && (
                    <button
                      className="booking-carousel-arrow prev"
                      onClick={() => setCurrentImg((p) => p - 1)}
                      aria-label="Previous"
                    >
                      &#8249;
                    </button>
                  )}
                  {currentImg < images.length - 1 && (
                    <button
                      className="booking-carousel-arrow next"
                      onClick={() => setCurrentImg((p) => p + 1)}
                      aria-label="Next"
                    >
                      &#8250;
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          {/* Pin summary */}
          <div className="booking-pin-summary">
            <span
              className="booking-status"
              style={{ color: getPinTag(pin).color }}
            >
              {getPinTag(pin).label}
            </span>
            <h3>{pin.name}</h3>
            <p className="booking-address">{pin.address}</p>
            <div className="booking-meta">
              <span>{pin.neighborhood}</span>
              <span>{TRAFFIC_LABELS[pin.traffic]}</span>
              <span>{pin.sqft} sq ft</span>
            </div>
          </div>

          {/* Lease term selector */}
          <div className="booking-terms">
            <label>Select Lease Term</label>
            <div className="term-pills">
              {LEASE_TERMS.map((t, i) => (
                <button
                  key={t.months}
                  className={`term-pill${selectedTerm === i ? " active" : ""}`}
                  onClick={() => setSelectedTerm(i)}
                >
                  <span className="term-pill-name">{t.name}</span>
                  <span className="term-pill-months">{t.label}</span>
                  {t.savings > 0 && (
                    <span className="term-discount">
                      save ${t.savings}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Parcel quantity — multi-deedz locations only */}
          {pin.parcels > 1 && (
            <div className="booking-parcels">
              <label>Reserve Parcels at This Location</label>
              <p className="booking-parcels-hint">
                {pin.parcels} parcels available at this spot
              </p>
              <div className="parcel-stepper">
                <button
                  type="button"
                  className="parcel-step-btn"
                  onClick={() => setParcelsToBook((p) => Math.max(1, p - 1))}
                  disabled={parcelsToBook <= 1}
                >
                  −
                </button>
                <span className="parcel-step-value">
                  {parcelsToBook} <span className="parcel-step-of">of {pin.parcels}</span>
                </span>
                <button
                  type="button"
                  className="parcel-step-btn"
                  onClick={() => setParcelsToBook((p) => Math.min(pin.parcels, p + 1))}
                  disabled={parcelsToBook >= pin.parcels}
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Design option */}
          <div className="booking-design-options">
            <label>Design &amp; Creative</label>
            <div className="design-radios">
              <label
                className={`design-radio${designOption === "own" ? " active" : ""}`}
              >
                <input
                  type="radio"
                  name="designOption"
                  checked={designOption === "own"}
                  onChange={() => setDesignOption("own")}
                />
                <span className="design-radio-dot" />
                <div>
                  <span className="design-radio-title">I'll design it using your template</span>
                  <span className="design-radio-desc">Download our stencil template, add your design, and upload the completed file</span>
                </div>
              </label>
              <label
                className={`design-radio${designOption === "need_design" ? " active" : ""}`}
              >
                <input
                  type="radio"
                  name="designOption"
                  checked={designOption === "need_design"}
                  onChange={() => setDesignOption("need_design")}
                />
                <span className="design-radio-dot" />
                <div>
                  <span className="design-radio-title">
                    Design it for me <span className="design-fee-tag">+$200</span>
                  </span>
                  <span className="design-radio-desc">Our team creates your stencil from scratch</span>
                </div>
              </label>
            </div>
          </div>

          {/* Ad details — always shown */}
          <div className="booking-ad-details">
            <label>{designOption === "own" ? "Your Ad" : "Ad Brief"}</label>
            <textarea
              placeholder="Tagline, URL, promo code, QR target — tell us what goes on the stencil..."
              rows={3}
              value={formData.adMessage}
              onChange={(e) =>
                setFormData({ ...formData, adMessage: e.target.value })
              }
            />
            <div className="booking-upload-row">
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*,.svg,.ai,.eps,.pdf,.psd"
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFilePreview(f, setLogoPreview);
                }}
              />
              <button
                type="button"
                className="booking-upload-btn"
                onClick={() => logoInputRef.current?.click()}
              >
                {logoPreview ? (
                  <img src={logoPreview} alt="File preview" className="upload-thumb" />
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    {designOption === "own" ? "Upload Completed Template" : "Upload Logo / Assets"}
                  </>
                )}
              </button>
              <span className="upload-hint">PNG, SVG, AI, PSD, or PDF</span>
            </div>
          </div>

          {/* Price breakdown */}
          <div className="booking-pricing">
            <div className="price-line">
              <span>Monthly rate</span>
              <span>${term.monthlyRate.toLocaleString()}/mo</span>
            </div>
            <div className="price-line">
              <span>Duration</span>
              <span>{term.months} months</span>
            </div>
            {term.savings > 0 && (
              <div className="price-line savings">
                <span>You save</span>
                <span>${(term.savings * parcelsToBook).toLocaleString()}</span>
              </div>
            )}
            {parcelsToBook > 1 && (
              <div className="price-line">
                <span>Parcels</span>
                <span>× {parcelsToBook}</span>
              </div>
            )}
            {designFee > 0 && (
              <div className="price-line">
                <span>Design services</span>
                <span>+${designFee}</span>
              </div>
            )}
            <div className="price-line total">
              <span>Total</span>
              <span>${totalPrice.toLocaleString()}</span>
            </div>
          </div>

          {/* Contact form */}
          <form className="booking-form" onSubmit={handleSubmit}>
            <label>Your Details</label>
            <input
              type="text"
              placeholder="Full Name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Company (optional)"
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
            />
            <input
              type="tel"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
            <div className="booking-cta-row">
              <button
                type="submit"
                className="btn btn-primary booking-submit"
                disabled={loading}
              >
                {loading ? "Redirecting..." : <>{term.cta} <span className="arrow">→</span></>}
              </button>
              <button
                type="button"
                className="booking-add-more"
                onClick={handleClose}
              >
                + Add More Deedz
              </button>
            </div>
          </form>
        </>
      </div>
    </div>
  );
}
