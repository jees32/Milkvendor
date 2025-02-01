"use client";
import { useState } from "react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useGetDashboard } from "@/features/dashboard/api/use-get-dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { IndianRupee, User, CalendarDays } from "lucide-react";

export default function Home() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const { data } = useGetDashboard(
    startDate ? format(startDate, "yyyy-MM-dd") : undefined,
    endDate ? format(endDate, "yyyy-MM-dd") : undefined
  );

  const totalAmount = data?.totalAmount?.[0]?.amount ?? "Loading...";
  const totalAccounts = data?.totalAccounts?.[0]?.noOfAccounts ?? "Loading...";
  const topAccounts = data?.topAccounts ?? [];

  const handleCurrentMonth = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    if (startDate?.getTime() === firstDay.getTime() && endDate?.getTime() === lastDay.getTime()) {
      setStartDate(null);
      setEndDate(null);
    } else {
      setStartDate(firstDay);
      setEndDate(lastDay);
    }
  };

  return (
    <div className=" mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl">Welcome to Dashboard</CardTitle>
        </CardHeader>

        <CardContent>
          {/* Summary Cards + Filters in a Flexbox */}
          <div className="flex flex-wrap lg:flex-nowrap justify-between items-center gap-x-5 gap-y-4">
            {/* Summary Cards */}
            <div className="flex gap-5 flex-1">
              <Card className="flex flex-col items-center gap-3 border-2 border-black rounded-md p-2 flex-1 lg:w-auto sm:w-1/4">
                <div className="flex font-bold items-center gap-2">
                  <User className="size-6" />
                  Total Accounts:
                </div>   
                <p className="text-1xl font-semibold font-mono">{totalAccounts}</p>             
              </Card>
              

              <Card className="flex flex-col items-center gap-3 border-2 border-black rounded-md p-2 flex-1 lg:w-auto sm:w-1/4">
                <div className="flex font-bold items-center gap-2">
                  <IndianRupee className="size-6" />
                  Total Outstanding Amount:
                </div>
                <p className="text-1xl font-semibold font-mono">{totalAmount}</p>
              </Card>
            </div>

            {/* Date Range Filter + Current Month Button */}
            <div className="flex gap-4 flex-1 justify-end">
              {/* Date Picker Popover */}
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <CalendarDays className="size-5" />
                    {startDate && endDate
                      ? `${format(startDate, "MMM dd")} - ${format(endDate, "MMM dd")}`
                      : "Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-4 bg-white shadow-md rounded-md flex gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Start Date</p>
                    <Calendar
                      mode="single"
                      selected={startDate ?? undefined}
                      // onSelect={(date) => {
                      //   setStartDate(date);
                      //   if (endDate) setIsCalendarOpen(false);
                      // }}
                      onSelect={(date) => {
                        if (date) setStartDate(date); // Ensure `date` is not `undefined`
                        if (endDate) setIsCalendarOpen(false);
                      }}
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">End Date</p>
                    <Calendar
                      mode="single"
                      selected={endDate ?? undefined}
                      // onSelect={(date) => {
                      //   setEndDate(date);
                      //   if (startDate) setIsCalendarOpen(false);
                      // }}
                      onSelect={(date) => {
                        if (date) setEndDate(date); // Ensure `date` is not `undefined`
                        if (startDate) setIsCalendarOpen(false);
                      }}
                    />
                  </div>
                </PopoverContent>
              </Popover>

              {/* Current Month Button */}
              <Button onClick={handleCurrentMonth} className="flex items-center gap-2">
                <CalendarDays className="size-5" />
                {startDate && endDate ? "Reset" : "Current Month"}
              </Button>
            </div>
          </div>

          {/* Top Accounts Table */}
          <h2 className="mt-8 text-1xl font-bold">Top Accounts:</h2>
          <Table className="border border-slate-500  w-full sm:w-auto mt-3">
            <TableHeader>
              <TableRow>
                <TableHead className="text-sm font-semibold">Name</TableHead>
                <TableHead className="text-sm font-semibold">Outstanding Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topAccounts.length > 0 ? (
                topAccounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell className="text-sm font-semibold text-gray-700 px-4 py-2">{account.name}</TableCell>
                    <TableCell className="text-right text-sm font-semibold text-gray-700 px-4 py-2">{account.totalAmount}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-gray-500 p-3">
                    Loading...
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
