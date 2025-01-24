"use client";

import { useBulkDeleteTransactions } from "@/features/accounts/api/use-bulk-delete-transactions";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNewTransaction } from "@/features/accounts/hooks/use-new-transaction";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
 import {columns } from "./columns";
 import { DataTable } from "@/components/ui/data-table";

const Transactions = () => {
  const deleteTransactions =useBulkDeleteTransactions();
  const { onOpen } = useNewTransaction();
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error handling
  const [transactions, setTransactions] = useState([]);
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(date);
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/transactions");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTransactions(data.data);
      console.log("Fetched transactions:", data.data);
      
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError(error.message); // Save error to state
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    console.log("Updated transactions state:", transactions);
  }, [transactions]);

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            <div>Transactions Page</div>
          </CardTitle>
          <Button size="sm" onClick={onOpen}>
            <Plus size={16} className="mr-2" />
            Add a new Transaction
          </Button>
        </CardHeader>
        <CardContent>
         <DataTable
               onDelete={(row) => {
                 const ids=row.map((r)=> r.original.id);
                 deleteAccounts.mutate({ids});
               }} 
               filterKey="accountName" 
               columns={columns} 
               data={transactions} 
               disabled={false}
               />   
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;
