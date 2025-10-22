import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Location, LocationSearchProps } from "@/types";
import { useQuery } from "@/hooks/useQuery";
import { useDebounce } from "@/hooks/useDebounce";
import { fetchLocations } from "@/api/Api";

export default function LocationSearch({
  label = "Город или аэропорт",
  placeholder = "Введите город или аэропорт",
  onSelect,
}: LocationSearchProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const debouncedQuery = useDebounce(query, 400);

  const { data: results, isLoading } = useQuery<Location[]>(
    () => fetchLocations(debouncedQuery),
    [debouncedQuery],
    { enabled: debouncedQuery.length > 0 }
  );

  const handleSelect = (item: Location) => {
    setQuery(`${item.name} (${item.iataCode})`);
    onSelect(item);
    setIsFocused(false);
  };

  const showDropdown = isFocused && query.length > 0;

  return (
    <div className="relative w-full space-y-2">
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          className="pl-10 border-border bg-input text-foreground placeholder:text-muted-foreground"
        />
        {showDropdown && (
          <ul className={cn("absolute z-20 mt-1 w-full max-h-64 overflow-y-auto rounded-md border border-border bg-popover shadow-lg animate-in fade-in-50 slide-in-from-top-2")}>
            {isLoading && (
              <li className="flex items-center gap-2 px-4 py-3 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Загрузка...
              </li>
            )}
            {!isLoading && results && results.length === 0 && (
              <li className="px-4 py-3 text-muted-foreground">Ничего не найдено</li>
            )}
            {results?.map((item) => (
              <li
                key={item.id}
                className="flex cursor-pointer justify-between px-4 py-2 text-sm text-foreground hover:bg-secondary"
                onMouseDown={() => handleSelect(item)} // onMouseDown, чтобы onBlur не сработал раньше
              >
                <div>
                  <span className="font-medium">{item.name}</span>{" "}
                  <span className="text-muted-foreground">
                    ({item.iataCode}) • {item.subType === "CITY" ? "город" : "аэропорт"}
                  </span>
                </div>
                {item.address?.countryName && (
                  <span className="text-xs text-muted-foreground">{item.address.countryName}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}