import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import * as React from "react";
import { useForm } from "react-hook-form";

import { AmountInput } from "@/components/amount-input";
import { DatePicker } from "@/components/date-picker";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { AccountSelectFormField } from "./account-select-form-field";
import { CategorySelectFormField } from "./category-select-form-field";
import {
  formSchema,
  TransactionApiFormValues,
  TransactionFormValues,
} from "./schema";

interface NewTransactionFormProps {
  onSubmit: (values: TransactionApiFormValues) => void;
  disabled?: boolean;
  accountOptions: { label: string; value: string }[];
  categoryOptions: { label: string; value: string }[];
}

export const NewTransactionForm = ({
  onSubmit,
  disabled,
  accountOptions,
  categoryOptions,
}: NewTransactionFormProps) => {
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
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
              <FormLabel>日付</FormLabel>
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
        <CategorySelectFormField form={form} options={categoryOptions} />
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
        <AccountSelectFormField form={form} options={accountOptions} />
        <FormField
          name="memo"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>メモ</FormLabel>
              <FormControl>
                <Textarea disabled={disabled} {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button className="w-full" disabled={disabled}>
          追加
        </Button>
      </form>
    </Form>
  );
};
