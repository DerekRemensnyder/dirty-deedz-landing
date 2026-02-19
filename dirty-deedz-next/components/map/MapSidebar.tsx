"use client";

import { useMemo } from "react";
import {
  MapPin,
  PinStatus,
  TrafficLevel,
  Neighborhood,
  City,
  USState,
  STATUS_COLORS,
  STATUS_LABELS,
  MULTI_DEEDZ_COLOR,
  TRAFFIC_LABELS,
  ALL_NEIGHBORHOODS,
  ALL_CITIES,
  ALL_STATES,
} from "../../data/map-pins";

export interface MapFilters {
  status: PinStatus[];
  neighborhood: Neighborhood[];
  traffic: TrafficLevel[];
  state: USState | "";
  city: City | "";
  multiDeedz: boolean;
}

export const DEFAULT_FILTERS: MapFilters = {
  status: [],
  neighborhood: [],
  traffic: [],
  state: "",
  city: "",
  multiDeedz: false,
};

interface MapSidebarProps {
  pins: MapPin[];
  filteredPins: MapPin[];
  filters: MapFilters;
  onFiltersChange: (f: MapFilters) => void;
  selectedPin: MapPin | null;
  onSelectPin: (pin: MapPin) => void;
  open: boolean;
  onToggle: () => void;
  onListDeedz: () => void;
}

