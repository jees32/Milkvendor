"use client"
import { UserButton } from "@clerk/nextjs"
import { currentUser } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useNewAccount } from "@/features/accounts/hooks/use-new-account";

export default function Home() {  

  // const {data:accounts}=useGetAccounts();
  // console.log("Data is",accounts);
  const {onOpen}=useNewAccount();

  return(
    <div className="border border-black p-3 rounded-sm mt-2 sm:w-auto">
      <h1 className="text-2xl">Overview</h1>
      <div>
        Financial Overview
      </div>
     
     
      </div>
      )

      }
    

 
