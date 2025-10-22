"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Location {
  id: string
  iataCode: string
  name: string
  subType: "CITY" | "AIRPORT"
  address?: {
    cityName?: string
    countryName?: string
  }
}

interface LocationSearchProps {
  label?: string
  placeholder?: string
  onSelect: (location: Location) => void
}

export default function LocationSearch({
  label = "Город или аэропорт",
  placeholder = "Введите город или аэропорт",
  onSelect,
}: LocationSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Location[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<Location | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    if (!query || selected) {
      setResults([])
      setShowDropdown(false)
      return
    }

    const delay = setTimeout(() => {
      fetchLocations(query)
    }, 400)

    return () => clearTimeout(delay)
  }, [query, selected])

  const fetchLocations = async (keyword: string) => {
    setLoading(true)
    try {
      const token = "oWT37HuBWPEpP9R2SCSgpwEk3Ksv" // ⚠️ временный токен
      const response = await axios.get<{ data: Location[] }>(
        "https://test.api.amadeus.com/v1/reference-data/locations",
        {
          params: {
            subType: "CITY,AIRPORT",
            keyword,
            "page[limit]": 8,
            view: "LIGHT",
          },
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.amadeus+json",
          },
        }
      )
      setResults(response.data.data)
      setShowDropdown(true)
    } catch (error) {
      console.error("Error fetching locations:", error)
      setResults([])
      setShowDropdown(true)
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (item: Location) => {
    setSelected(item)
    onSelect(item)
    setQuery(`${item.name} (${item.iataCode})`)
    setShowDropdown(false)
  }

  return (
    <div className="relative space-y-2 w-full">
      <Label className="text-sm font-medium text-foreground">{label}</Label>

      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setSelected(null)
          }}
          onFocus={() => query && setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 150)} // чтобы можно было кликнуть
          className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
        />

        {/* Dropdown */}
        {showDropdown && (
          <ul
            className={cn(
              "absolute z-20 w-full mt-1 max-h-64 overflow-y-auto rounded-md border bg-popover border-border shadow-lg",
              "animate-in fade-in-50 slide-in-from-top-2"
            )}
          >
            {loading && (
              <li className="flex items-center gap-2 px-4 py-3 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Загрузка...
              </li>
            )}

            {!loading && results.length === 0 && (
              <li className="px-4 py-3 text-muted-foreground">Ничего не найдено</li>
            )}

            {!loading &&
              results.map((item) => (
                <li
                  key={item.id}
                  className="px-4 py-2 hover:bg-secondary cursor-pointer text-foreground text-sm flex justify-between"
                  onMouseDown={() => handleSelect(item)}
                >
                  <div>
                    <span className="font-medium">{item.name}</span>{" "}
                    <span className="text-muted-foreground">
                      ({item.iataCode}) • {item.subType === "CITY" ? "город" : "аэропорт"}
                    </span>
                  </div>
                  {item.address?.countryName && (
                    <span className="text-muted-foreground text-xs">{item.address.countryName}</span>
                  )}
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  )
}
