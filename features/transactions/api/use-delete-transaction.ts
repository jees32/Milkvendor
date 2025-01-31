import { InferRequestType,InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {client} from "@/lib/hono";
import { json } from "stream/consumers";

type ResposeType = InferResponseType<typeof client.api.transactions[":id"]["$delete"]>;


export const useDeleteTransaction =(id?:string) =>{
    const queryClient=useQueryClient();

    const mutation=useMutation<
    ResposeType,
    Error 
    
    >
    ({
        mutationFn: async () => {
            const response=await client.api.transactions[":id"]["$delete"]({
                param:{id},                               
            })
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Transaction deleted")
            queryClient.invalidateQueries({ queryKey: ["transactions",{id}]});
            queryClient.invalidateQueries({ queryKey: ["transactions"]});
            

        },
        onError: () => {
            toast.error("Failed to delete transaction")
        }
    })
    return mutation;

}

