"use client"

import { useGetAccount } from "@/features/accounts/api/use-get-account"
import { useGetTransactionsByID } from "@/features/transactions/api/use-get-transactions-byid";
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
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/app/(dashboard)/transactions/columns";
import { useBulkDeleteTransactions } from "@/features/transactions/api/use-bulk-delete-transactions";



export const TransactionsByID = ({id})=> {
    const [isLoading,setLoading]=useState(true);
    const transQuery=useGetTransactionsByID(id);
    const transactions=Array.isArray(transQuery.data) ? transQuery.data : [];
    const deleteTransactions=useBulkDeleteTransactions();
    console.log("Data from usegetTBID",transactions);

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
          {transactions.length>0?(<h1 className="mt-4 ml-2 font-bold ">Transactions by {transactions[0].name }</h1>
        ):(<h1 className="mt-4 ml-2 font-bold ">No transaction available for the account</h1>)}
          
          <DataTable
                         onDelete={(row) => {
                           const ids=row.map((r)=> r.original.id);
                           deleteTransactions.mutate({ids});
                         }}                          
                         columns={columns} 
                         data={transactions} 
                         disabled={false}
                         />   
             </div>
       
    )


}