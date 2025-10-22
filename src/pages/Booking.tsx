import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { PlaneTakeoff, PlaneLanding, Clock, Calendar } from "lucide-react"
import { QRCodeCanvas } from "qrcode.react"

export default function Booking() {
  const [bookings, setBookings] = useState<any[]>([])

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("bookings") || "[]")
    setBookings(saved.reverse())
  }, [])

  const getCityName = (iata: string) => iata // Здесь можно подключить словарь, если есть

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-4">Мои брони ✈️</h2>

      {bookings.length === 0 ? (
        <p className="text-gray-600">У вас пока нет забронированных перелётов.</p>
      ) : (
        <div className="space-y-6">
          {bookings.map((b, idx) => (
            <Card key={idx} className="relative bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-all">
              <div className="flex flex-col md:flex-row justify-between">
                <div className="flex-1 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-semibold text-gray-900">
                      Бронирование №{b.id}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar size={14} /> {new Date(b.createdAt).toLocaleString()}
                    </span>
                  </div>

                  {b.itineraries?.map((itin: any, i: number) => {
                    const firstSeg = itin.segments?.[0]
                    const lastSeg = itin.segments?.[itin.segments.length - 1]
                    const depTime = firstSeg ? new Date(firstSeg.departure.at).toLocaleString() : "—"
                    const arrTime = lastSeg ? new Date(lastSeg.arrival.at).toLocaleString() : "—"
                    const duration = itin.duration?.replace("PT", "").toLowerCase() ?? "—"

                    return (
                      <div key={i} className="mb-4">
                        <div className="flex items-center">
                          <div className="flex items-center gap-2 text-blue-600 font-medium">
                            <PlaneTakeoff size={16} /> {getCityName(firstSeg?.departure?.iataCode ?? "—")}
                          </div>

                          <Separator orientation="horizontal" className="flex-1 mx-2" />

                          <div className="flex items-center gap-2 text-green-600 font-medium">
                            <PlaneLanding size={16} /> {getCityName(lastSeg?.arrival?.iataCode ?? "—")}
                          </div>
                        </div>

                        <div className="ml-6 text-gray-700 text-sm mt-1">
                          <p className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock size={14} /> Длительность: {duration}
                          </p>
                          <p>Вылет: {depTime}</p>
                          <p>Прилет: {arrTime}</p>
                        </div>
                      </div>
                    )
                  })}

                  <div className="flex justify-between items-center text-sm text-gray-800 mt-2">
                    <span>Пассажиров: {b.travelers?.length ?? 0}</span>
                    <span className="font-medium">{b.price} {b.currency}</span>
                  </div>
                </div>

                <div className="hidden md:block w-[1px] bg-gray-200 relative">
                  <div className="absolute top-0 bottom-0 w-[1px] bg-[repeating-linear-gradient(white,white_6px,transparent_6px,transparent_12px)]" />
                </div>

                <div className="w-full md:w-64 bg-gray-50 p-6 flex flex-col justify-center items-center text-center border-t md:border-t-0 md:border-l border-gray-200">
                  <QRCodeCanvas value={`https://jetly.kz/ticket/${b.id}`} size={120} />
                  <p className="text-xs text-gray-500 mt-2">Сохраните QR-код для регистрации на рейс</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