export default function MapSidebar({
  pins,
  filteredPins,
  filters,
  onFiltersChange,
  selectedPin,
  onSelectPin,
  open,
  onToggle,
  onListDeedz,
}: MapSidebarProps) {
  const counts = useMemo(() => {
    const s: Record<string, number> = {};
    let multi = 0;
    pins.forEach((p) => {
      s[p.status] = (s[p.status] || 0) + 1;
      if (p.parcels > 1) multi++;
    });
    s._multi = multi;
    return s;
  }, [pins]);

  const citiesForState = useMemo(() => {
    if (!filters.state) return ALL_CITIES;
    const set = new Set(
      pins.filter((p) => p.state === filters.state).map((p) => p.city)
    );
    return ALL_CITIES.filter((c) => set.has(c));
  }, [pins, filters.state]);

  const neighborhoodsForCity = useMemo(() => {
    let subset = pins;
    if (filters.state) subset = subset.filter((p) => p.state === filters.state);
    if (filters.city) subset = subset.filter((p) => p.city === filters.city);
    const set = new Set(subset.map((p) => p.neighborhood));
    return ALL_NEIGHBORHOODS.filter((n) => set.has(n));
  }, [pins, filters.state, filters.city]);

  const toggleChip = <T extends string>(arr: T[], val: T): T[] =>
    arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

  const hasActiveFilters =
    filters.status.length > 0 ||
    filters.neighborhood.length > 0 ||
    filters.traffic.length > 0 ||
    filters.state !== "" ||
    filters.city !== "" ||
    filters.multiDeedz;

  return (
    <>
      {/* Mobile toggle */}
      <button
        className={`sidebar-toggle${open ? " open" : ""}`}
        onClick={onToggle}
        aria-label="Toggle sidebar"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M3 6h14M3 10h14M3 14h14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <span>{filteredPins.length} Deedz</span>
      </button>

      <aside className={`map-sidebar${open ? " open" : ""}`}>
        <div className="sidebar-header">
          <h2>Browse Deedz</h2>
          <span className="sidebar-count">{filteredPins.length} locations</span>
        </div>

        {/* Action buttons */}
        <div className="sidebar-actions">
          <button
            className="sidebar-action-btn lease"
            onClick={() => {
              const availablePin = filteredPins.find(
                (p) => p.status === "available"
              );
              if (availablePin) onSelectPin(availablePin);
            }}
          >
            <span className="sidebar-action-label">Advertiser</span>
            Lease a Deedz
          </button>
          <button
            className="sidebar-action-btn list"
            onClick={onListDeedz}
          >
            <span className="sidebar-action-label">Property Owner</span>
            List Your Deedz
          </button>
        </div>

        {/* State + City dropdowns */}
        <div className="filter-group">
          <label>Location</label>
          <div className="filter-location-row">
            <select
              className="filter-select"
              value={filters.state}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  state: e.target.value as USState | "",
                  city: "",
                  neighborhood: [],
                })
              }
            >
              <option value="">All States</option>
              {ALL_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select
              className="filter-select"
              value={filters.city}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  city: e.target.value as City | "",
                  neighborhood: [],
                })
              }
            >
              <option value="">All Cities</option>
              {citiesForState.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status filters */}
        <div className="filter-group">
          <label>Status</label>
          <div className="filter-chips">
            {/* Available */}
            <button
              className={`chip${filters.status.includes("available") ? " active" : ""}`}
              style={
                filters.status.includes("available")
                  ? { borderColor: STATUS_COLORS.available, color: STATUS_COLORS.available }
                  : undefined
              }
              onClick={() =>
                onFiltersChange({
                  ...filters,
                  status: toggleChip(filters.status, "available" as PinStatus),
                })
              }
            >
              <span className="chip-dot" style={{ background: STATUS_COLORS.available }} />
              Available ({counts.available || 0})
            </button>
            {/* Multiple Deedz */}
            <button
              className={`chip${filters.multiDeedz ? " active" : ""}`}
              style={
                filters.multiDeedz
                  ? { borderColor: MULTI_DEEDZ_COLOR, color: MULTI_DEEDZ_COLOR }
                  : undefined
              }
              onClick={() =>
                onFiltersChange({ ...filters, multiDeedz: !filters.multiDeedz })
              }
            >
              <span className="chip-dot" style={{ background: MULTI_DEEDZ_COLOR }} />
              Multiple Deedz ({counts._multi || 0})
            </button>
            {/* Coming Soon */}
            <button
              className={`chip${filters.status.includes("coming_soon") ? " active" : ""}`}
              style={
                filters.status.includes("coming_soon")
                  ? { borderColor: STATUS_COLORS.coming_soon, color: STATUS_COLORS.coming_soon }
                  : undefined
              }
              onClick={() =>
                onFiltersChange({
                  ...filters,
                  status: toggleChip(filters.status, "coming_soon" as PinStatus),
                })
              }
            >
              <span className="chip-dot" style={{ background: STATUS_COLORS.coming_soon }} />
              Coming Soon ({counts.coming_soon || 0})
            </button>
          </div>
        </div>

        {/* Neighborhood filters */}
        <div className="filter-group">
          <label>Neighborhood</label>
          <div className="filter-chips">
            {neighborhoodsForCity.map((n) => (
              <button
                key={n}
                className={`chip${filters.neighborhood.includes(n) ? " active" : ""}`}
                onClick={() =>
                  onFiltersChange({
                    ...filters,
                    neighborhood: toggleChip(filters.neighborhood, n),
                  })
                }
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Traffic filters */}
        <div className="filter-group">
          <label>Foot Traffic</label>
          <div className="filter-chips">
            {(Object.keys(TRAFFIC_LABELS) as TrafficLevel[]).map((t) => (
              <button
                key={t}
                className={`chip${filters.traffic.includes(t) ? " active" : ""}`}
                onClick={() =>
                  onFiltersChange({
                    ...filters,
                    traffic: toggleChip(filters.traffic, t),
                  })
                }
              >
                {TRAFFIC_LABELS[t]}
              </button>
            ))}
          </div>
        </div>

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            className="clear-filters"
            onClick={() => onFiltersChange(DEFAULT_FILTERS)}
          >
            Clear all filters
          </button>
        )}

        {/* Pin list */}
        <div className="pin-list">
          {filteredPins.map((pin) => (
            <button
              key={pin.id}
              className={`pin-card${selectedPin?.id === pin.id ? " active" : ""}`}
              onClick={() => onSelectPin(pin)}
            >
              <div className="pin-card-top">
                <span
                  className="pin-card-dot"
                  style={{ background: STATUS_COLORS[pin.status] }}
                />
                <span className="pin-card-name">{pin.name}</span>
                {pin.parcels > 1 && (
                  <span className="pin-card-parcels">
                    {pin.parcels} deedz
                  </span>
                )}
              </div>
              <div className="pin-card-bottom">
                <span>{pin.neighborhood}</span>
                <span>{TRAFFIC_LABELS[pin.traffic]}</span>
                <span>{pin.sqft} sqft</span>
              </div>
            </button>
          ))}
          {filteredPins.length === 0 && (
            <p className="pin-list-empty">
              No locations match your filters. Try adjusting above.
            </p>
          )}
        </div>
      </aside>
    </>
  );
}
