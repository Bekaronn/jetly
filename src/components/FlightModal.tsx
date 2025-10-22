import { useEffect } from "react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { PlaneTakeoff, PlaneLanding, Clock, Users, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { QRCodeCanvas } from "qrcode.react"

interface FlightSegment {
  departure: { iataCode: string; terminal?: string; at: string }
  arrival: { iataCode: string; terminal?: string; at: string }
  carrierCode: string
  number: string
  duration?: string
  aircraft?: { code?: string }
  operating?: { carrierName?: string }
}

interface Itinerary {
  duration?: string
  segments: FlightSegment[]
}

interface Traveler {
  travelerType: string
  price: { total: string; base: string; currency: string }
}

interface FlightModalProps {
  itineraries: Itinerary[]
  travelers?: Traveler[]
  price?: string
  currency?: string
  open: boolean
  onClose: () => void
  dictionaries?: {
    locations?: Record<string, { cityCode: string; countryCode: string }>
    carriers?: Record<string, string>
    aircraft?: Record<string, string>
  }
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
  const [step, setStep] = useState<"details" | "booking" | "ticket">("details")
  const [passengerData, setPassengerData] = useState<{ [key: number]: any }>({})

  const formatTime = (dateStr?: string) =>
    dateStr
      ? new Date(dateStr).toLocaleString([], { dateStyle: "short", timeStyle: "short" })
      : "—"

  const getCityName = (iata: string) => dictionaries?.locations?.[iata]?.cityCode ?? iata
  const getCarrierName = (code: string) => dictionaries?.carriers?.[code] ?? code
  const getAircraftName = (code?: string) => (code ? dictionaries?.aircraft?.[code] ?? code : "—")

  const formatTravelerType = (type: string) => {
    switch (type) {
      case "ADULT":
        return "Взрослый"
      case "CHILD":
        return "Ребёнок"
      case "INFANT":
      case "HELD_INFANT":
        return "Младенец"
      default:
        return type
    }
  }

  const updatePassengerField = (idx: number, field: string, value: any) => {
    setPassengerData((prev) => ({
      ...prev,
      [idx]: {
        ...(prev[idx] || {}),
        [field]: value,
      },
    }))
  }

  const validatePassengers = () => {
    for (const [i, t] of travelers.entries()) {
      const p = passengerData[i]
      if (
        !p ||
        !p.firstName ||
        !p.lastName ||
        !p.birthDate ||
        !p.gender ||
        !p.documentType ||
        !p.documentNumber ||
        !p.nationality
      ) {
        alert(`Пожалуйста, заполните все поля для пассажира №${i + 1} (${formatTravelerType(t.travelerType)})`)
        return false
      }
    }
    return true
  }

