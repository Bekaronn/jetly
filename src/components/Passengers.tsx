import { useState, useEffect } from "react";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

interface PassengersSelectorProps {
  onChange?: (data: { adults: number; children: number; infants: number }) => void;
}

export default function PassengersSelector({ onChange }: PassengersSelectorProps) {
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

  useEffect(() => {
    onChange?.({ adults, children, infants });
  }, [adults, children, infants]);

  // Взрослые
  const handleAdultsChange = (value: number) => {
    const newAdults = Math.max(1, Math.min(9, value));
    setAdults(newAdults);
    if (infants > newAdults) setInfants(newAdults);
  };

  // Дети
  const handleChildrenChange = (value: number) => {
    setChildren(Math.max(0, Math.min(9, value)));
  };

  // Младенцы
  const handleInfantsChange = (value: number) => {
    if (value > adults) setInfants(adults);
    else setInfants(Math.max(0, value));
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
              <div>
                <span className="text-sm font-medium text-foreground">Взрослые</span>
                <p className="text-xs text-gray-500 mt-0.5">12 лет и старше</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAdultsChange(adults - 1)}
                  disabled={adults <= 1}
                  className="h-8 w-8 p-0 bg-secondary border-border"
                >
                  −
                </Button>
                <span className="text-sm font-medium text-foreground w-8 text-center">{adults}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAdultsChange(adults + 1)}
                  disabled={adults >= 9}
                  className="h-8 w-8 p-0 bg-secondary border-border"
                >
                  +
                </Button>
              </div>
            </div>

            {/* Дети */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-foreground">Дети</span>
                <p className="text-xs text-gray-500 mt-0.5">от 2 до 11 лет</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleChildrenChange(children - 1)}
                  disabled={children <= 0}
                  className="h-8 w-8 p-0 bg-secondary border-border"
                >
                  −
                </Button>
                <span className="text-sm font-medium text-foreground w-8 text-center">{children}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleChildrenChange(children + 1)}
                  disabled={children >= 9}
                  className="h-8 w-8 p-0 bg-secondary border-border"
                >
                  +
                </Button>
              </div>
            </div>

            {/* Младенцы */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-foreground">Младенцы</span>
                <p className="text-xs text-gray-500 mt-0.5">Младше 2 лет, без места</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleInfantsChange(infants - 1)}
                  disabled={infants <= 0}
                  className="h-8 w-8 p-0 bg-secondary border-border"
                >
                  −
                </Button>
                <span className="text-sm font-medium text-foreground w-8 text-center">{infants}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleInfantsChange(infants + 1)}
                  disabled={infants >= adults}
                  className="h-8 w-8 p-0 bg-secondary border-border"
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
