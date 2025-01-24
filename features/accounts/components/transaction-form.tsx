import Z from "zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { insertTransactionsSchema } from "@/db/schema";
import { useState } from "react";

import {
  Form,
  FormField,
  FormMessage,
  FormControl,
  FormLabel,
  FormItem,
} from "@/components/ui/form";

import { DatePicker } from "@/components/ui/date-picker"; // Import DatePicker from shadcn/ui

const formSchema = insertTransactionsSchema.pick({
  amount: true,
  name: true,
  date: true,
  type: true,
  notes: true,
});

type FormValues = Z.input<typeof formSchema>;

type Props = {
  id?: string;
  defaultValues?: FormValues;
  onSubmit: (values: FormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
};

export const TransactionForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
}: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const handleSubmit = (values: FormValues) => {
    console.log("The form data is", values);
    onSubmit(values);
  };

  const handleDelete = () => {
    onDelete?.();
  };

  const data = [
    { name: "Name", placeHolder: "Name on the account" },
    { name: "Amount", placeHolder: "Amount in INR" },
    { name: "Date", placeHolder: "YEAR-MM-DD" },
    { name: "Type", placeHolder: "Enter sale or payment" },
    { name: "Notes", placeHolder: "Additional notes" },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
        {data.map((fieldData, index) => (
          <FormField
            key={index}
            name={fieldData.name.toLowerCase()} // Assuming the form field names match
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{fieldData.name}</FormLabel>
                <FormControl>
                  {fieldData.name.toLowerCase() === "date" ? (
                    <DatePicker
                      selected={field.value ? new Date(field.value) : undefined} // Convert string date to Date object
                      // onChange={(date) =>
                      //   field.onChange(date)
                      // }
                      onChange={(date) => {
                        if (date) {
                          const correctedDate = new Date(date);
                          correctedDate.setHours(12, 0, 0, 0); // Set the time to noon to eliminate timezone issues
                          field.onChange(correctedDate.toISOString()); // Update with the corrected ISO string
                        } else {
                          field.onChange(""); // Clear the value if no date is selected
                        }
                      }}
                      placeholderText="Select a date"
                      disabled={disabled}
                    />
                  ) : (
                    <Input
                      type={
                        fieldData.name.toLowerCase() === "amount" ? "number" : "text"
                      }
                      disabled={disabled}
                      placeholder={fieldData.placeHolder}
                      {...form.register(fieldData.name.toLowerCase(), {
                        valueAsNumber:
                          fieldData.name.toLowerCase() === "amount", // Only for the "amount" field
                      })}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <Button className="w-full " disabled={disabled}>
          {id ? "Save Changes" : "Create Transaction"}
        </Button>
        {!!id && (
          <Button
            type="button"
            disabled={disabled}
            onClick={handleDelete}
            className="w-full"
            variant="outline"
          >
            <Trash className="size-4 mr-2" />
            Delete Account
          </Button>
        )}
      </form>
    </Form>
  );
};
