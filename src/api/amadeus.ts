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

export async function searchFlights(
  params: SearchFlightsParams
): Promise<AmadeusResponse> {
  const token = await getAmadeusToken();

  const url = new URL("https://test.api.amadeus.com/v2/shopping/flight-offers");

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.append(key, String(value));
    }
  }

  url.searchParams.append("max", "50");
  url.searchParams.append("nonStop", "false");

  const res = await fetch(url.toString(), {
    headers: {
      Accept: "application/vnd.amadeus+json",
      Authorization: `Bearer ${token}`,  
    },
  });

  if (!res.ok) {
    const errorBody = await res.text();
    console.error("Ошибка при поиске рейсов:", errorBody);
    throw new Error(`Ошибка запроса: ${res.status} ${res.statusText}`);
  }

  const data: AmadeusResponse = await res.json();
  
  return data;
}