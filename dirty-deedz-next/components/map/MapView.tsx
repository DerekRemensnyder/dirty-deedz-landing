"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import Map, { Marker, Popup, type MapRef } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  MapPin,
  STATUS_COLORS,
  MULTI_DEEDZ_COLOR,
  TRAFFIC_LABELS,
  getPinTag,
} from "../../data/map-pins";

interface MapViewProps {
  pins: MapPin[];
  selectedPin: MapPin | null;
  onSelectPin: (pin: MapPin | null) => void;
  onBookPin: (pin: MapPin) => void;
  cardView: boolean;
  onToggleCardView: () => void;
}

const LEGEND_ITEMS = [
  { label: "Available", color: STATUS_COLORS.available },
  { label: "Multiple Deedz", color: MULTI_DEEDZ_COLOR },
  { label: "Coming Soon", color: STATUS_COLORS.coming_soon },
];

const PAGE_SIZE = 25;

export default function MapView({
  pins,
  selectedPin,
  onSelectPin,
  onBookPin,
  cardView,
  onToggleCardView,
}: MapViewProps) {
  const mapRef = useRef<MapRef>(null);
  const [page, setPage] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);

  // Reset to first page whenever the visible pin set changes
  useEffect(() => { setPage(0); }, [pins.length, cardView]);

  const totalPages = Math.ceil(pins.length / PAGE_SIZE);
  const pagedPins = pins.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const goToPage = (p: number) => {
    setPage(p);
    gridRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleMarkerClick = useCallback(
    (pin: MapPin) => {
      onSelectPin(pin);
      mapRef.current?.flyTo({
        center: [pin.lng, pin.lat],
        zoom: 15,
        duration: 1200,
      });
    },
    [onSelectPin]
  );

  return (
    <div className="map-container">
      {cardView ? (
        /* ── Card grid view ── */
        <div className="card-grid-view" ref={gridRef}>
          <div className="card-grid-inner">
            {pagedPins.map((pin) => {
              const tag = getPinTag(pin);
              return (
                <div
                  key={pin.id}
                  className={`map-pin-card${selectedPin?.id === pin.id ? " active" : ""}`}
                  onClick={() => onSelectPin(pin)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onSelectPin(pin); }}
                >
                  {/* Image */}
                  <div className="map-pin-card-img">
                    {pin.images?.[0] ? (
                      <img src={pin.images[0]} alt={pin.name} />
                    ) : (
                      <div className="map-pin-card-img-placeholder">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5">
                          <rect x="3" y="3" width="18" height="18" rx="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/>
                          <path d="M21 15l-5-5L5 21"/>
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="map-pin-card-body">
                    <span className="map-pin-card-tag" style={{ color: tag.color }}>
                      {tag.label.toUpperCase()}
                    </span>
                    <p className="map-pin-card-name">{pin.name}</p>
                    <p className="map-pin-card-address">{pin.address}</p>
                    <p className="map-pin-card-desc">{pin.description}</p>
                    <div className="map-pin-card-meta">
                      <span>{TRAFFIC_LABELS[pin.traffic]}</span>
                      <span>{pin.sqft} sq ft</span>
                      {pin.parcels > 1 && <span>{pin.parcels} parcels</span>}
                    </div>
                    <div className="map-pin-card-footer">
                      <div className="map-pin-card-price">
                        <span className="map-pin-card-price-label">AS LOW AS</span>
                        <span className="map-pin-card-price-amount">$333</span>
                        <span className="map-pin-card-price-unit">/mo</span>
                      </div>
                      {pin.status === "available" ? (
                        <button
                          className="btn btn-primary map-pin-card-cta"
                          onClick={(e) => { e.stopPropagation(); onBookPin(pin); }}
                        >
                          Lease a Deedz <span className="arrow">→</span>
                        </button>
                      ) : (
                        <div className="map-pin-card-cta-soon">Coming Soon</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {pins.length === 0 && (
              <p className="card-grid-empty">No locations match your filters.</p>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="card-grid-pagination">
              <button
                className="pgn-btn"
                onClick={() => goToPage(page - 1)}
                disabled={page === 0}
              >
                ← Prev
              </button>
              <div className="pgn-pages">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    className={`pgn-dot${i === page ? " active" : ""}`}
                    onClick={() => goToPage(i)}
                    aria-label={`Page ${i + 1}`}
                  />
                ))}
              </div>
              <span className="pgn-label">
                {page + 1} / {totalPages}
              </span>
              <button
                className="pgn-btn"
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages - 1}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      ) : (
        /* ── Map view ── */
        <Map
          ref={mapRef}
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
          initialViewState={{
            longitude: -73.985,
            latitude: 40.73,
            zoom: 12.5,
          }}
          style={{ width: "100%", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/dark-v11"
          attributionControl={false}
        >
          {pins.map((pin) => {
            const { color } = getPinTag(pin);
            return (
              <Marker
                key={pin.id}
                longitude={pin.lng}
                latitude={pin.lat}
                anchor="center"
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  handleMarkerClick(pin);
                }}
              >
                <div
                  className={`map-marker${selectedPin?.id === pin.id ? " active" : ""}`}
                  style={{ "--pin-color": color } as React.CSSProperties}
                >
                  <span className="marker-dot" />
                  <span className="marker-ring" />
                </div>
              </Marker>
            );
          })}

          {selectedPin && (() => {
            const tag = getPinTag(selectedPin);
            return (
              <Popup
                longitude={selectedPin.lng}
                latitude={selectedPin.lat}
                anchor="bottom"
                offset={18}
                closeOnClick={false}
                onClose={() => onSelectPin(null)}
                className="map-popup"
              >
                <div className="popup-inner">
                  <span
                    className="popup-status"
                    style={{ color: tag.color }}
                  >
                    {tag.label}
                  </span>
                  <h3 className="popup-title">{selectedPin.name}</h3>
                  <p className="popup-address">{selectedPin.address}</p>
                  <p className="popup-desc">{selectedPin.description}</p>

                  <div className="popup-meta">
                    <span>{TRAFFIC_LABELS[selectedPin.traffic]}</span>
                    <span>{selectedPin.sqft} sq ft</span>
                    {selectedPin.parcels > 1 && (
                      <span>{selectedPin.parcels} parcels</span>
                    )}
                  </div>

                  <div className="popup-price">
                    <span className="popup-price-label">As low as</span>
                    $333<span>/mo</span>
                  </div>

                  {selectedPin.status === "available" ? (
                    <button
                      className="btn btn-primary popup-cta"
                      onClick={() => onBookPin(selectedPin)}
                    >
                      Lease a Deedz <span className="arrow">→</span>
                    </button>
                  ) : (
                    <div className="popup-cta-soon">Coming Soon</div>
                  )}
                </div>
              </Popup>
            );
          })()}
        </Map>
      )}

      {/* Controls bar: legend (map only) + view toggle */}
      <div className="map-controls-bar">
        {!cardView && (
          <div className="map-legend">
            {LEGEND_ITEMS.map(({ label, color }) => (
              <div key={label} className="legend-item">
                <span className="legend-dot" style={{ background: color }} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        )}
        <button
          className={`map-view-toggle-btn${cardView ? " active" : ""}`}
          onClick={onToggleCardView}
          aria-label={cardView ? "Switch to map view" : "Switch to card view"}
        >
          {cardView ? (
            /* Map icon */
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
              <line x1="8" y1="2" x2="8" y2="18"/>
              <line x1="16" y1="6" x2="16" y2="22"/>
            </svg>
          ) : (
            /* Grid icon */
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
            </svg>
          )}
          <span>{cardView ? "Map" : "Cards"}</span>
        </button>
      </div>
    </div>
  );
}
