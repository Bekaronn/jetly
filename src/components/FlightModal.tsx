// FlightModal.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { PlaneTakeoff, PlaneLanding, Clock, Users } from "lucide-react";

interface FlightSegment {
  departure: { iataCode: string; terminal?: string; at: string };
  arrival: { iataCode: string; terminal?: string; at: string };
  carrierCode: string;
  number: string;
  duration?: string;
  aircraft?: { code?: string };
  operating?: { carrierName?: string };
}

interface Itinerary {
  duration?: string;
  segments: FlightSegment[];
}

interface Traveler {
  travelerType: string; // ADULT, CHILD, INFANT
  price: { total: string; base: string; currency: string };
}

interface FlightModalProps {
  itineraries: Itinerary[];
  travelers?: Traveler[];
  price?: string;
  currency?: string;
  open: boolean;
  onClose: () => void;
  dictionaries?: {
    locations?: Record<string, { cityCode: string; countryCode: string }>;
    carriers?: Record<string, string>;
    aircraft?: Record<string, string>;
  };
}

export default function FlightModal({
  itineraries,
  travelers = [],
  price,
  currency,
  open,
  onClose,
  dictionaries,
}: FlightModalProps) {
  const formatTime = (dateStr?: string) =>
    dateStr
      ? new Date(dateStr).toLocaleString([], { dateStyle: "short", timeStyle: "short" })
      : "—";

  const getCityName = (iata: string) => dictionaries?.locations?.[iata]?.cityCode ?? iata;
  const getCarrierName = (code: string) => dictionaries?.carriers?.[code] ?? code;
  const getAircraftName = (code?: string) => (code ? dictionaries?.aircraft?.[code] ?? code : "—");

  const formatTravelerType = (type: string) => {
    switch (type) {
      case "ADULT":
        return "Взрослый";
      case "CHILD":
        return "Ребёнок";
      case "INFANT":
      case "HELD_INFANT":
        return "Младенец";
      default:
        return type;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl w-full max-h-[85vh] p-6 overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">Детали рейса</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-2">
          {itineraries.map((itin, idx) => (
            <Card key={idx} className="mb-4">
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${idx === 0 ? "text-blue-600" : "text-green-600"}`}>
                  {idx === 0 ? <PlaneTakeoff /> : <PlaneLanding />}
                  {idx === 0 ? "Туда" : "Обратно"} — {itin.duration?.replace("PT", "").toLowerCase() || "—"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {itin.segments.map((seg, i) => (
                  <Card key={i} className="p-3 border border-gray-200 rounded-xl bg-gray-50 shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800 flex items-center gap-1">
                        ✈️ {getCarrierName(seg.carrierCode)} {seg.operating?.carrierName && `(${seg.operating.carrierName})`}
                      </span>
                      <span className="text-gray-500 text-sm">Рейс № {seg.number}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-gray-700 text-sm">
                      <div>
                        <p className="font-medium flex items-center gap-1">
                          <PlaneTakeoff size={14} /> {getCityName(seg.departure.iataCode)}
                          {seg.departure.terminal && ` (терминал ${seg.departure.terminal})`}
                        </p>
                        <p>{formatTime(seg.departure.at)}</p>
                      </div>
                      <div>
                        <p className="font-medium flex items-center gap-1">
                          <PlaneLanding size={14} /> {getCityName(seg.arrival.iataCode)}
                          {seg.arrival.terminal && ` (терминал ${seg.arrival.terminal})`}
                        </p>
                        <p>{formatTime(seg.arrival.at)}</p>
                      </div>
                    </div>

                    <Separator className="my-1" />

                    <div className="flex justify-between text-sm text-gray-600">
                      <span className="flex items-center gap-1">Самолёт: {getAircraftName(seg.aircraft?.code)}</span>
                      <span className="flex items-center gap-1"><Clock size={14} /> Длительность: {seg.duration || "—"}</span>
                    </div>
                  </Card>
                ))}
              </CardContent>
            </Card>
          ))}

          {travelers.length > 0 && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users /> Стоимость пассажиров
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {travelers.map((t, i) => (
                  <Card key={i} className="p-3 border border-gray-200 rounded-xl bg-gray-50 shadow-sm flex justify-between items-center text-sm">
                    <span>{formatTravelerType(t.travelerType)}</span>
                    <span>
                      {t.price.total} {t.price.currency} <span className="text-gray-400">(базовая: {t.price.base})</span>
                    </span>
                  </Card>
                ))}
              </CardContent>
            </Card>
          )}

          {price && (
            <div className="mt-4 text-right text-lg font-semibold text-gray-900">
              Общая стоимость: {price} {currency}
            </div>
          )}
        </ScrollArea>

        <div className="mt-6 text-center">
          <DialogClose asChild>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition font-semibold">
              Закрыть
            </button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
