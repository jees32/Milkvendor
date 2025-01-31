import { useQuery } from "@tanstack/react-query";
import {client} from "@/lib/hono";

export const useGetDashboard = ()=> {
    const query=useQuery({
        queryKey: ["accounts","transactions"],
        queryFn: async () => {
            const response = await client.api.dashboard.$get();
            if (!response.ok){
                throw new Error("Failed to fetch accounts")
            }
            const {totalAmount,totalAccounts,topAccounts}= await response.json();           
            return {totalAmount,totalAccounts,topAccounts};
        }
    });
    return query;
}