import { Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useOpenTransaction } from "../hooks/use-open-transaction";
import { TransactionForm } from "./transaction-form";
import { insertTransactionsSchema, transactions } from '../../../db/schema';
import { z } from "zod";
import { useCreateAccount } from "../api/use-create-accounts";
import { useGetTransactionsByID } from "@/features/transactions/api/use-get-transactions-byid";
import { Loader2 } from "lucide-react";
import { useEditAccount } from "../api/use-edit-account";
import { useDeleteTransaction } from "@/features/transactions/api/use-delete-transaction";
import { useEditTransaction } from "@/features/transactions/use-edit-transaction";
import { useGetTransactionsByTID } from "@/features/transactions/api/use-get-transaction-bytid";



const formSchema=insertTransactionsSchema.pick({
  amount: true,
  name: true,
  date: true,
  type: true,
  notes: true,
});

type FormValues= z.input<typeof formSchema>;

export const EditTransactionSheet= () =>{
  const {isOpen,onClose,id}=useOpenTransaction();
  const transactionQuery=useGetTransactionsByTID(id);
  const editMutation=useEditTransaction(id);
  const deleteMutation=useDeleteTransaction(id);
 

  const isPending=editMutation.isPending 
  // || 
  // deleteMutation.isPending;    
  const isLoading=transactionQuery.isLoading;

  const onSubmit= (values:FormValues) => {
      editMutation.mutate(values,{
          onSuccess: () =>{
              console.log("Edit mutation success, closing sheet...");
              onClose();
          }

      }
          
      );
      console.log("Edit transaction form submitted with values:", values);
  }
  
  const transaction = transactionQuery.data?.[0]; // Get the first item in the array

  const defaultValues = transaction
    ? {
        name: transaction.name,
        amount: transaction.amount,
        date: transaction.date,
        type: transaction.type,
        notes: transaction.notes,
      }
    : undefined;

    console.log({
      isLoading: transactionQuery.isLoading,
      isError: transactionQuery.isError,
      error: transactionQuery.error,
      data: transactionQuery.data,
      dataType: typeof transactionQuery.data,
    });
   console.log("defaultValues",defaultValues)
  return(
      <Sheet open={isOpen} onOpenChange={onClose} >
          <SheetContent className="space-y-4 !pointer-events-auto">
              <SheetHeader>
                  <SheetTitle>
                      Edit Transaction
                  </SheetTitle>
                  <SheetDescription>
                      Update the transaction details
                  </SheetDescription>

              </SheetHeader>
              {
                  isLoading? (
                      <div className="absolute-inset-0 flex items-center justify-center ">
                          <Loader2 className="size-4 text-muted-foregroud animate-spin"/>

                      </div>
                  ):(
                      <TransactionForm
                      
                      id={id}
                      onDelete={ () => deleteMutation.mutate({id}) }
                      onSubmit={onSubmit}
                      disabled={isPending}
                      defaultValues={defaultValues}/>

                  )
              }
             
          </SheetContent>
      </Sheet>
  )

}