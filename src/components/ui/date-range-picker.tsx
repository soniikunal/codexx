import * as React from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

export function DateRangePicker({
  date,
  setDate,
}: {
  date: DateRange | undefined;
  setDate: (value: DateRange | undefined) => void;
}) {
  const from = date?.from ? format(date.from, "dd MMM yyyy") : "";
  const to = date?.to ? format(date.to, "dd MMM yyyy") : "";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[280px] justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {from && to ? `${from} - ${to}` : "Pick a date range"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="range"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
