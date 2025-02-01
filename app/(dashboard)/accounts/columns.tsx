"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown,MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { InferResponseType } from "hono"
import { client } from "@/lib/hono"
import { Actions } from "./actions"
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export type ResposeType = {
  id: string;
  name: string;
  totalAmount: number;
  phone: string | null;
  address: string | null;
}[];

export const columns: ColumnDef<ResposeType[number]>[] = [
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
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-sm font-bold"
      >
        Client Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },

  {
    accessorKey: "phone",
    header: () => <div className="text-sm font-bold">Phone</div>,
  },

  {
    accessorKey: "address",
    header: () => <div className="text-sm font-bold">Address</div>,
  },

  {
    accessorKey: "totalAmount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-sm font-bold"
      >
        Outstanding Amount
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    sortingFn: (rowA, rowB, columnId) => {
      const amountA = parseFloat(rowA.getValue(columnId)) || 0;
      const amountB = parseFloat(rowB.getValue(columnId)) || 0;
      return amountA - amountB;
    },
  },

  {
    id: "actions",
    cell: ({ row }) => <Actions id={row.original.id} />,
  },
];
