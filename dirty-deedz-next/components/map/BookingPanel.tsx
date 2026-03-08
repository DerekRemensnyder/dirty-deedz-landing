"use client";

import { useState, useRef } from "react";
import {
  MapPin,
  LEASE_TERMS,
  TRAFFIC_LABELS,
  getPinTag,
} from "../../data/map-pins";
import type { SavedDeedz } from "./SavedTray";

interface BookingPanelProps {
  pin: MapPin | null;
  onClose: () => void;
  onSaveDeedz: (items: SavedDeedz[]) => void;
}

export default function BookingPanel({
  pin,
  onClose,
  onSaveDeedz,
}: BookingPanelProps) {
  const [selectedTerm, setSelectedTerm] = useState(0);
  const [currentImg, setCurrentImg] = useState(0);
  const [designOption, setDesignOption] = useState<"own" | "need_design">("own");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    headline: "",
    subheadline: "",
    callToAction: "",
    adMessage: "",
  });
  const [parcelsToBook, setParcelsToBook] = useState(1);
  const [loading, setLoading] = useState(false);
  const touchStartX = useRef(0);
  const logoInputRef = useRef<HTMLInputElement>(null);
  // Single-pin multi-parcel per-parcel state
  const [perParcelMessages, setPerParcelMessages] = useState<Record<number, string>>({});
  const [perParcelFiles, setPerParcelFiles] = useState<Record<number, string | null>>({});
  const perParcelFileRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const [perParcelDesignOptions, setPerParcelDesignOptions] = useState<Record<number, "own" | "need_design">>({});
  const [perParcelTerms, setPerParcelTerms] = useState<Record<number, number>>({});
  const [perParcelHeadlines, setPerParcelHeadlines] = useState<Record<number, string>>({});
  const [perParcelSubheadlines, setPerParcelSubheadlines] = useState<Record<number, string>>({});
  const [perParcelCTAs, setPerParcelCTAs] = useState<Record<number, string>>({});
  const [showErrors, setShowErrors] = useState(false);
  const handleFilePreview = (
    file: File,
    setter: (url: string | null) => void
  ) => {
    const reader = new FileReader();
    reader.onloadend = () => setter(reader.result as string);
    reader.readAsDataURL(file);
  };

  if (!pin) return null;

  // ── Single-pin config mode ──
  const images = pin.images;
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const satelliteUrl = mapboxToken
    ? `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/static/${pin.lng},${pin.lat},17,0/400x300@2x?access_token=${mapboxToken}`
    : null;
  const displayImages = satelliteUrl ? [satelliteUrl, ...images] : images;
  const term = LEASE_TERMS[selectedTerm];
  const designFee = designOption === "need_design" ? 200 : 0;
  const totalDesignFee =
    parcelsToBook > 1
      ? Array.from({ length: parcelsToBook }, (_, i) => i + 1).reduce(
          (sum, idx) =>
            sum +
            ((perParcelDesignOptions[idx] ?? "own") === "need_design" ? 200 : 0),
          0
        )
      : designFee;
  const totalLeaseCost =
    parcelsToBook > 1
      ? Array.from({ length: parcelsToBook }, (_, i) => i + 1).reduce(
          (sum, idx) => sum + LEASE_TERMS[perParcelTerms[idx] ?? selectedTerm].total,
          0
        )
      : term.total;
  const totalPrice = totalLeaseCost + totalDesignFee;

  // Gate: all required fields filled per parcel
  const singlePinReady =
    parcelsToBook > 1
      ? Array.from({ length: parcelsToBook }, (_, i) => i + 1).every((idx) => {
          const pDesign = perParcelDesignOptions[idx] ?? "own";
          if (pDesign === "own") return !!perParcelFiles[idx];
          return (
            (perParcelHeadlines[idx]?.trim().length ?? 0) > 0 &&
            (perParcelCTAs[idx]?.trim().length ?? 0) > 0
          );
        })
      : designOption === "own"
      ? !!logoPreview
      : formData.headline.trim().length > 0 &&
        formData.callToAction.trim().length > 0;

  const locationPreviewUrl = mapboxToken
    ? `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${pin.lng},${pin.lat},17,0/400x300@2x?access_token=${mapboxToken}`
    : null;

  const handleAddToTray = () => {
    const items: SavedDeedz[] =
      parcelsToBook > 1
        ? Array.from({ length: parcelsToBook }, (_, i) => {
            const idx = i + 1;
            return {
              pin,
              termIndex: perParcelTerms[idx] ?? selectedTerm,
              parcels: pin.parcels,
              parcelIndex: idx,
              designOption: perParcelDesignOptions[idx] ?? "own",
              headline: perParcelHeadlines[idx] ?? "",
              subheadline: perParcelSubheadlines[idx] ?? "",
              callToAction: perParcelCTAs[idx] ?? "",
              adMessage: perParcelMessages[idx] ?? "",
              fileAttached: !!perParcelFiles[idx],
            };
          })
        : [
            {
              pin,
              termIndex: selectedTerm,
              parcels: pin.parcels,
              parcelIndex: 1,
              designOption,
              headline: formData.headline,
              subheadline: formData.subheadline,
              callToAction: formData.callToAction,
              adMessage: formData.adMessage,
              fileAttached: !!logoPreview,
            },
          ];
    onSaveDeedz(items);
    // Reset single-parcel form state; parent transitions panel to checkout mode
    setSelectedTerm(0);
    setCurrentImg(0);
    setDesignOption("own");
    setLogoPreview(null);
    setParcelsToBook(1);
    setFormData({ headline: "", subheadline: "", callToAction: "", adMessage: "" });
    setPerParcelMessages({});
    setPerParcelFiles({});
    setPerParcelDesignOptions({});
    setPerParcelTerms({});
    setPerParcelHeadlines({});
    setPerParcelSubheadlines({});
    setPerParcelCTAs({});
    setShowErrors(false);
  };

  const handleClose = () => {
    setLoading(false);
    setSelectedTerm(0);
    setCurrentImg(0);
    setDesignOption("own");
    setLogoPreview(null);
    setParcelsToBook(1);
    setFormData({ headline: "", subheadline: "", callToAction: "", adMessage: "" });
    setPerParcelMessages({});
    setPerParcelFiles({});
    setPerParcelDesignOptions({});
    setPerParcelTerms({});
    setPerParcelHeadlines({});
    setPerParcelSubheadlines({});
    setPerParcelCTAs({});
    setShowErrors(false);
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

  // Shared upload SVG icon
  const uploadIcon = (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );

  return (
    <div className={`booking-overlay${pin ? " open" : ""}`}>
      <div className="booking-panel">
        <button className="booking-close" onClick={handleClose} aria-label="Close">
          &times;
        </button>

        <>
          {/* Image carousel */}
          {displayImages.length > 0 && (
            <div
              className="booking-carousel"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="booking-carousel-track"
                style={{ transform: `translateX(-${currentImg * 100}%)` }}
              >
                {displayImages.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`${pin.name} sidewalk ${i + 1}`}
                    className="booking-carousel-img"
                    draggable={false}
                  />
                ))}
              </div>
              {displayImages.length > 1 && (
                <>
                  <div className="booking-carousel-dots">
                    {displayImages.map((_, i) => (
                      <button
                        key={i}
                        className={`booking-carousel-dot${
                          i === currentImg ? " active" : ""
                        }`}
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
                  {currentImg < displayImages.length - 1 && (
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

          {/* Lease term selector — hidden when multi-parcel */}
          {parcelsToBook === 1 ? (
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
                      <span className="term-discount">save ${t.savings}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="booking-terms">
              <label>Lease Terms &amp; Creative</label>
              <p className="booking-parcels-hint">
                Set a lease term and design for each parcel below
              </p>
            </div>
          )}

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
                  {parcelsToBook}{" "}
                  <span className="parcel-step-of">of {pin.parcels}</span>
                </span>
                <button
                  type="button"
                  className="parcel-step-btn"
                  onClick={() =>
                    setParcelsToBook((p) => Math.min(pin.parcels, p + 1))
                  }
                  disabled={parcelsToBook >= pin.parcels}
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Design option — single parcel only; multi-parcel moves into each card */}
          {parcelsToBook === 1 && (
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
                    <span className="design-radio-title">
                      I&apos;ll design it using your template
                    </span>
                    <span className="design-radio-desc">
                      Download our stencil template, add your design, and upload the
                      completed file
                    </span>
                  </div>
                </label>
                <label
                  className={`design-radio${
                    designOption === "need_design" ? " active" : ""
                  }`}
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
                      Design it for me{" "}
                      <span className="design-fee-tag">+$200</span>
                    </span>
                    <span className="design-radio-desc">
                      Our team creates your stencil from scratch
                    </span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Ad details — structured copy fields */}
          <div className="booking-ad-details">
            <label>
              {parcelsToBook > 1
                ? "Design & Creative"
                : designOption === "own"
                ? "Your Ad"
                : "Ad Brief"}
            </label>

            {parcelsToBook > 1 ? (
              /* Per-parcel mini-cards */
              <div className="multi-design-cards">
                {Array.from({ length: parcelsToBook }, (_, i) => {
                  const idx = i + 1;
                  const pDesign = perParcelDesignOptions[idx] ?? "own";
                  return (
                    <div className="multi-design-card" key={idx}>
                      <div className="multi-design-card-header">
                        Parcel {idx} of {parcelsToBook}
                      </div>

                      {/* Term pills */}
                      <div className="term-pills" style={{ marginBottom: "10px" }}>
                        {LEASE_TERMS.map((t, i) => (
                          <button
                            key={t.months}
                            type="button"
                            className={`term-pill${
                              (perParcelTerms[idx] ?? selectedTerm) === i
                                ? " active"
                                : ""
                            }`}
                            onClick={() =>
                              setPerParcelTerms((prev) => ({ ...prev, [idx]: i }))
                            }
                          >
                            <span className="term-pill-name">{t.name}</span>
                            <span className="term-pill-months">{t.label}</span>
                            {t.savings > 0 && (
                              <span className="term-discount">save ${t.savings}</span>
                            )}
                          </button>
                        ))}
                      </div>

                      {/* Design radio */}
                      <div className="design-radios" style={{ marginBottom: "12px" }}>
                        <label
                          className={`design-radio${pDesign === "own" ? " active" : ""}`}
                        >
                          <input
                            type="radio"
                            name={`parcel-design-${idx}`}
                            checked={pDesign === "own"}
                            onChange={() =>
                              setPerParcelDesignOptions((prev) => ({
                                ...prev,
                                [idx]: "own",
                              }))
                            }
                          />
                          <span className="design-radio-dot" />
                          <span className="design-radio-title">
                            I&apos;ll design it
                          </span>
                        </label>
                        <label
                          className={`design-radio${
                            pDesign === "need_design" ? " active" : ""
                          }`}
                        >
                          <input
                            type="radio"
                            name={`parcel-design-${idx}`}
                            checked={pDesign === "need_design"}
                            onChange={() =>
                              setPerParcelDesignOptions((prev) => ({
                                ...prev,
                                [idx]: "need_design",
                              }))
                            }
                          />
                          <span className="design-radio-dot" />
                          <span className="design-radio-title">
                            Design for me{" "}
                            <span className="design-fee-tag">+$200</span>
                          </span>
                        </label>
                      </div>

                      {/* Structured copy fields — conditional by design option */}
                      <div className="ad-copy-fields">
                        {pDesign === "need_design" && (
                          <>
                            <div className="ad-copy-field">
                              <label>
                                Headline{" "}
                                <span className="required-star">*</span>
                              </label>
                              <input
                                type="text"
                                placeholder="Main headline for your ad"
                                className={showErrors && !(perParcelHeadlines[idx]?.trim()) ? "field-error" : undefined}
                                value={perParcelHeadlines[idx] ?? ""}
                                onChange={(e) =>
                                  setPerParcelHeadlines((prev) => ({
                                    ...prev,
                                    [idx]: e.target.value,
                                  }))
                                }
                              />
                              {showErrors && !(perParcelHeadlines[idx]?.trim()) && (
                                <span className="ad-copy-field-error-msg">Required</span>
                              )}
                            </div>
                            <div className="ad-copy-field">
                              <label>Subheadline</label>
                              <input
                                type="text"
                                placeholder="Secondary line (optional)"
                                value={perParcelSubheadlines[idx] ?? ""}
                                onChange={(e) =>
                                  setPerParcelSubheadlines((prev) => ({
                                    ...prev,
                                    [idx]: e.target.value,
                                  }))
                                }
                              />
                            </div>
                            <div className="ad-copy-field">
                              <label>
                                Call to Action{" "}
                                <span className="required-star">*</span>
                              </label>
                              <input
                                type="text"
                                placeholder="URL, phone number, or address"
                                className={showErrors && !(perParcelCTAs[idx]?.trim()) ? "field-error" : undefined}
                                value={perParcelCTAs[idx] ?? ""}
                                onChange={(e) =>
                                  setPerParcelCTAs((prev) => ({
                                    ...prev,
                                    [idx]: e.target.value,
                                  }))
                                }
                              />
                              {showErrors && !(perParcelCTAs[idx]?.trim()) && (
                                <span className="ad-copy-field-error-msg">Required</span>
                              )}
                            </div>
                          </>
                        )}
                        <div className="ad-copy-field">
                          <label>{pDesign === "own" ? "Message" : "Notes for design team"}</label>
                          <textarea
                            placeholder={pDesign === "own"
                              ? "Any notes for your template (optional)..."
                              : "Colors, style preferences, any extra details..."}
                            rows={2}
                            value={perParcelMessages[idx] ?? ""}
                            onChange={(e) =>
                              setPerParcelMessages((prev) => ({
                                ...prev,
                                [idx]: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>

                      {/* File upload */}
                      <div className="booking-upload-row">
                        <input
                          ref={(el) => {
                            perParcelFileRefs.current[idx] = el;
                          }}
                          type="file"
                          accept="image/*,.svg,.ai,.eps,.pdf,.psd"
                          className="sr-only"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f)
                              handleFilePreview(f, (url) =>
                                setPerParcelFiles((prev) => ({
                                  ...prev,
                                  [idx]: url,
                                }))
                              );
                          }}
                        />
                        <button
                          type="button"
                          className={`booking-upload-btn${showErrors && pDesign === "own" && !perParcelFiles[idx] ? " field-error" : ""}`}
                          onClick={() => perParcelFileRefs.current[idx]?.click()}
                        >
                          {perParcelFiles[idx] ? (
                            <img
                              src={perParcelFiles[idx]!}
                              alt="File preview"
                              className="upload-thumb"
                            />
                          ) : locationPreviewUrl ? (
                            <span className="upload-location-fallback">
                              <img
                                src={locationPreviewUrl}
                                alt={`${pin.name} location`}
                                className="upload-thumb"
                              />
                              <span>
                                {pDesign === "own"
                                  ? "Upload Completed Template"
                                  : "Upload Logo / Assets"}
                              </span>
                            </span>
                          ) : (
                            <>
                              {uploadIcon}
                              {pDesign === "own"
                                ? "Upload Template"
                                : "Upload Logo / Assets"}
                            </>
                          )}
                        </button>
                        <span className="upload-hint">
                          {perParcelFiles[idx]
                            ? pDesign === "own"
                              ? "Template uploaded ✓"
                              : "Assets uploaded ✓"
                            : pDesign === "own"
                            ? "Upload completed template (required) · PNG, SVG, AI, PSD, PDF"
                            : "Upload logo & brand assets (optional) · SVG, AI, EPS, PDF"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Single parcel */
              <>
                <div className="ad-copy-fields">
                  {designOption === "need_design" && (
                    <>
                      <div className="ad-copy-field">
                        <label>
                          Headline <span className="required-star">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Main headline for your ad"
                          className={showErrors && !formData.headline.trim() ? "field-error" : undefined}
                          value={formData.headline}
                          onChange={(e) =>
                            setFormData({ ...formData, headline: e.target.value })
                          }
                        />
                        {showErrors && !formData.headline.trim() && (
                          <span className="ad-copy-field-error-msg">Required</span>
                        )}
                      </div>
                      <div className="ad-copy-field">
                        <label>Subheadline</label>
                        <input
                          type="text"
                          placeholder="Secondary line (optional)"
                          value={formData.subheadline}
                          onChange={(e) =>
                            setFormData({ ...formData, subheadline: e.target.value })
                          }
                        />
                      </div>
                      <div className="ad-copy-field">
                        <label>
                          Call to Action <span className="required-star">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="URL, phone number, or address"
                          className={showErrors && !formData.callToAction.trim() ? "field-error" : undefined}
                          value={formData.callToAction}
                          onChange={(e) =>
                            setFormData({ ...formData, callToAction: e.target.value })
                          }
                        />
                        {showErrors && !formData.callToAction.trim() && (
                          <span className="ad-copy-field-error-msg">Required</span>
                        )}
                      </div>
                    </>
                  )}
                  <div className="ad-copy-field">
                    <label>{designOption === "own" ? "Message" : "Notes for design team"}</label>
                    <textarea
                      placeholder={designOption === "own"
                        ? "Any notes for your template (optional)..."
                        : "Colors, style preferences, any extra details..."}
                      rows={2}
                      value={formData.adMessage}
                      onChange={(e) =>
                        setFormData({ ...formData, adMessage: e.target.value })
                      }
                    />
                  </div>
                </div>

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
                    className={`booking-upload-btn${showErrors && designOption === "own" && !logoPreview ? " field-error" : ""}`}
                    onClick={() => logoInputRef.current?.click()}
                  >
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="File preview"
                        className="upload-thumb"
                      />
                    ) : locationPreviewUrl ? (
                      <span className="upload-location-fallback">
                        <img
                          src={locationPreviewUrl}
                          alt={`${pin.name} location`}
                          className="upload-thumb"
                        />
                        <span>
                          {designOption === "own"
                            ? "Upload Completed Template"
                            : "Upload Logo / Assets"}
                        </span>
                      </span>
                    ) : (
                      <>
                        {uploadIcon}
                        {designOption === "own"
                          ? "Upload Completed Template"
                          : "Upload Logo / Assets"}
                      </>
                    )}
                  </button>
                  <span className="upload-hint">
                    {logoPreview
                      ? designOption === "own"
                        ? "Template uploaded ✓"
                        : "Assets uploaded ✓"
                      : designOption === "own"
                      ? "Upload completed template (required) · PNG, SVG, AI, PSD, PDF"
                      : "Upload logo & brand assets (optional) · SVG, AI, EPS, PDF"}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Price breakdown */}
          <div className="booking-pricing">
            {parcelsToBook > 1 ? (
              <>
                {Array.from({ length: parcelsToBook }, (_, i) => {
                  const idx = i + 1;
                  const pTerm = LEASE_TERMS[perParcelTerms[idx] ?? selectedTerm];
                  const pDesignFee =
                    (perParcelDesignOptions[idx] ?? "own") === "need_design" ? 200 : 0;
                  return (
                    <div className="price-line" key={idx}>
                      <span>
                        Parcel {idx} · {pTerm.label}
                        {pDesignFee > 0 ? " + design" : ""}
                      </span>
                      <span>${(pTerm.total + pDesignFee).toLocaleString()}</span>
                    </div>
                  );
                })}
              </>
            ) : (
              <>
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
                    <span>${term.savings.toLocaleString()}</span>
                  </div>
                )}
                {totalDesignFee > 0 && (
                  <div className="price-line">
                    <span>Design services</span>
                    <span>+${totalDesignFee.toLocaleString()}</span>
                  </div>
                )}
              </>
            )}
            <div className="price-line total">
              <span>Total</span>
              <span>${totalPrice.toLocaleString()}</span>
            </div>
          </div>

          {/* CTA — Save & Review */}
          <div className="booking-cta-row">
            <button
              type="button"
              className={`btn btn-primary booking-submit${!singlePinReady ? " booking-submit--inactive" : ""}`}
              onClick={() => {
                if (!singlePinReady) {
                  setShowErrors(true);
                } else {
                  handleAddToTray();
                }
              }}
            >
              Save to Checkout
              <span className="deedz-arrow">
                <svg viewBox="0 0 205.82 196.86" width="9" height="9" fill="currentColor" style={{ transform: "rotate(-90deg)" }}>
                  <path d="M123,179.88l78.22-75.9c6-5.82,6.15-15.41.32-21.41h0c-5.82-6-15.41-6.15-21.41-.32l-62.86,60.99,1.93-127.87C119.32,7.01,112.65.13,104.28,0h0c-8.36-.13-15.24,6.55-15.37,14.91l-1.93,127.85-60.98-62.84c-5.82-6-15.41-6.15-21.41-.32h0c-6,5.82-6.15,15.41-.32,21.41l75.9,78.22,14.18,14.62c3.82,3.93,10.1,4.03,14.03.21l14.62-14.18Z" />
                </svg>
              </span>
            </button>
          </div>
        </>
      </div>
    </div>
  );
}
