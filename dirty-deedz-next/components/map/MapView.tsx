"use client";

import { useRef, useCallback } from "react";
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
}

const LEGEND_ITEMS = [
  { label: "Available", color: STATUS_COLORS.available },
  { label: "Multiple Deedz", color: MULTI_DEEDZ_COLOR },
  { label: "Coming Soon", color: STATUS_COLORS.coming_soon },
];

export default function MapView({
  pins,
  selectedPin,
  onSelectPin,
  onBookPin,
}: MapViewProps) {
  const mapRef = useRef<MapRef>(null);

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

                {selectedPin.status === "available" && (
                  <button
                    className="btn btn-primary popup-cta"
                    onClick={() => onBookPin(selectedPin)}
                  >
                    Lease a Deedz
                  </button>
                )}
              </div>
            </Popup>
          );
        })()}
      </Map>

      {/* Legend */}
      <div className="map-legend">
        {LEGEND_ITEMS.map(({ label, color }) => (
          <div key={label} className="legend-item">
            <span className="legend-dot" style={{ background: color }} />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
