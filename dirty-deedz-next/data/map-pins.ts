/* ── Map Pin Data ── */

export type PinStatus = "available" | "coming_soon";

export type TrafficLevel = "high" | "medium" | "low";

export type Neighborhood =
  | "Midtown"
  | "SoHo"
  | "Chelsea"
  | "East Village"
  | "West Village"
  | "Lower East Side"
  | "Financial District"
  | "Tribeca"
  | "Williamsburg"
  | "DUMBO"
  | "Park Slope"
  | "Bushwick"
  | "Flatiron"
  | "NoHo"
  | "Hell's Kitchen";

export type City = "New York" | "Brooklyn" | "Jersey City" | "Hoboken";
export type USState = "NY" | "NJ";

export interface MapPin {
  id: number;
  name: string;
  address: string;
  neighborhood: Neighborhood;
  city: City;
  state: USState;
  lat: number;
  lng: number;
  status: PinStatus;
  traffic: TrafficLevel;
  monthlyPrice: number;
  sqft: number;
  parcels: number;
  description: string;
  images: string[];
}

/* Demo sidewalk images — rotate across pins */
const DEMO_IMAGES = [
  "/demo/sidewalk-1.svg",
  "/demo/sidewalk-2.svg",
  "/demo/sidewalk-3.svg",
];

export const STATUS_COLORS: Record<PinStatus, string> = {
  available: "#d5ff45",
  coming_soon: "#df3257",
};

export const STATUS_LABELS: Record<PinStatus, string> = {
  available: "Available",
  coming_soon: "Coming Soon",
};

export const MULTI_DEEDZ_COLOR = "#00d29a";

export function getPinTag(pin: MapPin): { label: string; color: string } {
  if (pin.parcels > 1) {
    return { label: `Multiple Deedz (${pin.parcels})`, color: MULTI_DEEDZ_COLOR };
  }
  return { label: STATUS_LABELS[pin.status], color: STATUS_COLORS[pin.status] };
}

export const TRAFFIC_LABELS: Record<TrafficLevel, string> = {
  high: "High Traffic",
  medium: "Medium Traffic",
  low: "Low Traffic",
};

export const LEASE_TERMS = [
  {
    months: 2,
    label: "2 Mo",
    name: "THE STREET CRED",
    monthlyRate: 400,
    total: 800,
    savings: 0,
    ownerPayout: 80,
    cta: "Lock It Down",
  },
  {
    months: 4,
    label: "4 Mo",
    name: "THE HUSTLE",
    monthlyRate: 350,
    total: 1400,
    savings: 200,
    ownerPayout: 140,
    cta: "Stake Your Claim",
  },
  {
    months: 6,
    label: "6 Mo",
    name: "THE TAKEOVER",
    monthlyRate: 333,
    total: 2000,
    savings: 400,
    ownerPayout: 200,
    cta: "Take The Block",
  },
];

