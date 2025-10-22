import { useState } from "react"
import { FlightSearchForm } from "../components/FlightSearchForm"
import FlightCard from "../components/FlightCard"
import { searchFlights } from "../api/amadeus.ts"

export default function SearchFlights() {
  const [flights, setFlights] = useState<any[]>([])

  const handleSearch = async ({ origin, destination, departDate, returnDate, passengers }: any) => {
    const data = await searchFlights({
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate: departDate ? departDate.toISOString().split("T")[0] : undefined,
      returnDate: returnDate ? returnDate.toISOString().split("T")[0] : undefined,
      adults: passengers,
    })
    setFlights(data.data || [])
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 text-gray-900">Найдите лучшие авиабилеты</h1>
        <p className="text-lg text-gray-600">Сравнивайте цены и бронируйте билеты на рейсы по всему миру</p>
      </div>

      <div className="max-w-5xl mx-auto mb-12">
        <FlightSearchForm onSearch={handleSearch} />
      </div>

      <div className="max-w-5xl mx-auto space-y-4">
        {flights.map((f) => (
          <FlightCard key={f.id} offer={f} />
        ))}
      </div>
    </main>
  )
}
