import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetDashboard = (startDate?: string, endDate?: string) => {
  const query = useQuery({
    queryKey: ["dashboard", startDate, endDate], // Include date filters in cache key
    queryFn: async () => {
      const response = await client.api.dashboard.$get({
        query: { startDate, endDate }, // Send dates as query params
      });

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      return response.json();
    },
  });

  return query;
};
