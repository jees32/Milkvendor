import { InferRequestType,InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {client} from "@/lib/hono";
import { json } from "stream/consumers";

type ResposeType = InferResponseType<typeof client.api.transactions["bulk-delete"]["$post"]>;
type RequestType= InferRequestType<typeof client.api.transactions["bulk-delete"]["$post"]>;

export const useBulkDeleteTransactions =() =>{
    const queryClient=useQueryClient();

    const mutation=useMutation<
    ResposeType,    
    Error,
    RequestType
    
    >
    ({
        mutationFn: async (json) => {
            const response=await client.api.transactions["bulk-delete"]["$post"]({json});
            return await response.json();
        },
        onSuccess: () => {
            toast.success("transactionss deleted")
            queryClient.invalidateQueries({ queryKey: ["transactions"]});
            queryClient.invalidateQueries({ queryKey: ["transactions"][":id"]});
            

        },
        onError: () => {
            toast.error("Failed to delete transactions")
        }
    })
    return mutation;

}

