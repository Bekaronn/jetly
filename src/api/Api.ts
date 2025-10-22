import axios from "axios";
import { getAmadeusToken, type AmadeusResponse, type SearchFlightsParams } from "./amadeus";
import type { Location } from "@/types";

export const fetchLocations = async (keyword: string): Promise<Location[]> => {
    if (!keyword) return []; 
  
    const token = await getAmadeusToken();
    const response = await axios.get<{ data: Location[] }>(
      "https://test.api.amadeus.com/v1/reference-data/locations",
      {
        params: { subType: "CITY,AIRPORT", keyword, "page[limit]": 8, view: "LIGHT" },
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data.data;
  };


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