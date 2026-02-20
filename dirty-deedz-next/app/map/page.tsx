"use client";

import { Suspense, useState, useMemo, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Nav from "../../components/Nav";
import MapView from "../../components/map/MapView";
import MapSidebar, {
  MapFilters,
  DEFAULT_FILTERS,
} from "../../components/map/MapSidebar";
import BookingPanel from "../../components/map/BookingPanel";
import ListingPanel from "../../components/map/ListingPanel";
import { MAP_PINS, MapPin } from "../../data/map-pins";

function MapPageInner() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<MapFilters>(DEFAULT_FILTERS);
  const [selectedPin, setSelectedPin] = useState<MapPin | null>(null);
  const [bookingPin, setBookingPin] = useState<MapPin | null>(null);
  const [listingOpen, setListingOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [cardView, setCardView] = useState(false);

  useEffect(() => {
    if (searchParams.get("list") === "true") {
      setListingOpen(true);
    }
  }, [searchParams]);

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

  const handleSelectPin = useCallback((pin: MapPin | null) => {
    setSelectedPin(pin);
  }, []);

  const handleBookPin = useCallback((pin: MapPin) => {
    setBookingPin(pin);
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
          onListDeedz={() => setListingOpen(true)}
        />
        <MapView
          pins={filteredPins}
          selectedPin={selectedPin}
          onSelectPin={handleSelectPin}
          onBookPin={handleBookPin}
          cardView={cardView}
          onToggleCardView={() => setCardView(v => !v)}
        />
      </div>
      <BookingPanel pin={bookingPin} onClose={() => setBookingPin(null)} />
      <ListingPanel open={listingOpen} onClose={() => setListingOpen(false)} />
    </div>
  );
}

export default function MapPage() {
  return (
    <Suspense>
      <MapPageInner />
    </Suspense>
  );
}