const RAW_PINS: Omit<MapPin, "images">[] = [
  {
    id: 1, name: "Times Square South", address: "1560 Broadway",
    neighborhood: "Midtown", city: "New York", state: "NY",
    lat: 40.7580, lng: -73.9855, status: "available", traffic: "high",
    monthlyPrice: 1200, sqft: 24, parcels: 3,
    description: "Prime sidewalk space at the crossroads of the world. Massive foot traffic 24/7.",
  },
  {
    id: 2, name: "Herald Square", address: "151 W 34th St",
    neighborhood: "Midtown", city: "New York", state: "NY",
    lat: 40.7484, lng: -73.9878, status: "available", traffic: "high",
    monthlyPrice: 1100, sqft: 20, parcels: 2,
    description: "Right outside Macy's flagship. Shoppers and commuters all day long.",
  },
  {
    id: 3, name: "SoHo Broadway", address: "543 Broadway",
    neighborhood: "SoHo", city: "New York", state: "NY",
    lat: 40.7234, lng: -73.9985, status: "coming_soon", traffic: "high",
    monthlyPrice: 950, sqft: 18, parcels: 1,
    description: "Trendy retail corridor. Fashion-forward crowd, perfect for lifestyle brands.",
  },
  {
    id: 4, name: "Chelsea Market", address: "75 9th Ave",
    neighborhood: "Chelsea", city: "New York", state: "NY",
    lat: 40.7425, lng: -74.0060, status: "available", traffic: "high",
    monthlyPrice: 900, sqft: 22, parcels: 2,
    description: "Foodie destination with steady tourist and local traffic.",
  },
  {
    id: 5, name: "Union Square West", address: "33 Union Square W",
    neighborhood: "Flatiron", city: "New York", state: "NY",
    lat: 40.7359, lng: -73.9911, status: "coming_soon", traffic: "high",
    monthlyPrice: 1050, sqft: 20, parcels: 1,
    description: "Major transit hub and gathering spot. Farmers market draws weekend crowds.",
  },
  {
    id: 6, name: "St. Marks Place", address: "27 St Marks Pl",
    neighborhood: "East Village", city: "New York", state: "NY",
    lat: 40.7281, lng: -73.9893, status: "available", traffic: "medium",
    monthlyPrice: 650, sqft: 16, parcels: 3,
    description: "Iconic East Village strip. Young, creative crowd day and night.",
  },
  {
    id: 7, name: "Bleecker & MacDougal", address: "160 Bleecker St",
    neighborhood: "West Village", city: "New York", state: "NY",
    lat: 40.7283, lng: -74.0004, status: "available", traffic: "medium",
    monthlyPrice: 750, sqft: 14, parcels: 1,
    description: "Classic Village corner. Comedy clubs, cafes, and bar-hopping foot traffic.",
  },
  {
    id: 8, name: "Orchard Street", address: "95 Orchard St",
    neighborhood: "Lower East Side", city: "New York", state: "NY",
    lat: 40.7183, lng: -73.9901, status: "available", traffic: "medium",
    monthlyPrice: 600, sqft: 16, parcels: 1,
    description: "Boutique shopping strip. Young professionals and weekend crowds.",
  },
  {
    id: 9, name: "Wall Street", address: "40 Wall St",
    neighborhood: "Financial District", city: "New York", state: "NY",
    lat: 40.7068, lng: -74.0090, status: "coming_soon", traffic: "high",
    monthlyPrice: 1100, sqft: 22, parcels: 2,
    description: "Financial district power corridor. Weekday suit crowd, tourist weekends.",
  },
  {
    id: 10, name: "Fulton & Broadway", address: "1 Fulton St",
    neighborhood: "Financial District", city: "New York", state: "NY",
    lat: 40.7092, lng: -74.0065, status: "available", traffic: "high",
    monthlyPrice: 950, sqft: 20, parcels: 1,
    description: "Near the Oculus and WTC. Heavy commuter and tourist traffic.",
  },
  {
    id: 11, name: "Tribeca North", address: "375 Greenwich St",
    neighborhood: "Tribeca", city: "New York", state: "NY",
    lat: 40.7205, lng: -74.0107, status: "available", traffic: "medium",
    monthlyPrice: 800, sqft: 18, parcels: 2,
    description: "Upscale neighborhood. Celebrity sightings and high-end dining crowd.",
  },
  {
    id: 12, name: "Bedford Avenue", address: "160 Bedford Ave",
    neighborhood: "Williamsburg", city: "Brooklyn", state: "NY",
    lat: 40.7142, lng: -73.9614, status: "available", traffic: "high",
    monthlyPrice: 750, sqft: 20, parcels: 3,
    description: "Brooklyn's main drag. Hipster central with nonstop foot traffic.",
  },
  {
    id: 13, name: "N 6th & Berry", address: "72 N 6th St",
    neighborhood: "Williamsburg", city: "Brooklyn", state: "NY",
    lat: 40.7178, lng: -73.9583, status: "coming_soon", traffic: "medium",
    monthlyPrice: 650, sqft: 16, parcels: 1,
    description: "Near the waterfront and Smorgasburg. Weekend crowds are massive.",
  },
  {
    id: 14, name: "DUMBO Waterfront", address: "55 Washington St",
    neighborhood: "DUMBO", city: "Brooklyn", state: "NY",
    lat: 40.7025, lng: -73.9899, status: "available", traffic: "medium",
    monthlyPrice: 850, sqft: 18, parcels: 2,
    description: "Instagram-famous location under the bridge. Tourists love it here.",
  },
  {
    id: 15, name: "Front Street DUMBO", address: "68 Front St",
    neighborhood: "DUMBO", city: "Brooklyn", state: "NY",
    lat: 40.7024, lng: -73.9862, status: "coming_soon", traffic: "medium",
    monthlyPrice: 800, sqft: 16, parcels: 1,
    description: "Cobblestone charm meets tech offices. Great weekday lunch traffic.",
  },
  {
    id: 16, name: "5th Ave Park Slope", address: "200 5th Ave",
    neighborhood: "Park Slope", city: "Brooklyn", state: "NY",
    lat: 40.6732, lng: -73.9800, status: "available", traffic: "medium",
    monthlyPrice: 600, sqft: 18, parcels: 2,
    description: "Family-friendly main street. Stroller brigade on weekends.",
  },
  {
    id: 17, name: "7th Ave Park Slope", address: "350 7th Ave",
    neighborhood: "Park Slope", city: "Brooklyn", state: "NY",
    lat: 40.6688, lng: -73.9820, status: "available", traffic: "medium",
    monthlyPrice: 550, sqft: 14, parcels: 1,
    description: "Local shopping corridor. Loyal neighborhood regulars.",
  },
  {
    id: 18, name: "Bushwick Collective", address: "404 Jefferson St",
    neighborhood: "Bushwick", city: "Brooklyn", state: "NY",
    lat: 40.7038, lng: -73.9271, status: "available", traffic: "low",
    monthlyPrice: 400, sqft: 24, parcels: 4,
    description: "Street art corridor. Creative crowd, great for edgy brands.",
  },
  {
    id: 19, name: "Flatiron Plaza", address: "190 5th Ave",
    neighborhood: "Flatiron", city: "New York", state: "NY",
    lat: 40.7411, lng: -73.9897, status: "coming_soon", traffic: "high",
    monthlyPrice: 1000, sqft: 20, parcels: 1,
    description: "Iconic landmark area. Tourists snap photos all day.",
  },
  {
    id: 20, name: "NoHo Bowery", address: "315 Bowery",
    neighborhood: "NoHo", city: "New York", state: "NY",
    lat: 40.7261, lng: -73.9927, status: "available", traffic: "medium",
    monthlyPrice: 700, sqft: 16, parcels: 1,
    description: "Art gallery row meets nightlife. Great evening foot traffic.",
  },
  {
    id: 21, name: "Hell's Kitchen 9th", address: "615 9th Ave",
    neighborhood: "Hell's Kitchen", city: "New York", state: "NY",
    lat: 40.7600, lng: -73.9936, status: "available", traffic: "medium",
    monthlyPrice: 700, sqft: 18, parcels: 2,
    description: "Restaurant row adjacent. Pre-theater dinner crowds nightly.",
  },
  {
    id: 22, name: "Penn Station South", address: "360 W 31st St",
    neighborhood: "Midtown", city: "New York", state: "NY",
    lat: 40.7500, lng: -73.9937, status: "coming_soon", traffic: "high",
    monthlyPrice: 1000, sqft: 22, parcels: 3,
    description: "Major transit hub. Commuter rush makes this a visibility goldmine.",
  },
  {
    id: 23, name: "Grand Central East", address: "109 E 42nd St",
    neighborhood: "Midtown", city: "New York", state: "NY",
    lat: 40.7527, lng: -73.9772, status: "available", traffic: "high",
    monthlyPrice: 1150, sqft: 20, parcels: 1,
    description: "Grand Central spillover. Suited professionals and tourists.",
  },
  {
    id: 24, name: "SoHo Prince St", address: "114 Prince St",
    neighborhood: "SoHo", city: "New York", state: "NY",
    lat: 40.7253, lng: -73.9975, status: "available", traffic: "high",
    monthlyPrice: 950, sqft: 18, parcels: 2,
    description: "Luxury retail block. Brand-conscious shoppers everywhere.",
  },
  {
    id: 25, name: "Rivington & Essex", address: "100 Rivington St",
    neighborhood: "Lower East Side", city: "New York", state: "NY",
    lat: 40.7195, lng: -73.9872, status: "coming_soon", traffic: "medium",
    monthlyPrice: 550, sqft: 16, parcels: 1,
    description: "Nightlife hub. After-dark foot traffic is off the charts.",
  },
];

export const MAP_PINS: MapPin[] = RAW_PINS.map((pin) => ({
  ...pin,
  images: [
    DEMO_IMAGES[pin.id % 3],
    DEMO_IMAGES[(pin.id + 1) % 3],
    DEMO_IMAGES[(pin.id + 2) % 3],
  ],
}));

export const ALL_NEIGHBORHOODS: Neighborhood[] = [
  ...new Set(MAP_PINS.map((p) => p.neighborhood)),
] as Neighborhood[];

export const ALL_CITIES: City[] = [
  ...new Set(MAP_PINS.map((p) => p.city)),
] as City[];

export const ALL_STATES: USState[] = [
  ...new Set(MAP_PINS.map((p) => p.state)),
] as USState[];
