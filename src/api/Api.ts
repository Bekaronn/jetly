import axios from "axios";
import type { Location, FligtsResponse, SearchFlightsParams, FlightOfferResponse, FlightSegment } from "@/types";

const AMADEUS_BASE = "https://test.api.amadeus.com";
const ACCESS_TOKEN = import.meta.env.VITE_AMADEUS_ACCESS_TOKEN;

if (!ACCESS_TOKEN) throw new Error("VITE_AMADEUS_ACCESS_TOKEN не настроен в .env");

export const fetchLocations = async (keyword: string): Promise<Location[]> => {
  if (!keyword) return [];

  const response = await axios.get<{ data: any[] }>(`${AMADEUS_BASE}/v1/reference-data/locations`, {
    params: { subType: "CITY,AIRPORT", keyword, "page[limit]": 8, view: "LIGHT" },
    headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
  });
  return response.data.data;
};


export async function searchFlights(
  params: SearchFlightsParams
): Promise<FligtsResponse> {

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
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
  });

  if (!res.ok) {
    const errorBody = await res.text();
    console.error("Ошибка при поиске рейсов:", errorBody);
    throw new Error(`Ошибка запроса: ${res.status} ${res.statusText}`);
  }

  const data: FligtsResponse = await res.json();

  const dictionaries = data.dictionaries;

  const enrichedFlights: FlightOfferResponse[] = data.data.map((flight) => {
    const itineraries = flight.itineraries?.map((itinerary) => {
      const segments: FlightSegment[] = itinerary.segments.map((segment) => {
        const departureInfo = dictionaries?.locations?.[segment.departure.iataCode];
        const arrivalInfo = dictionaries?.locations?.[segment.arrival.iataCode];
        const carrierName = dictionaries?.carriers?.[segment.carrierCode] ?? segment.carrierCode;
        const aircraftName = dictionaries?.aircraft?.[segment.aircraft?.code ?? ""] ?? segment.aircraft?.code ?? "";

        return {
          ...segment,
          departureCity: departureInfo?.cityCode ?? segment.departure.iataCode,
          departureCountry: departureInfo?.countryCode ?? "",
          arrivalCity: arrivalInfo?.cityCode ?? segment.arrival.iataCode,
          arrivalCountry: arrivalInfo?.countryCode ?? "",
          carrierName,
          aircraftName,
        };
      });

      return { ...itinerary, segments };
    }) ?? []; // если itineraries = undefined, вернем пустой массив

    return { ...flight, itineraries };
  });

  console.log(enrichedFlights)

  return { ...data, data: enrichedFlights };
}
