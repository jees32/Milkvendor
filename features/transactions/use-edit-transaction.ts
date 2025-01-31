import { InferRequestType,InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {client} from "@/lib/hono";
import { json } from "stream/consumers";

type ResposeType = InferResponseType<typeof client.api.transactions[":id"]["$patch"]>;
type RequestType= InferRequestType<typeof client.api.transactions[":id"]["$patch"]>["json"];

export const useEditTransaction =(id?:string) =>{
    const queryClient=useQueryClient();

    const mutation=useMutation<
    ResposeType,
    Error,
    RequestType
    
    >
    ({
        mutationFn: async (json) => {
            const response=await client.api.transactions[":id"]["$patch"]({
                param:{id},
                json,                
            })
            return await response.json();
            
        },
        onSuccess: () => {
            toast.success("Transaction updated")
           
             queryClient.invalidateQueries({ queryKey: ["accounts",]});
             queryClient.invalidateQueries({ queryKey: ["transactions"]});

        },
        onError: () => {
            toast.error("Failed to edit transaction")
        }
    })
    return mutation;

}

