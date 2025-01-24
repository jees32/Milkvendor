import { InferRequestType,InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {client} from "@/lib/hono";
import { json } from "stream/consumers";

type ResposeType = InferResponseType<typeof client.api.accounts[":id"]["$delete"]>;


export const useDeleteAccount =(id?:string) =>{
    const queryClient=useQueryClient();

    const mutation=useMutation<
    ResposeType,
    Error 
    
    >
    ({
        mutationFn: async () => {
            const response=await client.api.accounts[":id"]["$delete"]({
                param:{id},                               
            })
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Account deleted")
            queryClient.invalidateQueries({ queryKey: ["account",{id}]});
            queryClient.invalidateQueries({ queryKey: ["accounts"]});
            

        },
        onError: () => {
            toast.error("Failed to delete account")
        }
    })
    return mutation;

}

