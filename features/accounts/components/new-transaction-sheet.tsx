import { Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
 } from "@/components/ui/sheet";
import { useNewAccount } from "../hooks/use-new-account";
import { insertTransactionsSchema } from "@/db/schema";
import { z } from "zod";
import { useCreateTransaction } from "../../transactions/api/use-create-transactions";
import { useNewTransaction } from "../hooks/use-new-transaction";
import { TransactionForm } from "./transaction-form";



const formSchema=insertTransactionsSchema.pick({

    amount:true,
    name:true,
    date:true,
    type:true,
    notes:true,
});

type FormValues= z.input<typeof formSchema>;

 export const NewTransactionSheet= () =>{
    const {isOpen,onClose}=useNewTransaction();

    const mutation=useCreateTransaction();

    const onSubmit= (values:FormValues) => {
        mutation.mutate(values,{
            onSuccess: () =>{
                onClose();
            }

        }
            
        );
        console.log({ values})
    }

    return(
        <Sheet open={isOpen} onOpenChange={onClose} >
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle className="mt-8">
                        Create New Transaction
                    </SheetTitle>
                    {/* <SheetDescription>
                        Create a new transaction to be added to the account. 
                    </SheetDescription> */}

                </SheetHeader>                
               <TransactionForm
               onSubmit={onSubmit}
               disabled={mutation.isPending}
               defaultValues={{
                  name:"",                  
                  type:"",
                  date:new Date().toISOString().split("T")[0],
                  notes:"",
                  amount:0,
               }}
               />

            </SheetContent>
        </Sheet>
    )

 }