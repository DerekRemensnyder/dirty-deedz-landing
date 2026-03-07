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
import SavedTray, { SavedDeedz } from "../../components/map/SavedTray";
import { MAP_PINS, MapPin } from "../../data/map-pins";

export default function MapPage() {
  const [filters, setFilters] = useState<MapFilters>(DEFAULT_FILTERS);
  const [selectedPin, setSelectedPin] = useState<MapPin | null>(null);
  const [bookingPin, setBookingPin] = useState<MapPin | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [cardView, setCardView] = useState(false);
  const [savedDeedz, setSavedDeedz] = useState<SavedDeedz[]>([]);
  const [trayOpen, setTrayOpen] = useState(false);
  const [multiCheckout, setMultiCheckout] = useState(false);

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

  const handleBookPin = useCallback((pin: MapPin) => {
    setBookingPin(pin);
  }, []);

  const handleSavePin = useCallback((pin: MapPin, opts?: { termIndex: number; parcels: number; designOption: "own" | "need_design" }) => {
    setSavedDeedz((prev) => {
      // Toggle: if any parcel from this pin exists, remove ALL parcels for that pin
      if (prev.some((s) => s.pin.id === pin.id)) {
        return prev.filter((s) => s.pin.id !== pin.id);
      }
      const count = opts?.parcels ?? 1;
      const termIndex = opts?.termIndex ?? 0;
      const designOption = opts?.designOption ?? "own";
      // Create N separate items, one per parcel
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
    setSavedDeedz((prev) =>
      prev.filter((s) => `${s.pin.id}-${s.parcelIndex}` !== itemKey)
    );
  }, []);

  const handleUpdateTerm = useCallback((itemKey: string, termIndex: number) => {
    setSavedDeedz((prev) =>
      prev.map((s) =>
        `${s.pin.id}-${s.parcelIndex}` === itemKey ? { ...s, termIndex } : s
      )
    );
  }, []);

  const handleUpdateAdMessage = useCallback((itemKey: string, adMessage: string) => {
    setSavedDeedz((prev) =>
      prev.map((s) =>
        `${s.pin.id}-${s.parcelIndex}` === itemKey ? { ...s, adMessage } : s
      )
    );
  }, []);

  const handleSaveDeedz = useCallback((items: SavedDeedz[]) => {
    if (items.length === 0) return;
    const pinId = items[0].pin.id;
    setSavedDeedz((prev) => [
      ...prev.filter((s) => s.pin.id !== pinId),
      ...items,
    ]);
    setTrayOpen(true);
  }, []);

  const handleTrayCheckout = useCallback(() => {
    if (savedDeedz.length > 0) {
      setMultiCheckout(true);
      setBookingPin(savedDeedz[0].pin); // opens panel; multi flag tells it to show all items
    }
  }, [savedDeedz]);

  const handleEditFromCheckout = useCallback((pin: MapPin) => {
    setMultiCheckout(false);
    setBookingPin(pin);
  }, []);

  const prefillDeedz = useMemo(
    () => savedDeedz.filter((s) => s.pin.id === bookingPin?.id),
    [savedDeedz, bookingPin?.id]
  );

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
        <SavedTray
          items={savedDeedz}
          open={trayOpen}
          onToggle={() => setTrayOpen((p) => !p)}
          onRemove={handleRemoveSaved}
          onUpdateTerm={handleUpdateTerm}
          onUpdateAdMessage={handleUpdateAdMessage}
          onCheckout={handleTrayCheckout}
          cardView={cardView}
          onToggleCardView={() => setCardView((v) => !v)}
        />
      </div>
      <MobileFilters
        pins={MAP_PINS}
        filteredPins={filteredPins}
        filters={filters}
        onFiltersChange={setFilters}
        cardView={cardView}
        onToggleCardView={() => setCardView(v => !v)}
      />
      <BookingPanel
        pin={bookingPin}
        onClose={() => { setBookingPin(null); setMultiCheckout(false); }}
        savedDeedz={savedDeedz}
        onSaveDeedz={handleSaveDeedz}
        multiCheckout={multiCheckout}
        onEditPin={handleEditFromCheckout}
        prefillDeedz={prefillDeedz}
      />
    </div>
  );
}
