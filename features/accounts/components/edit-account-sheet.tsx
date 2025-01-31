import { Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
 } from "@/components/ui/sheet";
import { useOpenAccount } from "../hooks/use-open-account";
import { AccountForm } from "./account-form";
import { insertAccountSchema } from "@/db/schema";
import { z } from "zod";
import { useCreateAccount } from "../api/use-create-accounts";
import { useGetAccount } from "../api/use-get-account";
import { Loader2 } from "lucide-react";
import { useEditAccount } from "../api/use-edit-account";
import { useDeleteAccount } from "../api/use-delete-account";
import { useEffect } from "react";

const formSchema=insertAccountSchema.pick({
    name:true,
    phone:true,
    address:true,
});

type FormValues= z.input<typeof formSchema>;

 export const EditAccountSheet= () =>{
    const {isOpen,onClose,id}=useOpenAccount();
    const accountQuery=useGetAccount(id);
    const editMutation=useEditAccount(id);
    const deleteMutation=useDeleteAccount(id);

    const isPending=editMutation.isPending || 
    deleteMutation.isPending;    
    const isLoading=accountQuery.isLoading;

    const onSubmit= (values:FormValues) => {
        editMutation.mutate(values,{
            onSuccess: () =>{
                console.log("Edit mutation success, closing sheet...");
                onClose();
            }

        }
            
        );
        console.log("Edit form submitted with values:", values);
    }
    
    const defaultValues = {
        name: accountQuery.data?.name || "",
        phone: accountQuery.data?.phone || "",
        address: accountQuery.data?.address || "",
      };
      console.log("accountQuery:",accountQuery.data)
    //   useEffect(() => {
    //     if (!isOpen) {
    //       console.log("Account sheet closed.");
    //     }
    //   }, [isOpen]);

    return(
        <Sheet open={isOpen} onOpenChange={onClose} >
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>
                        Edit Account
                    </SheetTitle>
                    <SheetDescription>
                        Update the name on the Account 
                    </SheetDescription>

                </SheetHeader>
                {
                    isLoading? (
                        <div className="absolute-inset-0 flex items-center justify-center ">
                            <Loader2 className="size-4 text-muted-foregroud animate-spin"/>

                        </div>
                    ):(
                        <AccountForm                         
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