import { useQuery } from "@tanstack/react-query";
import {client} from "@/lib/hono";

export const useGetTransactionsByTID = (tid?:string)=> {
    console.log("Fetching transactions for TID:", tid);
    const query=useQuery({
        enabled:!!tid,
        queryKey: ["transaction",{ tid }],
        queryFn: async () => {
            const response = await client.api.transactions["tid/:tid"].$get(
                {param:{tid}, }
            );
            if (!response.ok ){
                throw new Error("Failed to fetch transactions")
            }
            const {data}=await response.json();
            console.log("Data from useGetTransactionbyTID",data)
            return data;
        }
    });
    return query;
}