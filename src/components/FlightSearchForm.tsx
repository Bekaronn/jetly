import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, ArrowRight, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import LocationSearch from "./LocationSearch"
import PassengersSelector from "./Passengers"
import type { FlightSearchFormProps } from "@/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function FlightSearchForm({ onSearch, req }: FlightSearchFormProps) {
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [departDate, setDepartDate] = useState<Date | undefined>()
  const [returnDate, setReturnDate] = useState<Date | undefined>()
  const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  })
  const [travelClass, setTravelClass] = useState<"ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST">("ECONOMY");

  const handlePassengersChange = (data: {
    adults: number
    children: number
    infants: number
  }) => {
    setPassengers(data)
  }

  const handleSearch = () => {
    if (!from || !to) {
      alert("Выберите города отправления и назначения")
      return
    }
    onSearch({
      origin: from,
      destination: to,
      departDate,
      returnDate,
      passengers,
      travelClass,
    })
  }

  return (
    <Card className="bg-card border-border p-8">
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <LocationSearch
          label="Откуда"
          onSelect={(loc) => setFrom(loc.iataCode)}
        />
        <LocationSearch
          label="Куда"
          onSelect={(loc) => setTo(loc.iataCode)}
        />
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Дата вылета</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal bg-input border-border text-foreground hover:bg-secondary"
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                {departDate ? format(departDate, "dd MMM yyyy", { locale: ru }) : "Выберите дату"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-popover border-border" align="start">
              <Calendar
                mode="single"
                selected={departDate}
                onSelect={setDepartDate}
                locale={ru}
                className="bg-popover"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Дата возврата */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Дата возврата</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal bg-input border-border text-foreground hover:bg-secondary"
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                {returnDate ? format(returnDate, "dd MMM yyyy", { locale: ru }) : "Выберите дату"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-popover border-border" align="start">
              <Calendar
                mode="single"
                selected={returnDate}
                onSelect={setReturnDate}
                locale={ru}
                disabled={(date) => (departDate ? date < departDate : false)}
                className="bg-popover"
              />
            </PopoverContent>
          </Popover>
        </div>

        <PassengersSelector onChange={handlePassengersChange} />

        {/* Класс обслуживания */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Класс обслуживания</Label>
          <Select value={travelClass} onValueChange={(value) => setTravelClass(value as typeof travelClass)}>
            <SelectTrigger className="w-full font-normal bg-input border-border text-foreground hover:bg-secondary">
              <SelectValue placeholder="Выберите класс" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ECONOMY">Эконом</SelectItem>
              <SelectItem value="PREMIUM_ECONOMY">Премиум эконом</SelectItem>
              <SelectItem value="BUSINESS">Бизнес</SelectItem>
              <SelectItem value="FIRST">Первый</SelectItem>
            </SelectContent>
          </Select>
        </div>

      </div>

      <Button
        onClick={handleSearch}
        disabled={req.loading}
        className="w-full bg-primary text-primary-foreground hover:opacity-90 text-base py-6 flex items-center justify-center gap-2"
        size="lg"
      >
        {req.loading ? (
          <>
            <Loader2 className="animate-spin h-5 w-5" /> Идет поиск...
          </>
        ) : (
          <>
            Найти билеты <ArrowRight className="ml-2 h-5 w-5" />
          </>
        )}
      </Button>
    </Card>
  )
}
