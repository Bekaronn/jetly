import { useState } from "react";

// ===== Типы Amadeus Flight Offer =====
interface FlightSegment {
  departure: {
    iataCode: string;
    at: string;
  };
  arrival: {
    iataCode: string;
    at: string;
  };
  carrierCode: string;
  number: string;
  duration?: string;
  aircraft?: {
    code?: string;
  };
}

interface Itinerary {
  duration?: string;
  segments: FlightSegment[];
}

interface Price {
  total: string;
  currency: string;
}

interface FlightOffer {
  itineraries: Itinerary[];
  validatingAirlineCodes?: string[];
  numberOfBookableSeats?: number;
  price?: Price;
}

// ===== Компонент =====
interface FlightCardProps {
  offer: FlightOffer;
}

export default function FlightCard({ offer }: FlightCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const itineraries = offer.itineraries || [];
  const airline = offer.validatingAirlineCodes?.[0] || "—";
  const seats = offer.numberOfBookableSeats ?? 0;
  const price = offer.price?.total ?? "—";
  const currency = offer.price?.currency ?? "";

  const firstItinerary = itineraries[0];
  const secondItinerary = itineraries[1];

  const firstSegment = firstItinerary?.segments?.[0];
  const lastSegment =
    firstItinerary?.segments?.[firstItinerary?.segments.length - 1];

  const returnFirstSegment = secondItinerary?.segments?.[0];
  const returnLastSegment =
    secondItinerary?.segments?.[secondItinerary?.segments.length - 1];

  const departureTime = firstSegment
    ? new Date(firstSegment.departure.at).toLocaleString()
    : "—";
  const arrivalTime = lastSegment
    ? new Date(lastSegment.arrival.at).toLocaleString()
    : "—";

  const returnDeparture = returnFirstSegment
    ? new Date(returnFirstSegment.departure.at).toLocaleString()
    : null;
  const returnArrival = returnLastSegment
    ? new Date(returnLastSegment.arrival.at).toLocaleString()
    : null;

  const duration =
    firstItinerary?.duration?.replace("PT", "").toLowerCase() ?? "—";
  const returnDuration =
    secondItinerary?.duration?.replace("PT", "").toLowerCase() ?? "—";

  return (
    <div className="border rounded-xl p-5 shadow hover:shadow-lg transition bg-white mb-4">
      {/* ===== Основная карточка ===== */}
      <div className="flex justify-between items-center mb-3">
        <div>
          <p className="font-semibold text-xl">{airline}</p>
          <p className="text-gray-500 text-sm">
            {firstSegment?.departure.iataCode} → {lastSegment?.arrival.iataCode}
            {secondItinerary
              ? ` → ${returnFirstSegment?.departure.iataCode} → ${returnLastSegment?.arrival.iataCode}`
              : ""}
          </p>
        </div>
        <div className="text-right">
          <p className="font-bold text-2xl">
            {price} {currency}
          </p>
          <p className="text-gray-500 text-sm">за взрослого</p>
        </div>
      </div>

      <div className="text-sm text-gray-700 mb-3">
        <p>Вылет: {departureTime}</p>
        <p>Прилет: {arrivalTime}</p>
        <p>Длительность: {duration}</p>
        {secondItinerary && (
          <>
            <p className="mt-2 font-medium">Обратный рейс:</p>
            <p>Вылет: {returnDeparture}</p>
            <p>Прилет: {returnArrival}</p>
            <p>Длительность: {returnDuration}</p>
          </>
        )}
        <p>Свободных мест: {seats}</p>
      </div>

      <div className="mt-3 text-right">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Забронировать
        </button>
      </div>

      {/* ===== Модалка ===== */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Фон */}
          <div
            className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Контент */}
          <div className="relative bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto p-6 animate-fadeIn">
            <h2 className="text-xl font-bold mb-4">Детали рейса</h2>

            {itineraries.map((itin, idx) => (
              <div key={idx} className="mb-4">
                <p className="font-semibold mb-2">
                  {idx === 0 ? "Туда" : "Обратно"} —{" "}
                  {itin.duration?.replace("PT", "").toLowerCase() || "—"}
                </p>

                {itin.segments.map((seg, i) => (
                  <div
                    key={i}
                    className="border-b border-gray-200 pb-2 mb-2 last:border-none last:mb-0"
                  >
                    <p>
                      ✈️ <b>{seg.carrierCode}</b> — {seg.departure.iataCode} →{" "}
                      {seg.arrival.iataCode}
                    </p>
                    <p>
                      Вылет: {new Date(seg.departure.at).toLocaleString()} <br />
                      Прилет: {new Date(seg.arrival.at).toLocaleString()}
                    </p>
                    <p>Номер рейса: {seg.number}</p>
                    <p>
                      Самолёт: {seg.aircraft?.code || "—"} | Длительность:{" "}
                      {seg.duration?.replace("PT", "").toLowerCase() || "—"}
                    </p>
                  </div>
                ))}
              </div>
            ))}

            <div className="mt-4 text-right">
              <button
                onClick={() => setIsOpen(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
