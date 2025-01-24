"use client"

import { useGetAccount } from "@/features/accounts/api/use-get-account"
import { useGetTransactionsByID } from "@/features/accounts/api/use-get-transactions-byid"
import {
    Table,
    TableHeader,
    TableCaption,
    TableCell,
    TableRow,
    TableHead,
    TableBody,
  } from "@/components/ui/table";
import { useState,useEffect } from "react";

export const TransactionsByID = ({id})=> {
    const [isLoading,setLoading]=useState(true);
    const transQuery=useGetTransactionsByID(id);
    const transactions=Array.isArray(transQuery.data) ? transQuery.data : [];
    console.log("Data from useget",transactions);

    useEffect(() => {
        if (transQuery.isSuccess || transQuery.isError) {
          setLoading(false);
        }
      }, [transQuery.isSuccess, transQuery.isError]);
    

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(date);
      };

      {if (isLoading){
        return(
            <p>
            Loading...</p>
        )
    }

    }  

    return(    
      

        <div className="overflow-x-auto">
               <Table className="w-full table-auto">
                 <TableCaption>A list of your recent Transactions</TableCaption>
                 <TableHeader>
                   <TableRow>
                     <TableHead className="text-left">Client Name</TableHead>
                     <TableHead className="text-left">Transaction Type</TableHead>
                     <TableHead className="text-left hidden sm:table-cell">
                       Comments
                     </TableHead>
                     <TableHead className="text-left hidden md:table-cell">
                       Date
                     </TableHead>
                     <TableHead className="text-right">Amount</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {transactions.map((transaction) => (
                     <TableRow key={transaction.id}>
                       <TableCell>{transaction.accountName}</TableCell>
                       <TableCell>{transaction.type}</TableCell>
                       <TableCell className="hidden sm:table-cell">
                         {transaction.notes}
                       </TableCell>
                       <TableCell className="hidden md:table-cell">
                         {formatDate(transaction.date)}
                       </TableCell>
                       <TableCell className="text-right">{transaction.amount}</TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
             </div>
       
    )


}