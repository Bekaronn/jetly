import { useState } from "react";
import { PlaneTakeoff, PlaneLanding, Clock, Users } from "lucide-react";
import type { FlightCardProps } from "@/types";

export default function FlightCard({ offer }: FlightCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const itineraries = offer.itineraries || [];
  const airline = offer.validatingAirlineCodes?.[0] || "—";
  const seats = offer.numberOfBookableSeats ?? 0;
  const price = offer.price?.total ?? "—";
  const currency = offer.price?.currency ?? "";

  const firstItinerary = itineraries[0];
  const secondItinerary = itineraries[1];

  const firstSeg = firstItinerary?.segments?.[0];
  const lastSeg = firstItinerary?.segments?.[firstItinerary.segments.length - 1];

  const depTime = firstSeg ? new Date(firstSeg.departure.at).toLocaleString() : "—";
  const arrTime = lastSeg ? new Date(lastSeg.arrival.at).toLocaleString() : "—";
  const duration =
    firstItinerary?.duration?.replace("PT", "").toLowerCase() ?? "—";

  const retFirst = secondItinerary?.segments?.[0];
  const retLast = secondItinerary?.segments?.[secondItinerary.segments.length - 1];
  const retDep = retFirst ? new Date(retFirst.departure.at).toLocaleString() : "—";
  const retArr = retLast ? new Date(retLast.arrival.at).toLocaleString() : "—";
  const retDur =
    secondItinerary?.duration?.replace("PT", "").toLowerCase() ?? "—";

  return (
    <div className="relative bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200 mb-6 hover:shadow-xl transition-all">
      <div className="flex flex-col md:flex-row justify-between">
        <div className="flex-1 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-semibold text-gray-900">
              Авиакомпания {airline}
            </span>
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <Users size={16} /> {seats} мест
            </span>
          </div>

          <div className="flex justify-between w-4/5 mt-5">
              {/* Туда */}
          <div className="mb-3">
            <div className="flex items-center gap-2 text-blue-600 font-medium mb-1">
              <PlaneTakeoff size={16} /> Туда
            </div>
            <div className="ml-5 text-gray-700 text-sm">
              <p>
                {firstSeg?.departure.iataCode} → {lastSeg?.arrival.iataCode}
              </p>
              <p>Вылет: {depTime}</p>
              <p>Прилет: {arrTime}</p>
              <p className="flex items-center gap-1">
                <Clock size={14} /> Длительность: {duration}
              </p>
            </div>
          </div>

          {secondItinerary && (
            <div>
              <div className="flex items-center gap-2 text-green-600 font-medium mb-1">
                <PlaneLanding size={16} /> Обратно
              </div>
              <div className="ml-5 text-gray-700 text-sm">
                <p>
                  {retFirst?.departure.iataCode} → {retLast?.arrival.iataCode}
                </p>
                <p>Вылет: {retDep}</p>
                <p>Прилет: {retArr}</p>
                <p className="flex items-center gap-1">
                  <Clock size={14} /> Длительность: {retDur}
                </p>
              </div>
            </div>
          )}
          </div>
        </div>

        <div className="hidden md:block w-[1px] bg-gray-200 relative">
          <div className="absolute top-0 bottom-0 w-[1px] bg-[repeating-linear-gradient(white,white_6px,transparent_6px,transparent_12px)]" />
        </div>

        <div className="w-full md:w-64 bg-gray-50 p-6 flex flex-col justify-between items-center text-center border-t md:border-t-0 md:border-l border-gray-200">
          <div>
            <p className="text-3xl font-bold text-gray-900">
              {price} {currency}
            </p>
            <p className="text-sm text-gray-500 mt-1">за взрослого</p>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition font-medium"
          >
            Забронировать
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="relative bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto p-6 animate-fadeIn">
            <h2 className="text-xl font-bold mb-4">Детали рейса</h2>

            {itineraries.map((itin, idx) => (
              <div key={idx} className="mb-5">
                <h3 className="font-semibold mb-2 text-gray-800">
                  {idx === 0 ? "Туда" : "Обратно"} —{" "}
                  {itin.duration?.replace("PT", "").toLowerCase() || "—"}
                </h3>
                {itin.segments.map((seg, i) => (
                  <div
                    key={i}
                    className="border-b border-gray-200 pb-2 mb-2 last:border-none"
                  >
                    <p className="text-sm text-gray-700">
                      ✈️ <b>{seg.carrierCode}</b> — {seg.departure.iataCode} →{" "}
                      {seg.arrival.iataCode}
                    </p>
                    <p className="text-sm text-gray-600">
                      Вылет: {new Date(seg.departure.at).toLocaleString()} <br />
                      Прилет: {new Date(seg.arrival.at).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Самолёт: {seg.aircraft?.code || "—"} | Рейс № {seg.number}
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
