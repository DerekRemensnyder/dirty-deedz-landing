"use client";

import { useState, useMemo, useCallback } from "react";
import Nav from "../../components/Nav";
import MapView from "../../components/map/MapView";
import MapSidebar, {
  MapFilters,
  DEFAULT_FILTERS,
} from "../../components/map/MapSidebar";
import MobileFilters from "../../components/map/MobileFilters";
import BookingPanel from "../../components/map/BookingPanel";
import CheckoutDrawer from "../../components/map/CheckoutDrawer";
import { type SavedDeedz } from "../../components/map/SavedTray";
import { MAP_PINS, MapPin } from "../../data/map-pins";

export default function MapPage() {
  const [filters, setFilters] = useState<MapFilters>(DEFAULT_FILTERS);
  const [selectedPin, setSelectedPin] = useState<MapPin | null>(null);
  const [bookingPin, setBookingPin] = useState<MapPin | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [cardView, setCardView] = useState(false);
  const [savedDeedz, setSavedDeedz] = useState<SavedDeedz[]>([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const filteredPins = useMemo(() => {
    return MAP_PINS.filter((pin) => {
      if (filters.status.length > 0 && !filters.status.includes(pin.status))
        return false;
      if (
        filters.neighborhood.length > 0 &&
        !filters.neighborhood.includes(pin.neighborhood)
      )
        return false;
      if (filters.traffic.length > 0 && !filters.traffic.includes(pin.traffic))
        return false;
      if (filters.state && pin.state !== filters.state) return false;
      if (filters.city && pin.city !== filters.city) return false;
      if (filters.multiDeedz && pin.parcels < 2) return false;
      return true;
    });
  }, [filters]);

  const savedIds = useMemo(
    () => new Set(savedDeedz.map((s) => s.pin.id)),
    [savedDeedz]
  );

  const handleSelectPin = useCallback((pin: MapPin | null) => {
    setSelectedPin(pin);
  }, []);

  // Opening a pin for booking closes the checkout drawer
  const handleBookPin = useCallback((pin: MapPin) => {
    setBookingPin(pin);
    setCheckoutOpen(false);
  }, []);

  const handleSavePin = useCallback((pin: MapPin, opts?: { termIndex: number; parcels: number; designOption: "own" | "need_design" }) => {
    setSavedDeedz((prev) => {
      if (prev.some((s) => s.pin.id === pin.id)) {
        return prev.filter((s) => s.pin.id !== pin.id);
      }
      const count = opts?.parcels ?? 1;
      const termIndex = opts?.termIndex ?? 0;
      const designOption = opts?.designOption ?? "own";
      const newItems: SavedDeedz[] = [];
      for (let i = 1; i <= count; i++) {
        newItems.push({
          pin,
          termIndex,
          parcels: pin.parcels,
          parcelIndex: i,
          designOption,
          adMessage: "",
        });
      }
      return [...prev, ...newItems];
    });
  }, []);

  const handleRemoveSaved = useCallback((itemKey: string) => {
    setSavedDeedz((prev) => {
      const next = prev.filter((s) => `${s.pin.id}-${s.parcelIndex}` !== itemKey);
      if (next.length === 0) setCheckoutOpen(false);
      return next;
    });
  }, []);

  const handleUpdateTerm = useCallback((itemKey: string, termIndex: number) => {
    setSavedDeedz((prev) =>
      prev.map((s) =>
        `${s.pin.id}-${s.parcelIndex}` === itemKey ? { ...s, termIndex } : s
      )
    );
  }, []);

  // Called from BookingPanel "Save to Checkout" — opens checkout drawer
  const handleSaveDeedz = useCallback((items: SavedDeedz[]) => {
    if (items.length === 0) return;
    const pinId = items[0].pin.id;
    setSavedDeedz((prev) => [
      ...prev.filter((s) => s.pin.id !== pinId),
      ...items,
    ]);
    setBookingPin(null);   // close booking panel
    setCheckoutOpen(true); // open checkout drawer
  }, []);

  return (
    <div className="map-page">
      <Nav />
      <div className="map-layout">
        <MapSidebar
          pins={MAP_PINS}
          filteredPins={filteredPins}
          filters={filters}
          onFiltersChange={setFilters}
          open={sidebarOpen}
          onToggle={() => setSidebarOpen((p) => !p)}
        />
        <MapView
          pins={filteredPins}
          selectedPin={selectedPin}
          onSelectPin={handleSelectPin}
          onBookPin={handleBookPin}
          onSavePin={handleSavePin}
          savedIds={savedIds}
          cardView={cardView}
          onToggleCardView={() => setCardView(v => !v)}
        />
      </div>
      <MobileFilters
        pins={MAP_PINS}
        filteredPins={filteredPins}
        filters={filters}
        onFiltersChange={setFilters}
        cardView={cardView}
        onToggleCardView={() => setCardView(v => !v)}
        savedCount={savedDeedz.length}
        onOpenCheckout={() => setCheckoutOpen(true)}
      />
      <BookingPanel
        pin={bookingPin}
        onClose={() => setBookingPin(null)}
        onSaveDeedz={handleSaveDeedz}
      />
      <CheckoutDrawer
        savedDeedz={savedDeedz}
        open={checkoutOpen}
        onToggle={() => setCheckoutOpen(v => !v)}
        onAddMore={() => setCheckoutOpen(false)}
        onRemoveSaved={handleRemoveSaved}
        onUpdateTerm={handleUpdateTerm}
      />
    </div>
  );
}
