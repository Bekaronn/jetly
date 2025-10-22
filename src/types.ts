export interface SearchFlightsParams {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children?: number;
  infants?: number;
  travelClass?: "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST";
}

export interface FlightOfferResponse {
  id: string;
  type: string;
  source: string;
  instantTicketingRequired: boolean;
  nonHomogeneous: boolean;
  lastTicketingDate: string;
  itineraries?: any[];
  price?: {
    total: string;
    currency: string;
  };
  travelerPricings?: any[];
  [key: string]: any; // fallback
}

export interface FligtsResponse {
  data: FlightOfferResponse[];
  meta?: Record<string, any>;
  dictionaries?: Record<string, any>;
}




interface FlightSegment {
  departure: { iataCode: string; at: string };
  arrival: { iataCode: string; at: string };
  carrierCode: string;
  number: string;
  duration?: string;
  aircraft?: { code?: string };
}

interface Itinerary {
  duration?: string;
  segments: FlightSegment[];
}

interface Price {
  total: string;
  currency: string;
}

export interface FlightOffer {
  itineraries: Itinerary[];
  validatingAirlineCodes?: string[];
  numberOfBookableSeats?: number;
  price?: Price;
  travelerPricings?: TravelerPricing[];
}

export interface TravelerPricing {
  travelerType: string; // ADULT, CHILD, INFANT
  price: { total: string; base: string; currency: string };
}

export interface FlightCardProps {
  offer: FlightOffer;
}

export interface FlightSearchFormProps {
  onSearch: (params: {
    origin: string
    destination: string
    departDate?: Date
    returnDate?: Date
    passengers: {
      adults: number
      children: number
      infants: number
    }
  }) => void
  req: {
    loading: boolean
    error: boolean
  }
}


export interface Location {
  id: string
  iataCode: string
  name: string
  subType: "CITY" | "AIRPORT"
  address?: {
    cityName?: string
    countryName?: string
  }
}

export interface LocationSearchProps {
  label?: string
  placeholder?: string
  onSelect: (location: Location) => void
}
