"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu,
    DropdownMenuContent,
DropdownMenuItem,
DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal } from "lucide-react";
import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";
import Link from "next/link";

type Props={
    id:string;

}

export const Actions = ({id}:Props) =>{
    const {onOpen}=useOpenAccount();

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
            onClick={() => {
                console.log("Opening EditAccountSheet with ID:", id);
                onOpen(id);
              }}>
                <Edit className="size-4 mr-2"/>
                Edit
            </DropdownMenuItem>

            <DropdownMenuItem
            disabled={false}
            asChild
            >
                <Link href={`/transactions/${id}`}>
                <div className="flex items-center">
                <Edit className="size-4 mr-2"/>                
                Transactions
                </div>
                </Link>
            </DropdownMenuItem>

        </DropdownMenuContent>
     </DropdownMenu>
     </>
    )
}