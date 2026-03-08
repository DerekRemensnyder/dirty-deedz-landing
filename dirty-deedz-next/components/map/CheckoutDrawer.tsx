"use client";

import { useState, useRef, useEffect } from "react";
import { LEASE_TERMS } from "../../data/map-pins";
import type { SavedDeedz } from "./SavedTray";

interface CheckoutDrawerProps {
  savedDeedz: SavedDeedz[];
  open: boolean;
  onToggle: () => void;
  onAddMore: () => void;
  onRemoveSaved: (itemKey: string) => void;
  onUpdateTerm: (itemKey: string, termIndex: number) => void;
}

export default function CheckoutDrawer({
  savedDeedz,
  open,
  onToggle,
  onAddMore,
  onRemoveSaved,
  onUpdateTerm,
}: CheckoutDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Per-card state
  const [perCardDesign, setPerCardDesign] = useState<Record<string, "own" | "need_design">>({});
  const [perCardImgIdx, setPerCardImgIdx] = useState<Record<string, number>>({});
  const [localCopies, setLocalCopies] = useState<
    Record<string, { headline: string; subheadline: string; callToAction: string; adMessage: string }>
  >({});

  // Contact form (name/email only needed for Stripe)
  const [formData, setFormData] = useState({ name: "", email: "", company: "", phone: "" });
  const [loading, setLoading] = useState(false);

  // Click-outside closes drawer
  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        onToggle();
      }
    };
    // Short delay so the triggering click doesn't immediately re-close
    const t = setTimeout(() => {
      document.addEventListener("pointerdown", handlePointerDown);
    }, 60);
    return () => {
      clearTimeout(t);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [open, onToggle]);

  const getDesign = (item: SavedDeedz): "own" | "need_design" => {
    const key = `${item.pin.id}-${item.parcelIndex}`;
    return perCardDesign[key] ?? item.designOption;
  };

  const getLocalCopy = (item: SavedDeedz) => {
    const key = `${item.pin.id}-${item.parcelIndex}`;
    return {
      headline: localCopies[key]?.headline ?? (item.headline ?? ""),
      subheadline: localCopies[key]?.subheadline ?? (item.subheadline ?? ""),
      callToAction: localCopies[key]?.callToAction ?? (item.callToAction ?? ""),
      adMessage: localCopies[key]?.adMessage ?? (item.adMessage ?? ""),
    };
  };

  const grandTotal = savedDeedz.reduce((sum, item) => {
    const term = LEASE_TERMS[item.termIndex];
    const design = getDesign(item);
    return sum + term.total + (design === "need_design" ? 200 : 0);
  }, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const items = savedDeedz.map((item) => {
      const key = `${item.pin.id}-${item.parcelIndex}`;
      const design = perCardDesign[key] ?? item.designOption;
      const local = localCopies[key];
      const merged = local ? { ...item, ...local } : item;
      const term = LEASE_TERMS[item.termIndex];
      const designFee = design === "need_design" ? 200 : 0;
      const combinedMessage = [
        merged.headline,
        merged.subheadline,
        merged.callToAction ? `CTA: ${merged.callToAction}` : "",
        merged.adMessage,
      ]
        .filter(Boolean)
        .join(" | ");

      return {
        pinName: item.pin.name,
        address: item.pin.address,
        months: term.months,
        monthlyPrice: term.monthlyRate,
        parcels: 1,
        parcelIndex: item.parcelIndex,
        totalParcels: item.pin.parcels,
        totalPrice: term.total + designFee,
        designOption: design,
        designFee,
        adMessage: combinedMessage,
      };
    });

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items,
        customerName: formData.name,
        customerEmail: formData.email,
      }),
    });
    const { url } = await res.json();
    if (url) window.location.href = url;
    else setLoading(false);
  };

  if (savedDeedz.length === 0) return null;

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  // Cart SVG icon
  const cartIcon = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1"/>
      <circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
  );

  return (
    <div ref={drawerRef} className={`checkout-drawer${open ? " open" : ""}`}>
      {/* Pull-out tab — attached to panel left edge, slides with it */}
      <button
        className="checkout-drawer-tab"
        onClick={onToggle}
        aria-label={open ? "Close checkout" : "Open checkout"}
      >
        <span className="checkout-drawer-fab-icon">
          {cartIcon}
          <span className="checkout-drawer-fab-count">{savedDeedz.length}</span>
        </span>
      </button>

      {/* Scrollable body */}
      <div className="checkout-drawer-body">
        <div className="checkout-drawer-header">
          <div>
            <span
              className="section-label"
              style={{ color: "#111", marginBottom: 2, display: "block" }}
            >
              Checkout
            </span>
            <h3 className="checkout-drawer-title">
              Your Deedz ({savedDeedz.length})
            </h3>
          </div>
          <button
            className="checkout-drawer-close"
            onClick={onToggle}
            aria-label="Close checkout"
          >
            ×
          </button>
        </div>

        {/* Cards */}
        {savedDeedz.map((item) => {
          const itemKey = `${item.pin.id}-${item.parcelIndex}`;
          const design = perCardDesign[itemKey] ?? item.designOption;
          const imgIdx = perCardImgIdx[itemKey] ?? 0;
          const localCopy = getLocalCopy(item);
          const term = LEASE_TERMS[item.termIndex];
          const subtotal = term.total + (design === "need_design" ? 200 : 0);
          const satelliteUrl = mapboxToken
            ? `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/static/${item.pin.lng},${item.pin.lat},17,0/400x300@2x?access_token=${mapboxToken}`
            : null;
          const displayImages = satelliteUrl ? [satelliteUrl, ...item.pin.images] : item.pin.images;

          return (
            <div className="checkout-punchlist-card" key={itemKey}>
              {/* Remove (X) */}
              <button
                className="checkout-punchlist-remove-btn"
                onClick={() => onRemoveSaved(itemKey)}
                aria-label={`Remove ${item.pin.name}`}
              >
                ×
              </button>

              {/* Location image carousel */}
              {displayImages.length > 0 && (
                <div className="checkout-card-carousel">
                  <div
                    className="checkout-card-carousel-track"
                    style={{ transform: `translateX(-${imgIdx * 100}%)` }}
                  >
                    {displayImages.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt={`${item.pin.name} location ${i + 1}`}
                        className="checkout-card-carousel-img"
                      />
                    ))}
                  </div>
                  {displayImages.length > 1 && (
                    <div className="checkout-card-carousel-dots">
                      {displayImages.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          className={`checkout-card-carousel-dot${i === imgIdx ? " active" : ""}`}
                          onClick={() =>
                            setPerCardImgIdx((prev) => ({ ...prev, [itemKey]: i }))
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Name + address + price */}
              <div className="checkout-punchlist-card-header">
                <div>
                  <span className="checkout-punchlist-card-name">
                    {item.pin.name}
                    {item.pin.parcels > 1 && (
                      <span className="checkout-punchlist-card-parcel">
                        {" "}· Parcel {item.parcelIndex} of {item.pin.parcels}
                      </span>
                    )}
                  </span>
                  <p className="checkout-punchlist-card-address">
                    {item.pin.address}
                  </p>
                </div>
                <span className="checkout-punchlist-card-price">
                  ${subtotal.toLocaleString()}
                </span>
              </div>

              {/* Design toggle — switch between own template and studio design */}
              <div className="checkout-card-design-toggle">
                <button
                  type="button"
                  className={`checkout-card-design-btn${design === "own" ? " active" : ""}`}
                  onClick={() =>
                    setPerCardDesign((prev) => ({ ...prev, [itemKey]: "own" }))
                  }
                >
                  My Template
                </button>
                <button
                  type="button"
                  className={`checkout-card-design-btn${design === "need_design" ? " active" : ""}`}
                  onClick={() =>
                    setPerCardDesign((prev) => ({
                      ...prev,
                      [itemKey]: "need_design",
                    }))
                  }
                >
                  Studio Design +$200
                </button>
              </div>

              {/* Editable term pills */}
              <div className="term-pills" style={{ marginTop: 8 }}>
                {LEASE_TERMS.map((t, i) => (
                  <button
                    key={t.months}
                    type="button"
                    className={`term-pill${item.termIndex === i ? " active" : ""}`}
                    onClick={() => onUpdateTerm(itemKey, i)}
                  >
                    <span className="term-pill-name">{t.name}</span>
                    <span className="term-pill-months">{t.label}</span>
                    {t.savings > 0 && (
                      <span className="term-discount">save ${t.savings}</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Copy fields — conditional on design option */}
              <div className="ad-copy-fields" style={{ marginTop: 8 }}>
                {design === "need_design" && (
                  <>
                    <div className="ad-copy-field">
                      <label>Headline</label>
                      <input
                        type="text"
                        placeholder="Main headline for your ad"
                        value={localCopy.headline}
                        onChange={(e) =>
                          setLocalCopies((prev) => ({
                            ...prev,
                            [itemKey]: { ...localCopy, headline: e.target.value },
                          }))
                        }
                      />
                    </div>
                    <div className="ad-copy-field">
                      <label>Subheadline</label>
                      <input
                        type="text"
                        placeholder="Secondary line (optional)"
                        value={localCopy.subheadline}
                        onChange={(e) =>
                          setLocalCopies((prev) => ({
                            ...prev,
                            [itemKey]: { ...localCopy, subheadline: e.target.value },
                          }))
                        }
                      />
                    </div>
                    <div className="ad-copy-field">
                      <label>Call to Action</label>
                      <input
                        type="text"
                        placeholder="URL, phone number, or address"
                        value={localCopy.callToAction}
                        onChange={(e) =>
                          setLocalCopies((prev) => ({
                            ...prev,
                            [itemKey]: {
                              ...localCopy,
                              callToAction: e.target.value,
                            },
                          }))
                        }
                      />
                    </div>
                  </>
                )}
                <div className="ad-copy-field">
                  <label>{design === "own" ? "Message" : "Notes"}</label>
                  <textarea
                    rows={2}
                    placeholder={
                      design === "own"
                        ? "Any notes for your template..."
                        : "Colors, style, extra details..."
                    }
                    value={localCopy.adMessage}
                    onChange={(e) =>
                      setLocalCopies((prev) => ({
                        ...prev,
                        [itemKey]: { ...localCopy, adMessage: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>

              {/* Badges */}
              <div style={{ marginTop: 8 }}>
                <span
                  className={`saved-card-badge${
                    item.fileAttached
                      ? " saved-card-badge--file"
                      : " saved-card-badge--file-missing"
                  }`}
                >
                  {item.fileAttached
                    ? design === "own"
                      ? "Template ✓"
                      : "Assets ✓"
                    : design === "own"
                    ? "No template"
                    : "No assets"}
                </span>
                {design === "need_design" && (
                  <span
                    className="saved-card-badge saved-card-badge--design"
                    style={{ marginLeft: 6 }}
                  >
                    Design ✓ +$200
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {/* Add More */}
        <div style={{ textAlign: "center", margin: "10px 0 8px" }}>
          <button type="button" className="checkout-add-more-btn" onClick={onAddMore}>
            + Add More Deedz
          </button>
        </div>

        {/* Grand total + contact form — scrolls naturally at bottom of panel */}
        <div className="checkout-drawer-form-section">
          <div className="booking-pricing" style={{ marginBottom: 10 }}>
            <div
              className="price-line total"
              style={{ color: "#111", fontWeight: 800 }}
            >
              <span>
                Grand Total ({savedDeedz.length}{" "}
                {savedDeedz.length === 1 ? "Deed" : "Deedz"})
              </span>
              <span>${grandTotal.toLocaleString()}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <label className="checkout-drawer-form-label">Your Details</label>
            <input
              type="text"
              placeholder="Full Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="checkout-drawer-input"
            />
            <input
              type="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="checkout-drawer-input"
            />
            <input
              type="text"
              placeholder="Company (optional)"
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
              className="checkout-drawer-input"
            />
            <input
              type="tel"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="checkout-drawer-input"
            />
            <div className="booking-cta-row" style={{ marginTop: 10 }}>
              <button
                type="submit"
                className="btn btn-primary booking-submit checkout-drawer-submit"
                disabled={loading}
              >
                {loading ? (
                  "Redirecting..."
                ) : (
                  <>
                    Checkout All Deedz
                    <span className="deedz-arrow">
                      <svg
                        viewBox="0 0 205.82 196.86"
                        width="9"
                        height="9"
                        fill="currentColor"
                        style={{ transform: "rotate(-90deg)" }}
                      >
                        <path d="M123,179.88l78.22-75.9c6-5.82,6.15-15.41.32-21.41h0c-5.82-6-15.41-6.15-21.41-.32l-62.86,60.99,1.93-127.87C119.32,7.01,112.65.13,104.28,0h0c-8.36-.13-15.24,6.55-15.37,14.91l-1.93,127.85-60.98-62.84c-5.82-6-15.41-6.15-21.41-.32h0c-6,5.82-6.15,15.41-.32,21.41l75.9,78.22,14.18,14.62c3.82,3.93,10.1,4.03,14.03.21l14.62-14.18Z" />
                      </svg>
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
