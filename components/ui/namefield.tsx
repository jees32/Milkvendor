"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts"



// const names = [
//   {
//     value: "Jees",
//     label: "Jees",
//   },
//   {
//     value: "Sabu",
//     label: "Sabu",
//   },
//   {
//     value: "Shibu",
//     label: "Shibu",
//   },
//   {
//     value: "Biju",
//     label: "Biju",
//   },
//   {
//     value: "Ajith",
//     label: "Ajith",
//   },
// ]



export function NameField({ 
    value, 
    onChange, 
    disabled 
  }: { 
    value?: string, 
    onChange?: (value: string) => void,
    disabled?: boolean 
  }) {
    const accountsQuery=useGetAccounts();  
    const data=accountsQuery.data || [];
    console.log("Data from useget accounts",data);
    const names = data.map(account => ({
      value: account.name,
      label: account.name,
    }));

    
    const [open, setOpen] = React.useState(false)
  
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled}
          >
            {value
              ? names.find((name) => name.value === value)?.label
              : "Select name..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0 z-50 ">
          <Command className="pointer-events-auto">
            <CommandInput placeholder="Search Names..." />
            <CommandList>
              <CommandEmpty>No name found.</CommandEmpty>
              <CommandGroup>
                {names.map((name) => (
                  <CommandItem
                    key={name.value}
                    value={name.value}
                    onSelect={(currentValue) => {
                        event.stopPropagation();
                      onChange?.(currentValue === value ? "" : currentValue)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === name.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {name.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }