import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { insertTransactionSchema } from "@/app/api/[[...route]]/schema";
import { AmountInput } from "@/components/amount-input";
import { DatePicker } from "@/components/date-picker";
import { Select } from "@/components/select";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  amount: z.string(),
  counterparty: z.string(),
  date: z.coerce.date(),
  memo: z.string(),
  accountId: z.string(),
  categoryId: z.string(),
});

const apiSchema = insertTransactionSchema;

export type TransactionFormValues = z.input<typeof formSchema>;
export type TransactionApiFormValues = z.input<typeof apiSchema>;

interface TransactionFormProps {
  id?: string;
  defaultValues?: Partial<TransactionFormValues>;
  onSubmit: (values: TransactionApiFormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
  accountOptions: { label: string; value: string }[];
  onCreateAccount: (name: string) => void;
}

export const TransactionForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
  accountOptions,
  onCreateAccount,
}: TransactionFormProps) => {
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: defaultValues?.amount ?? "",
      counterparty: defaultValues?.counterparty ?? "",
      date: defaultValues?.date ?? new Date(),
      memo: defaultValues?.memo ?? "",
      accountId: defaultValues?.accountId,
      categoryId: defaultValues?.categoryId ?? "",
    },
  });

  const handleSubmit = (values: TransactionFormValues) => {
    // TODO: Add validation to ensure the required fields are filled

    onSubmit({
      ...values,
      categoryId: values.categoryId === "" ? null : values.categoryId,
      memo: values.memo === "" ? null : values.memo,
      amount: parseInt(values.amount),
      date: format(values.date, "yyyy-MM-dd"),
    });
  };

  const handleDelete = () => {
    onDelete?.();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 pt-4"
      >
        <FormField
          name="date"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>取引日</FormLabel>
              <FormControl>
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="accountId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>口座</FormLabel>
              <FormControl>
                <Select
                  placeholder="口座を選択"
                  options={accountOptions}
                  onCreate={onCreateAccount}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="counterparty"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>取引先</FormLabel>
              <FormControl>
                <Input disabled={disabled} {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="amount"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>金額</FormLabel>
              <FormControl>
                <AmountInput {...field} disabled={disabled} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button className="w-full" disabled={disabled}>
          {id ? "更新" : "追加"}
        </Button>
        {!!id && (
          <Button
            type="button"
            disabled={disabled}
            onClick={handleDelete}
            className="w-full"
            variant="outline"
          >
            <Trash className="mr-2 size-4" />
            削除
          </Button>
        )}
      </form>
    </Form>
  );
};
