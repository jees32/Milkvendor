import Z from "zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { insertTransactionsSchema } from "@/db/schema";
import { useEffect, useState } from "react";
import { NameField } from "../../../components/ui/namefield";
import {
  Form,
  FormField,
  FormMessage,
  FormControl,
  FormLabel,
  FormItem,
} from "@/components/ui/form";

import { DatePicker } from "@/components/ui/date-picker";

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
    { name: "Type", placeHolder: "Enter sale or payment" },
    { name: "Notes", placeHolder: "Additional notes" },
  ];
  console.log("defaultvalues in transaction form",defaultValues);

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form.reset]);


  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className=" p-2 flex flex-col justify-around h-full"
      >
        <div className="flex-grow space-y-2">
          {data.map((fieldData, index) => (
            <FormField
              key={index}
              name={fieldData.name.toLowerCase()}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{fieldData.name}</FormLabel>
                  <FormControl>
                    {fieldData.name.toLowerCase() === "name" ? (
                      <NameField
                        value={field.value}
                        onChange={field.onChange}
                        disabled={disabled}
                      />
                    ) : fieldData.name.toLowerCase() === "type" ? (
                      <select
                        {...field}
                        disabled={disabled}
                        className="w-full p-2 border rounded"
                      >
                        <option value="">Select type</option>
                        <option value="Debt">Debt</option>
                        <option value="Payment">Payment</option>
                      </select>
                    ) : fieldData.name.toLowerCase() === "notes" ? (
                      <Input
                        type="text"
                        disabled={disabled}
                        placeholder={fieldData.placeHolder}
                        {...form.register(fieldData.name.toLowerCase())}
                      />
                    ) : (
                      <Input
                        type={
                          fieldData.name.toLowerCase() === "amount" ? "number" : "text"
                        }
                        disabled={disabled}
                        placeholder={fieldData.placeHolder}
                        {...form.register(fieldData.name.toLowerCase(), {
                          valueAsNumber: fieldData.name.toLowerCase() === "amount",
                        })}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        {/* Date field at the bottom */}
        <div className="mt-1">
        <FormField
          name="date"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <DatePicker
                  selected={field.value ? new Date(field.value).toISOString().split("T")[0] : undefined}
                  onChange={(date) => {
                    if (date) {
                      const correctedDate = new Date(date);
                      correctedDate.setHours(12, 0, 0, 0);
                      console.log(date);
                      console.log(correctedDate);
                      field.onChange(correctedDate.toISOString());
                    } else {
                      field.onChange("");
                    }
                  }}
                  placeholderText="Select a date"
                  disabled={disabled}
                />
                
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        <div className="mt-4">
        <Button className="w-full" disabled={disabled}>
          {id ? "Save Changes" : "Create Transaction"}
        </Button>
        </div>
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
