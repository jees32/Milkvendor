import { InferRequestType,InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {client} from "@/lib/hono";
import { json } from "stream/consumers";

type ResposeType = InferResponseType<typeof client.api.accounts[":id"]["$patch"]>;
type RequestType= InferRequestType<typeof client.api.accounts[":id"]["$patch"]>["json"];

export const useEditAccount =(id?:string) =>{
    const queryClient=useQueryClient();

    const mutation=useMutation<
    ResposeType,
    Error,
    RequestType
    
    >
    ({
        mutationFn: async (json) => {
            const response=await client.api.accounts[":id"]["$patch"]({
                param:{id},
                json,                
            })
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Account updated")
            queryClient.invalidateQueries({ queryKey: ["account",{id}]});
            queryClient.invalidateQueries({ queryKey: ["accounts"]});
            

        },
        onError: () => {
            toast.error("Failed to edit account")
        }
    })
    return mutation;

}

