import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// Now DatePicker accepts `selected` and `onChange` props
interface DatePickerProps {
  selected: string | undefined;  // The value from the form, passed as string (YYYY-MM-DD)
  onChange: (date: string | undefined) => void; // Function to update the form value
  disabled?: boolean;
}

export function DatePicker({ selected, onChange, disabled }: DatePickerProps) {
  // Convert the string to a Date object if needed
  const selectedDate = selected ? new Date(selected) : undefined;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[180px] -mt-32 justify-start text-right font-normal",
            !selectedDate && "text-muted-foreground"
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0 ">
        <Calendar
        className="pointer-events-auto"
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            // Log the date to inspect what value is being passed
            console.log("Data selected:", date);

            // Ensure the selected date is a valid Date and convert it to the required string format
            if (date instanceof Date && !isNaN(date.getTime())) {
              // Convert date to YYYY-MM-DD string format
              const formattedDate = date.toISOString().split("T")[0];
              console.log("Formatted Date:",formattedDate);
              
              onChange(date); // Update form state with the ISO string
            } else {
              console.error("Invalid date selected:", date);
              onChange(undefined); // Set to undefined if the date is invalid
            }
          }}
          
        />
      </PopoverContent>
    </Popover>
  );
}