  const handleBookingSubmit = () => {
    if (!validatePassengers()) return

    const booking = {
      id: Date.now().toString(),
      itineraries,
      travelers,
      passengerData,
      price,
      currency,
      createdAt: new Date().toISOString(),
    }

    // Загружаем предыдущие бронирования из localStorage
    const saved = JSON.parse(localStorage.getItem("bookings") || "[]")
    saved.push(booking)

    // Сохраняем обратно
    localStorage.setItem("bookings", JSON.stringify(saved))

    console.log("Бронирование сохранено:", booking)

    setStep("ticket")
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl w-full max-h-[85vh] p-2 overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            {step === "details"
              ? "Детали рейса"
              : step === "booking"
              ? "Информация о пассажирах"
              : "Ваш билет"}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] px-6">
          {step === "details" && (
            <>
              {itineraries.map((itin, idx) => (
                <Card key={idx} className="mb-4">
                  <CardHeader>
                    <CardTitle
                      className={`flex items-center gap-2 ${idx === 0 ? "text-blue-600" : "text-green-600"}`}
                    >
                      {idx === 0 ? <PlaneTakeoff /> : <PlaneLanding />}
                      {idx === 0 ? "Туда" : "Обратно"} —{" "}
                      {itin.duration?.replace("PT", "").toLowerCase() || "—"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {itin.segments.map((seg, i) => (
                      <Card key={i} className="p-3 border border-gray-200 rounded-xl bg-gray-50 shadow-sm">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-800 flex items-center gap-1">
                            ✈️ {getCarrierName(seg.carrierCode)}{" "}
                            {seg.operating?.carrierName && `(${seg.operating.carrierName})`}
                          </span>
                          <span className="text-gray-500 text-sm">Рейс № {seg.number}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-gray-700 text-sm">
                          <div>
                            <p className="font-medium flex items-center gap-1">
                              <PlaneTakeoff size={14} /> {getCityName(seg.departure.iataCode)}
                              {seg.departure.terminal && ` (T${seg.departure.terminal})`}
                            </p>
                            <p>{formatTime(seg.departure.at)}</p>
                          </div>
                          <div>
                            <p className="font-medium flex items-center gap-1">
                              <PlaneLanding size={14} /> {getCityName(seg.arrival.iataCode)}
                              {seg.arrival.terminal && ` (T${seg.arrival.terminal})`}
                            </p>
                            <p>{formatTime(seg.arrival.at)}</p>
                          </div>
                        </div>

                        <Separator className="my-1" />
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Самолёт: {getAircraftName(seg.aircraft?.code)}</span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} /> {seg.duration || "—"}
                          </span>
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
                      <Card key={i} className="p-3 border bg-gray-50 shadow-sm flex justify-between items-center text-sm">
                        <span>{formatTravelerType(t.travelerType)}</span>
                        <span>
                          {t.price.total} {t.price.currency}{" "}
                          <span className="text-gray-400">(базовая: {t.price.base})</span>
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
            </>
          )}

          {step === "booking" && (
            <>
              <h3 className="text-lg font-semibold mb-4">Введите данные пассажиров</h3>
              {travelers.map((t, i) => (
                <Card key={i} className="p-4 mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium">{formatTravelerType(t.travelerType)}</h4>
                    <span className="text-sm text-gray-500">{t.price.total} {t.price.currency}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <Label>Имя</Label>
                      <Input
                        value={passengerData[i]?.firstName ?? ""}
                        onChange={(e) => updatePassengerField(i, "firstName", e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label>Фамилия</Label>
                      <Input
                        value={passengerData[i]?.lastName ?? ""}
                        onChange={(e) => updatePassengerField(i, "lastName", e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label>Дата рождения</Label>
                      <Input
                        type="date"
                        value={passengerData[i]?.birthDate ?? ""}
                        onChange={(e) => updatePassengerField(i, "birthDate", e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label>Пол</Label>
                      <Select
                        value={passengerData[i]?.gender ?? ""}
                        onValueChange={(v) => updatePassengerField(i, "gender", v)}
                      >
                        <SelectTrigger className="w-full"><SelectValue placeholder="Выберите пол" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="M">Мужчина</SelectItem>
                          <SelectItem value="F">Женщина</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label>Тип документа</Label>
                      <Select
                        value={passengerData[i]?.documentType ?? ""}
                        onValueChange={(v) => updatePassengerField(i, "documentType", v)}
                      >
                        <SelectTrigger className="w-full"><SelectValue placeholder="Выберите тип" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PASSPORT">Паспорт</SelectItem>
                          <SelectItem value="ID_CARD">ID-карта</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label>Номер документа</Label>
                      <Input
                        value={passengerData[i]?.documentNumber ?? ""}
                        onChange={(e) => updatePassengerField(i, "documentNumber", e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label>Гражданство</Label>
                      <Select
                        value={passengerData[i]?.nationality ?? ""}
                        onValueChange={(v) => updatePassengerField(i, "nationality", v)}
                      >
                        <SelectTrigger className="w-full"><SelectValue placeholder="Выберите страну" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="KZ">Kazakhstan</SelectItem>
                          <SelectItem value="RU">Russia</SelectItem>
                          <SelectItem value="US">United States</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2 md:col-span-2">
                      <Checkbox
                        checked={!!passengerData[i]?.saveInfo}
                        onCheckedChange={(v) => updatePassengerField(i, "saveInfo", !!v)}
                      />
                      <span className="text-sm text-gray-600">Сохранить данные для следующего раза</span>
                    </div>
                  </div>
                </Card>
              ))}
            </>
          )}

          {step === "ticket" && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <CheckCircle2 className="text-green-600" size={64} />
              <h3 className="text-xl font-semibold">Ваш билет успешно забронирован!</h3>
              <QRCodeCanvas value="https://jetly.kz/ticket/12345" size={180} />
              <p className="text-sm text-gray-600">Сохраните этот QR-код — он потребуется при регистрации.</p>
            </div>
          )}
        </ScrollArea>

        <div className="px-4 pb-4 pt-1 flex justify-between">
          <DialogClose asChild>
            <Button variant="outline">Закрыть</Button>
          </DialogClose>

          {step === "details" && (
            <Button onClick={() => setStep("booking")}>Продолжить к бронированию</Button>
          )}
          {step === "booking" && (
            <Button onClick={handleBookingSubmit}>Забронировать</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
