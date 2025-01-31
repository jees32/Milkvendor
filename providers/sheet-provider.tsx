"use client"
import { useMountedState } from "react-use";

import { NewAccountSheet } from "@/features/accounts/components/new-account-sheet"
import { EditAccountSheet } from "@/features/accounts/components/edit-account-sheet";
import { NewTransactionSheet } from "@/features/accounts/components/new-transaction-sheet";
import { EditTransactionSheet} from '@/features/accounts/components/edit-transaction-sheet';


export const SheetProvider = () =>{

    const isMounted=useMountedState();
    if (!isMounted) return null;
        
    
    return(
        <>
        <NewAccountSheet/>
        <EditAccountSheet/>
        <NewTransactionSheet/>
        <EditTransactionSheet/>
        </>
    );

}
