"use client";

import { useState, useMemo } from "react";
import {
  MapPin,
  PinStatus,
  TrafficLevel,
  Neighborhood,
  STATUS_COLORS,
  MULTI_DEEDZ_COLOR,
  TRAFFIC_LABELS,
  ALL_NEIGHBORHOODS,
  ALL_STATES,
  ALL_CITIES,
  City,
  USState,
} from "../../data/map-pins";
import { MapFilters, DEFAULT_FILTERS } from "./MapSidebar";

interface MobileFiltersProps {
  pins: MapPin[];
  filteredPins: MapPin[];
  filters: MapFilters;
  onFiltersChange: (f: MapFilters) => void;
  cardView: boolean;
  onToggleCardView: () => void;
}

export default function MobileFilters({
  pins,
  filters,
  onFiltersChange,
  cardView,
  onToggleCardView,
}: MobileFiltersProps) {
  const [neighborhoodOpen, setNeighborhoodOpen] = useState(false);
  const [trafficOpen, setTrafficOpen] = useState(false);

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

  const stateCounts = useMemo(() => {
    const c: Record<string, number> = {};
    pins.forEach((p) => { c[p.state] = (c[p.state] || 0) + 1; });
    return c;
  }, [pins]);

  const cityCounts = useMemo(() => {
    const c: Record<string, number> = {};
    const subset = filters.state ? pins.filter((p) => p.state === filters.state) : pins;
    subset.forEach((p) => { c[p.city] = (c[p.city] || 0) + 1; });
    return c;
  }, [pins, filters.state]);

  const citiesForState = useMemo(() => {
    if (!filters.state) return ALL_CITIES;
    const set = new Set(pins.filter((p) => p.state === filters.state).map((p) => p.city));
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
    !!filters.state ||
    !!filters.city ||
    filters.multiDeedz;

  return (
    <div className="mobile-filters">
      {/* Header: Browse Deedz + view toggle */}
      <div className="mf-header">
        <h2 className="mf-title">Browse Deedz</h2>
        <button className="mf-view-toggle" onClick={onToggleCardView} aria-label={cardView ? "Switch to map" : "Switch to cards"}>
          {cardView ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
              <line x1="8" y1="2" x2="8" y2="18"/>
              <line x1="16" y1="6" x2="16" y2="22"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1"/>
              <rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/>
              <rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
          )}
          {cardView ? "Map" : "Cards"}
        </button>
      </div>

      {/* Location */}
      <div className="mf-section">
        <label className="mf-label">Location</label>
        <div className="mf-select-row">
          <select
            className="mf-select"
            value={filters.state}
            onChange={(e) =>
              onFiltersChange({ ...filters, state: e.target.value as USState | "", city: "", neighborhood: [] })
            }
          >
            <option value="">All States</option>
            {ALL_STATES.map((s) => (
              <option key={s} value={s}>{s} ({stateCounts[s] || 0})</option>
            ))}
          </select>
          <select
            className="mf-select"
            value={filters.city}
            onChange={(e) =>
              onFiltersChange({ ...filters, city: e.target.value as City | "", neighborhood: [] })
            }
          >
            <option value="">All Cities</option>
            {citiesForState.map((c) => (
              <option key={c} value={c}>{c} ({cityCounts[c] || 0})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Status chips */}
      <div className="mf-section">
        <label className="mf-label">Status</label>
        <div className="mf-chips">
          <button
            className={`mf-chip${filters.status.length === 0 && !filters.multiDeedz ? " active" : ""}`}
            onClick={() => onFiltersChange({ ...filters, status: [], multiDeedz: false })}
          >
            View All ({pins.length})
          </button>
          <button
            className={`mf-chip${filters.status.includes("available") ? " active" : ""}`}
            style={filters.status.includes("available") ? { borderColor: STATUS_COLORS.available, color: STATUS_COLORS.available } : undefined}
            onClick={() => onFiltersChange({ ...filters, status: toggleChip(filters.status, "available" as PinStatus) })}
          >
            <span className="mf-chip-dot" style={{ background: STATUS_COLORS.available }} />
            Available ({counts.available || 0})
          </button>
          <button
            className={`mf-chip${filters.multiDeedz ? " active" : ""}`}
            style={filters.multiDeedz ? { borderColor: MULTI_DEEDZ_COLOR, color: MULTI_DEEDZ_COLOR } : undefined}
            onClick={() => onFiltersChange({ ...filters, multiDeedz: !filters.multiDeedz })}
          >
            <span className="mf-chip-dot" style={{ background: MULTI_DEEDZ_COLOR }} />
            Multiple Deedz ({counts._multi || 0})
          </button>
          <button
            className={`mf-chip${filters.status.includes("coming_soon") ? " active" : ""}`}
            style={filters.status.includes("coming_soon") ? { borderColor: STATUS_COLORS.coming_soon, color: STATUS_COLORS.coming_soon } : undefined}
            onClick={() => onFiltersChange({ ...filters, status: toggleChip(filters.status, "coming_soon" as PinStatus) })}
          >
            <span className="mf-chip-dot" style={{ background: STATUS_COLORS.coming_soon }} />
            Coming Soon ({counts.coming_soon || 0})
          </button>
        </div>
      </div>

      {/* Neighborhood accordion */}
      <div className="mf-accordion">
        <button className="mf-accordion-hd" onClick={() => setNeighborhoodOpen((v) => !v)}>
          Neighborhood
          <span className={`mf-accordion-icon${neighborhoodOpen ? " open" : ""}`}>+</span>
        </button>
        {neighborhoodOpen && (
          <div className="mf-chips mf-chips--pad">
            {neighborhoodsForCity.map((n) => (
              <button
                key={n}
                className={`mf-chip${filters.neighborhood.includes(n) ? " active" : ""}`}
                onClick={() =>
                  onFiltersChange({ ...filters, neighborhood: toggleChip(filters.neighborhood, n) })
                }
              >
                {n}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Foot Traffic accordion */}
      <div className="mf-accordion">
        <button className="mf-accordion-hd" onClick={() => setTrafficOpen((v) => !v)}>
          Foot Traffic
          <span className={`mf-accordion-icon${trafficOpen ? " open" : ""}`}>+</span>
        </button>
        {trafficOpen && (
          <div className="mf-chips mf-chips--pad">
            {(Object.keys(TRAFFIC_LABELS) as TrafficLevel[]).map((t) => (
              <button
                key={t}
                className={`mf-chip${filters.traffic.includes(t) ? " active" : ""}`}
                onClick={() =>
                  onFiltersChange({ ...filters, traffic: toggleChip(filters.traffic, t) })
                }
              >
                {TRAFFIC_LABELS[t]}
              </button>
            ))}
          </div>
        )}
      </div>

      {hasActiveFilters && (
        <button className="mf-clear" onClick={() => onFiltersChange(DEFAULT_FILTERS)}>
          Clear all filters
        </button>
      )}
    </div>
  );
}
