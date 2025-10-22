import { useState } from "react";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

export default function PassengersSelector() {
  const [showPassengers, setShowPassengers] = useState(false);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);

  const totalPassengers = adults + children + infants;

  const passengerLabel =
    totalPassengers === 1
      ? "пассажир"
      : totalPassengers < 5
      ? "пассажира"
      : "пассажиров";

  const handleDecrease = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    value: number,
    min = 0
  ) => {
    setter(Math.max(min, value - 1));
  };

  const handleIncrease = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    value: number,
    max = 9
  ) => {
    setter(Math.min(max, value + 1));
  };

  // 🔹 Обёртки с логикой ограничений
  const handleAdultsChange = (newAdults: number) => {
    const adjustedAdults = Math.max(1, newAdults);
    setAdults(adjustedAdults);

    // если взрослых стало меньше, чем младенцев — уменьшаем младенцев
    if (infants > adjustedAdults) {
      setInfants(adjustedAdults);
    }
  };

  const handleInfantsChange = (newInfants: number) => {
    // младенцев не может быть больше взрослых
    if (newInfants > adults) {
      setInfants(adults);
    } else {
      setInfants(Math.max(0, newInfants));
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-foreground">Пассажиры</Label>

      <Popover open={showPassengers} onOpenChange={setShowPassengers}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal bg-input border-border text-foreground hover:bg-secondary"
          >
            <Users className="mr-2 h-4 w-4 text-muted-foreground" />
            {totalPassengers} {passengerLabel}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-72 bg-popover border-border" align="start">
          <div className="space-y-4">
            {/* Взрослые */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Взрослые</span>
              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAdultsChange(adults - 1)}
                  disabled={adults <= 1}
                  className="h-8 w-8 p-0 bg-secondary border-border"
                >
                  -
                </Button>
                <span className="text-sm font-medium text-foreground w-8 text-center">
                  {adults}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAdultsChange(adults + 1)}
                  className="h-8 w-8 p-0 bg-secondary border-border"
                >
                  +
                </Button>
              </div>
            </div>

            {/* Дети */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Дети (2–11 лет)</span>
              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDecrease(setChildren, children)}
                  className="h-8 w-8 p-0 bg-secondary border-border"
                >
                  -
                </Button>
                <span className="text-sm font-medium text-foreground w-8 text-center">
                  {children}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleIncrease(setChildren, children)}
                  className="h-8 w-8 p-0 bg-secondary border-border"
                >
                  +
                </Button>
              </div>
            </div>

            {/* Младенцы */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Младенцы (до 2 лет)</span>
              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleInfantsChange(infants - 1)}
                  className="h-8 w-8 p-0 bg-secondary border-border"
                  disabled={infants <= 0}
                >
                  -
                </Button>
                <span className="text-sm font-medium text-foreground w-8 text-center">
                  {infants}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleInfantsChange(infants + 1)}
                  className="h-8 w-8 p-0 bg-secondary border-border"
                  disabled={infants >= adults} // 🔒 не больше взрослых
                >
                  +
                </Button>
              </div>
            </div>

            <Button
              onClick={() => setShowPassengers(false)}
              className="w-full bg-primary text-primary-foreground hover:opacity-90"
            >
              Готово
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
