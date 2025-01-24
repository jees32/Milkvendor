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
const formSchema=insertAccountSchema.pick({
    name:true
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
                onClose();
            }

        }
            
        );
        console.log({ values})
    }
    const defaultValues= accountQuery.data? {
        name:accountQuery.data.name
    }:{
        name:"",
    }
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
                        onDelete={ () => deleteMutation.mutate() }
                        onSubmit={onSubmit}
                        disabled={isPending}
                        defaultValues={defaultValues}/>

                    )
                }
               
            </SheetContent>
        </Sheet>
    )

 }