
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