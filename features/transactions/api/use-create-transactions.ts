import { InferRequestType,InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {client} from "@/lib/hono";
import { json } from "stream/consumers";

type ResposeType = InferResponseType<typeof client.api.accounts.$post>;
type RequestType= InferRequestType<typeof client.api.accounts.$post>["json"];

export const useCreateTransaction =() =>{
    const queryClient=useQueryClient();
    const mutation=useMutation<
    ResposeType,
    Error,
    RequestType
    
    >
    ({
        mutationFn: async (json) => {
            const response=await client.api.transactions.$post({ json })
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Created transaction successfully!")
            queryClient.invalidateQueries({ queryKey: ["transactions"]});
            queryClient.invalidateQueries({ queryKey: ["accounts"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard"]});

        },
        onError: () => {
            toast.error("Failed to create transaction")
        }
    })
    return mutation;

}

