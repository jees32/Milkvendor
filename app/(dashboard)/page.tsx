"use client"
import { UserButton } from "@clerk/nextjs"
import { currentUser } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useNewAccount } from "@/features/accounts/hooks/use-new-account";
import { useGetDashboard } from "@/features/dashboard/api/use-get-dashboard";
import { Card,
  CardContent,
  CardHeader,
  CardTitle
 } from '@/components/ui/card';
 import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { IndianRupee,User } from "lucide-react";
export default function Home() {  

  const {data}= useGetDashboard();
console.log("Data on dashboard",data);

const totalAmount = data?.totalAmount?.[0]?.amount ?? "Loading...";
  const totalAccounts = data?.totalAccounts?.[0]?.noOfAccounts ?? "Loading...";
  const topAccounts = data?.topAccounts?? [];
  console.log("Full data object:", data);


  return(
    <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
    <Card className='border-none drop-shadow-sm'>
      <CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between'>
        <CardTitle className='text-xl line-clamp-1'>
    Welcome to Dashboard
    </CardTitle>     
    </CardHeader>

    <CardContent>  
    <div className="flex gap-5 ">
    <div className="flex flex-col items-center  gap-3 justify-center border-2  border-black rounded-md p-2 w-1/4">
      
      <div className="flex font-bold ">
        <User className="size-6"/>
        Total Accounts:
        </div>
        <p className="text-1xl  font-semibold font-mono" >{totalAccounts}</p>
        
        </div>

        <div className="flex flex-col items-center  gap-2 justify-center border-2  border-black rounded-md p-3 w-1/4">
        <div className="flex font-bold ">
          <IndianRupee className="size-6"/>
          Total Outstanding Amount:     
          </div>     
        <p className="text-1xl  font-semibold font-mono">{totalAmount}</p>
        
        </div>
        </div>
       
      
 	<h2 className="mt-8 text-1xl font-bold"> Top Accounts:</h2> 
   <Table className="border border-black rounded-md w-1/4 mt-3 ">
  <TableHeader>
    <TableRow >
      <TableHead className="text-sm font-semibold mt-2">Name</TableHead>
      <TableHead className="text-sm font-semibold mt-2">Outstanding Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {topAccounts.length > 0 ? (
      topAccounts.map((account) => (
        <TableRow key={account.id}>
          <TableCell>{account.name}</TableCell>
          <TableCell className="text-right">{account.totalAmount}</TableCell>
        </TableRow>
      ))
    ) : (
      <TableRow>
        <TableCell colSpan={2} className="text-center text-gray-500 p-3">
          Loading...
        </TableCell>
      </TableRow>
    )}
  </TableBody>
</Table>
     
    </CardContent>
    </Card>    

  
      
    </div>

      )

      }
    

 
