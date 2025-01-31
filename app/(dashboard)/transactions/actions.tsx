"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu,
    DropdownMenuContent,
DropdownMenuItem,
DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal } from "lucide-react";
import { useOpenTransaction } from "../../../features/accounts/hooks/use-open-transaction";
import Link from "next/link";


type Props={
    id:string;

}

export const Actions = ({id}:Props) =>{
    const {onOpen}=useOpenTransaction();

    return (
     <>
     <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="size-8 p-0">
                <MoreHorizontal className="size-4"/>
            </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end">

        <DropdownMenuItem
    disabled={false}
    onClick={(event) => {      
      onOpen(id); // Call the onOpen function with the id
      console.log("id from actions",id)
      event.preventDefault(); // Prevent default behavior
    }}
  >
    <Edit className="size-4 mr-2" />
    Edit
  </DropdownMenuItem>

        

        </DropdownMenuContent>
     </DropdownMenu>
     </>
    )
}