"use client";

import {
  MapPin,
  LEASE_TERMS,
  TRAFFIC_LABELS,
  getPinTag,
} from "../../data/map-pins";

export interface SavedDeedz {
  pin: MapPin;
  termIndex: number;
  parcels: number;
  parcelIndex: number;
  designOption: "own" | "need_design";
  headline?: string;
  subheadline?: string;
  callToAction?: string;
  adMessage: string;
  fileAttached?: boolean;
}

interface SavedTrayProps {
  items: SavedDeedz[];
  open: boolean;
  onToggle: () => void;
  onRemove: (itemKey: string) => void;
  onUpdateTerm: (itemKey: string, termIndex: number) => void;
  onUpdateAdMessage: (itemKey: string, adMessage: string) => void;
  onCheckout: () => void;
  cardView?: boolean;
  onToggleCardView?: () => void;
}

export default function SavedTray({
  items,
  open,
  onToggle,
  onRemove,
  onUpdateTerm,
  onUpdateAdMessage,
  onCheckout,
  cardView,
  onToggleCardView,
}: SavedTrayProps) {
  if (items.length === 0) return null;

  const grandTotal = items.reduce((sum, item) => {
    const term = LEASE_TERMS[item.termIndex];
    const designFee = item.designOption === "need_design" ? 200 : 0;
    return sum + term.total + designFee;
  }, 0);

  return (
    <div className={`saved-tray${open ? " open" : ""}`}>
      {/* Collapsed bar — always visible */}
      <div className="saved-tray-bar" role="button" tabIndex={0} onClick={onToggle} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onToggle(); }}>
        <div className="saved-tray-bar-left">
          <span className="saved-tray-count">
            Saved Deedz ({items.length})
          </span>
          <span className="saved-tray-total">
            ${grandTotal.toLocaleString()}
          </span>
        </div>
        <div className="saved-tray-bar-right">
          {onToggleCardView && (
            <button
              className="saved-tray-view-toggle"
              onClick={(e) => { e.stopPropagation(); onToggleCardView(); }}
              title={cardView ? "Switch to map view" : "Switch to card view"}
            >
              {cardView ? (
                <>
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4 }}>
                    <circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
                  </svg>
                  Map
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4 }}>
                    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                  </svg>
                  Cards
                </>
              )}
            </button>
          )}
          <button
            className="saved-tray-checkout"
            onClick={(e) => { e.stopPropagation(); onCheckout(); }}
          >
            Compare &amp; Checkout
            <span className="deedz-arrow">
              <svg viewBox="0 0 205.82 196.86" width="9" height="9" fill="currentColor" style={{ transform: "rotate(-90deg)" }}>
                <path d="M123,179.88l78.22-75.9c6-5.82,6.15-15.41.32-21.41h0c-5.82-6-15.41-6.15-21.41-.32l-62.86,60.99,1.93-127.87C119.32,7.01,112.65.13,104.28,0h0c-8.36-.13-15.24,6.55-15.37,14.91l-1.93,127.85-60.98-62.84c-5.82-6-15.41-6.15-21.41-.32h0c-6,5.82-6.15,15.41-.32,21.41l75.9,78.22,14.18,14.62c3.82,3.93,10.1,4.03,14.03.21l14.62-14.18Z" />
              </svg>
            </span>
          </button>
          <span className="saved-tray-toggle-icon">+</span>
        </div>
      </div>

      {/* Expanded cards */}
      {open && (
        <div className="saved-tray-body">
          <div className="saved-tray-scroll">
            {items.map((item) => {
              const itemKey = `${item.pin.id}-${item.parcelIndex}`;
              const tag = getPinTag(item.pin);
              const term = LEASE_TERMS[item.termIndex];
              const designFee = item.designOption === "need_design" ? 200 : 0;
              const subtotal = term.total + designFee;

              const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
              const mapFallbackUrl = mapboxToken
                ? `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${item.pin.lng},${item.pin.lat},16,0/600x260@2x?access_token=${mapboxToken}`
                : null;

              return (
                <div className="saved-card" key={itemKey}>
                  <button
                    className="saved-card-remove"
                    onClick={() => onRemove(itemKey)}
                    aria-label={`Remove ${item.pin.name}`}
                  >
                    &times;
                  </button>

                  {/* Thumbnail — pin image OR Mapbox static map */}
                  <div className="saved-card-img">
                    {item.pin.images?.[0] ? (
                      <img src={item.pin.images[0]} alt={item.pin.name} />
                    ) : mapFallbackUrl ? (
                      <img src={mapFallbackUrl} alt={`${item.pin.name} location`} className="saved-card-img-map" />
                    ) : (
                      <div className="saved-card-img-placeholder" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="saved-card-info">
                    <span className="saved-card-tag" style={{ color: tag.color }}>
                      {tag.label}
                    </span>
                    <p className="saved-card-name">{item.pin.name}</p>
                    <p className="saved-card-address">{item.pin.address}</p>
                    <div className="saved-card-meta">
                      <span>{TRAFFIC_LABELS[item.pin.traffic]}</span>
                      <span>{item.pin.sqft} sq ft</span>
                      {item.pin.parcels > 1 && (
                        <span>Parcel {item.parcelIndex} of {item.pin.parcels}</span>
                      )}
                    </div>
                  </div>

                  {/* Copy + asset section */}
                  <div className="saved-card-copy-section">
                    {item.headline && (
                      <div className="saved-card-copy-row">
                        <span className="saved-card-copy-field-label">Headline</span>
                        <span className="saved-card-copy-headline">{item.headline}</span>
                      </div>
                    )}
                    {item.subheadline && (
                      <div className="saved-card-copy-row">
                        <span className="saved-card-copy-field-label">Subhead</span>
                        <span className="saved-card-copy-sub">{item.subheadline}</span>
                      </div>
                    )}
                    {item.callToAction && (
                      <div className="saved-card-copy-row">
                        <span className="saved-card-copy-field-label">CTA</span>
                        <span className="saved-card-copy-cta-val">{item.callToAction}</span>
                      </div>
                    )}
                    {item.adMessage && (
                      <div className="saved-card-copy-row">
                        <span className="saved-card-copy-field-label">Notes</span>
                        <span className="saved-card-copy-notes">{item.adMessage}</span>
                      </div>
                    )}
                    <div className="saved-card-badges">
                      <span className={`saved-card-badge${item.fileAttached ? " saved-card-badge--file" : " saved-card-badge--file-missing"}`}>
                        {item.fileAttached
                          ? item.designOption === "own" ? "Template ✓" : "Assets ✓"
                          : item.designOption === "own" ? "No template" : "No assets"}
                      </span>
                      {item.designOption === "need_design" && (
                        <span className="saved-card-badge saved-card-badge--design">+$200 Design</span>
                      )}
                    </div>
                  </div>

                  {/* Term pills */}
                  <div className="saved-card-terms">
                    {LEASE_TERMS.map((t, i) => (
                      <button
                        key={t.months}
                        className={`saved-term-pill${item.termIndex === i ? " active" : ""}`}
                        onClick={() => onUpdateTerm(itemKey, i)}
                      >
                        {t.label}
                        <span className="saved-term-rate">${t.monthlyRate}/mo</span>
                      </button>
                    ))}
                  </div>

                  {/* Subtotal */}
                  <div className="saved-card-subtotal">
                    <span className="saved-card-subtotal-label">Subtotal</span>
                    <div className="saved-card-subtotal-right">
                      {designFee > 0 && (
                        <span className="saved-card-design-note">+$200 design</span>
                      )}
                      <span className="saved-card-subtotal-amount">${subtotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
