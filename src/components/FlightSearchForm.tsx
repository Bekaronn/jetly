"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, ArrowRight } from "lucide-react"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import LocationSearch from "./LocationSearch"
import PassengersSelector from "./Passengers"

interface Location {
  iataCode: string
  name?: string
}

interface FlightSearchFormProps {
  onSearch: (params: {
    origin: string
    destination: string
    departDate?: Date
    returnDate?: Date
    passengers: {
      adults: number
      children: number
      infants: number
    }
  }) => void
}

export function FlightSearchForm({ onSearch }: FlightSearchFormProps) {
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [departDate, setDepartDate] = useState<Date | undefined>()
  const [returnDate, setReturnDate] = useState<Date | undefined>()
  const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  })

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
    })
  }

  return (
    <Card className="bg-card border-border p-8">
      {/* Локации */}
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

      {/* Даты + Пассажиры */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Дата вылета */}
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
                initialFocus
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
                initialFocus
                locale={ru}
                disabled={(date) => (departDate ? date < departDate : false)}
                className="bg-popover"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Пассажиры */}
        <PassengersSelector onChange={handlePassengersChange} />
      </div>

      {/* Кнопка поиска */}
      <Button
        onClick={handleSearch}
        className="w-full bg-primary text-primary-foreground hover:opacity-90 text-base py-6"
        size="lg"
      >
        Найти билеты
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </Card>
  )
}
