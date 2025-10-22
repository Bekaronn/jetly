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

export interface FlightOffer {
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

export interface AmadeusResponse {
  data: FlightOffer[];
  meta?: Record<string, any>;
  dictionaries?: Record<string, any>;
}

let accessToken: string | null = null;
let tokenExpiryTime: number = 0;

export async function getAmadeusToken(): Promise<string> {
  if (accessToken && Date.now() < tokenExpiryTime) {
    return accessToken;
  }

  const API_KEY = "zGih8vQCD4EjA3XVZ0UHn3f46xDjiWph"
  const API_SECRET = "GjKrjwsgfupkPu5C"

  if (!API_KEY || !API_SECRET) {
    throw new Error("API Key или Secret не найдены в .env файле.");
  }

  const response = await fetch("https://test.api.amadeus.com/v1/security/oauth2/token", {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=client_credentials&client_id=${API_KEY}&client_secret=${API_SECRET}`
  });

  if (!response.ok) {
    throw new Error("Ошибка получения токена Amadeus.");
  }

  const data = await response.json();
  accessToken = data.access_token;
  tokenExpiryTime = Date.now() + (data.expires_in - 300) * 1000;

  return accessToken!;
}

