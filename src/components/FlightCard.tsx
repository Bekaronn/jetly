import { useState } from "react";
import { PlaneTakeoff, PlaneLanding, Clock, Users } from "lucide-react";
import type { FlightCardProps, FlightSegment } from "@/types";
import FlightModal from "./FlightModal";
import { Separator } from "@/components/ui/separator"

export default function FlightCard({ offer, dictionaries }: FlightCardProps & { dictionaries?: any }) {
  const [isOpen, setIsOpen] = useState(false);

  const itineraries = offer.itineraries || [];
  const airline = offer.validatingAirlineCodes?.[0]
    ? dictionaries?.carriers?.[offer.validatingAirlineCodes[0]] ?? offer.validatingAirlineCodes[0]
    : "—";
  const seats = offer.numberOfBookableSeats ?? 0;
  const price = offer.price?.total ?? "—";
  const currency = offer.price?.currency ?? "";

  const firstItinerary = itineraries[0];
  const secondItinerary = itineraries[1];

  const firstSeg: FlightSegment | undefined = firstItinerary?.segments?.[0];
  const lastSeg: FlightSegment | undefined = firstItinerary?.segments?.[firstItinerary.segments.length - 1];

  const depTime = firstSeg ? new Date(firstSeg.departure.at).toLocaleString() : "—";
  const arrTime = lastSeg ? new Date(lastSeg.arrival.at).toLocaleString() : "—";
  const duration = firstItinerary?.duration?.replace("PT", "").toLowerCase() ?? "—";

  const retFirst: FlightSegment | undefined = secondItinerary?.segments?.[0];
  const retLast: FlightSegment | undefined = secondItinerary?.segments?.[secondItinerary.segments.length - 1];
  const retDep = retFirst ? new Date(retFirst.departure.at).toLocaleString() : "—";
  const retArr = retLast ? new Date(retLast.arrival.at).toLocaleString() : "—";
  const retDur = secondItinerary?.duration?.replace("PT", "").toLowerCase() ?? "—";

  // Функция для получения города по IATA через dictionaries
  const getCityName = (iata: string) => dictionaries?.locations?.[iata]?.cityCode ?? iata;

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
            <div className="mb-3">
              <div className="flex items-center">
                <div className="flex items-center gap-2 text-blue-600 font-medium mb-1">
                  <PlaneTakeoff size={16} /> {getCityName(firstSeg?.departure.iataCode ?? "—")}
                </div>
                <Separator orientation="horizontal" className="flex-1 mx-2" />
                <div className="flex items-center gap-2 text-green-600 font-medium mb-1">
                  <PlaneLanding size={16} /> {getCityName(lastSeg?.arrival.iataCode ?? "—")}
                </div>
              </div>
              <div className="ml-6 text-gray-700 text-sm">
                <p className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                  <Clock size={14} /> Длительность: {duration}
                </p>
                <p>Вылет: {depTime}</p>
                <p>Прилет: {arrTime}</p>
              </div>
            </div>

            {secondItinerary && (
              <div>
                <div className="flex items-center">
                  <div className="flex items-center gap-2 text-green-600 font-medium mb-1">
                    <PlaneLanding size={16} /> {getCityName(retFirst?.departure.iataCode ?? "—")}
                  </div>
                  <Separator orientation="horizontal" className="flex-1 mx-2" />
                  <div className="flex items-center gap-2 text-blue-600 font-medium mb-1">
                    <PlaneTakeoff size={16} /> {getCityName(retLast?.arrival.iataCode ?? "—")}
                  </div>
                </div>
              
                <div className="ml-6 text-gray-700 text-sm">
                  <p className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <Clock size={14} /> Длительность: {retDur}
                  </p>
                  <p>Вылет: {retDep}</p>
                  <p>Прилет: {retArr}</p>
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
        <FlightModal
          itineraries={itineraries}
          travelers={offer.travelerPricings}
          price={offer.price?.total}
          currency={offer.price?.currency}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          dictionaries={dictionaries}
        />
      )}
    </div>
  );
}
