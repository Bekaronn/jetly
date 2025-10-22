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

/**
 * Выполняет поиск авиарейсов через Amadeus API.
 */
export async function searchFlights(
  params: SearchFlightsParams
): Promise<AmadeusResponse> {
  const token = "oWT37HuBWPEpP9R2SCSgpwEk3Ksv"; // ⚠️ временный токен

  const url = new URL("https://test.api.amadeus.com/v2/shopping/flight-offers");

  // добавляем параметры в запрос
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
    throw new Error(`Ошибка запроса: ${res.status} ${res.statusText}`);
  }

  const data: AmadeusResponse = await res.json();
  return data;
}
