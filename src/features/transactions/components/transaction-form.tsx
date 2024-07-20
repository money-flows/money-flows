import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Trash } from "lucide-react";
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

interface TransactionFormProps {
  id?: string;
  defaultValues?: TransactionFormValues;
  onSubmit: (values: TransactionApiFormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
  accountOptions: { label: string; value: string }[];
  categoryOptions: { label: string; value: string }[];
}

export const TransactionForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
  accountOptions,
  categoryOptions,
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
        <AccountSelectFormField form={form} options={accountOptions} />
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
