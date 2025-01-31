import Z from "zod";
import { Trash } from "lucide-react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { insertAccountSchema } from "@/db/schema";
import{
    Form,
    FormField,
    FormMessage,    
    FormControl,
    FormLabel,
    FormItem,

} from "@/components/ui/form";
import { handleClientScriptLoad } from "next/script";

const formSchema = insertAccountSchema.pick({
    name:true,
    phone:true,
    address:true,
})

type FormValues=Z.input<typeof formSchema>;

type Props = {
    id?:string;
    defaultValues?:FormValues;
    onSubmit: (values:FormValues) => void;
    onDelete?: () => void;
    disabled?: boolean;
}

export const AccountForm = ({
    id,
    defaultValues,
    onSubmit,
    onDelete,
    disabled,

}:Props) =>{

    const form=useForm<FormValues>({
        resolver:zodResolver(formSchema),
        defaultValues:defaultValues
    });

    const handleSubmit = (values:FormValues) =>{
        onSubmit(values);

    };

    const handleDelete = () => {
        onDelete?.();
    }

    return(
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} 
            className="space-y-4 pt-4">
                <FormField
                name="name"
                control={form.control}
                render={({field}) => (
                    <FormItem>
                        <FormLabel>
                            Name
                        </FormLabel>
                        <FormControl>
                           <Input
                           disabled={disabled}
                           placeholder="Enter Client's name"
                           {...field}
                           />
                           
                        </FormControl>
                    </FormItem>

                )}
                />

                <FormField
                name="phone"
                control={form.control}
                render={({field}) => (
                    <FormItem>
                        <FormLabel>
                            Phone
                        </FormLabel>
                        <FormControl>
                           <Input
                           disabled={disabled}
                           placeholder="Enter Client's phone number"
                           {...field}
                           />
                           
                        </FormControl>
                    </FormItem>

                )}
                />

                <FormField
                name="address"
                control={form.control}
                render={({field}) => (
                    <FormItem>
                        <FormLabel>
                            Address
                        </FormLabel>
                        <FormControl>
                           <Input
                           disabled={disabled}
                           placeholder="Enter Client's address"
                           {...field}
                           />
                           
                        </FormControl>
                    </FormItem>

                )}
                />
            <Button className="w-full " disabled={disabled}>
                {id? "Save Changes": "Create Account"}
            </Button>
            {!!id &&
            <Button
            type="button"
            disabled={disabled}
            onClick={handleDelete}
            className="w-full"            
            variant="outline"
            >
            <Trash className="size-4 mr-2"/>
            Delete Account
            </Button>}
            </form>

        </Form>
    )

}