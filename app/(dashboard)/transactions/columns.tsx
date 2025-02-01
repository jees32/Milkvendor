"use client"
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown,MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { InferResponseType } from "hono"
import { client } from "@/lib/hono"
import { Actions } from "./actions";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export type ResposeType = InferResponseType<typeof client.api.transactions.$get, 200>;
export const columns: ColumnDef<ResposeType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

 
  {
    // accessorKey: "accountName",
    accessorKey: "name",
    header: ({ column }) => {
      return(
      <div className="text-sm font-bold">
      Name
    </div>
    )
      },
  },

  {
    accessorKey: "type",
    header: () => {
      return (
        <div className="text-sm font-bold">
          Type
        </div>
      );
    },    
    },

    {
      accessorKey: "notes",
      header: () => {
        return (
          <div className="text-sm font-bold">
            Comments
          </div>
        );
      },    
      },
      {
        accessorKey: "date",        header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="text-sm font-bold"
              >
                Date
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            );          
        },
        cell: ({ row }) => {
          // Safely access the date field
          const rawDate = row.getValue<string>("date");
          try {
            const formattedDate = rawDate
              ? format(new Date(rawDate), "MM/dd/yyyy")
              : "Invalid Date";
            return <span>{formattedDate}</span>;
          } catch (error) {
            console.error("Error formatting date:", error);
            return <span>Invalid Date</span>;
          }
        },  
      },    
      
        {
          accessorKey: "amount",
          header: ({ column }) => {
              return (
                <Button
                  variant="ghost"
                  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                  className="text-sm font-bold"
                >
                  Amount
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              );
            },
          },
  {
    id: "actions",
    cell: ({ row }) => <Actions id={row.original.id} />,
  },
]
