import { useState } from "react"
import { FlightSearchForm } from "../components/FlightSearchForm"
import FlightCard from "../components/FlightCard"
import { type FligtsResponse } from "../types.ts";
import { useQuery } from "@/hooks/useQuery.ts";
import type { FlightOffer } from "../types.ts";
import { searchFlights } from "@/api/Api.ts";

export default function SearchFlights() {
  const [params, setParams] = useState<any>(null);

  const {
    data: flightsResponse,
    isLoading,
    error,
  } = useQuery<FligtsResponse>(
    () => searchFlights(params!),
    [params],
    { enabled: !!params }
  );

  const handleSearch = ({
    origin,
    destination,
    departDate,
    returnDate,
    passengers,
  }: any) => {
    // adults
    const adultsCount =
      typeof passengers === "object"
        ? Number(passengers.adults ?? passengers.value ?? 1)
        : Number(passengers ?? 1);

    // children
    const childrenCount =
      typeof passengers === "object" ? Number(passengers.children ?? 0) : 0;

    // infants
    const infantsCount =
      typeof passengers === "object" ? Number(passengers.infants ?? 0) : 0;

    setParams({
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate: departDate ? departDate.toISOString().split("T")[0] : '',
      returnDate: returnDate ? returnDate.toISOString().split("T")[0] : undefined,
      adults: adultsCount,
      children: childrenCount,
      infants: infantsCount,
    });
  };

  const flights = flightsResponse?.data || [];

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 text-gray-900">Найдите лучшие авиабилеты</h1>
        <p className="text-lg text-gray-600">Сравнивайте цены и бронируйте билеты на рейсы по всему миру</p>
      </div>

      <div className="max-w-5xl mx-auto mb-12">
        <FlightSearchForm onSearch={handleSearch} req={{ loading: isLoading, error: !!error }} />
      </div>

      <div className="max-w-5xl mx-auto space-y-4 text-center">
        {/* Ошибка */}
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-sm">
            <p className="text-red-600 text-xl font-semibold mb-1">
              Не удалось получить результаты
            </p>
            <p className="text-gray-600">
              Попробуйте изменить параметры поиска или повторите позже.
            </p>
          </div>
        ) : (
          /* Только если нет ошибки — показываем результаты */
          flights.length > 0 && (
            <div className="space-y-4 animate-fadeIn">
              {flights.map((f) => (
                <FlightCard key={f.id} offer={f as FlightOffer} />
              ))}
            </div>
          )
        )}
      </div>
    </main>
  )
}
