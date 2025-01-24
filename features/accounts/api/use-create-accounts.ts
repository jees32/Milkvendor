import { InferRequestType,InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {client} from "@/lib/hono";
import { json } from "stream/consumers";

type ResposeType = InferResponseType<typeof client.api.accounts.$post>;
type RequestType= InferRequestType<typeof client.api.accounts.$post>["json"];

export const useCreateAccount =() =>{
    const queryClient=useQueryClient();

    const mutation=useMutation<
    ResposeType,
    Error,
    RequestType
    
    >
    ({
        mutationFn: async (json) => {
            const response=await client.api.accounts.$post({ json })
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Created account successfully!")
            queryClient.invalidateQueries({ queryKey: ["accounts"]});
            

        },
        onError: () => {
            toast.error("Failed to create account")
        }
    })
    return mutation;

}

