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
import { MultiSelector } from "@/components/ui/multi-selector";
import { SearchableSelect } from "@/components/ui/selector";
import { Textarea } from "@/components/ui/textarea";

import {
  formSchema,
  TransactionApiFormValues,
  TransactionFormValues,
} from "./schema";

interface TransactionFormProps {
  defaultValues?: TransactionFormValues;
  onSubmit: (values: TransactionApiFormValues) => void;
  disabled?: boolean;
  accountOptions: { label: string; value: string }[];
  incomeCategoryOptions: { label: string; value: string }[];
  expenseCategoryOptions: { label: string; value: string }[];
  incomeTagOptions: { label: string; value: string }[];
  expenseTagOptions: { label: string; value: string }[];
}

export const TransactionForm = ({
  defaultValues,
  onSubmit,
  disabled,
  accountOptions,
  incomeCategoryOptions,
  expenseCategoryOptions,
  incomeTagOptions,
  expenseTagOptions,
}: TransactionFormProps) => {
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: defaultValues?.date ?? new Date(),
      description: defaultValues?.description,
      amount: defaultValues?.amount,
      counterparty: defaultValues?.counterparty,
      memo: defaultValues?.memo,
      accountId: defaultValues?.accountId,
      categoryId: defaultValues?.categoryId,
      tagIds: defaultValues?.tagIds,
    },
  });

  const handleSubmit = (values: TransactionFormValues) => {
    // TODO: Add validation to ensure the required fields are filled

    onSubmit({
      ...values,
      date: format(values.date, "yyyy-MM-dd"),
      description: values.description === "" ? null : values.description,
      amount: parseInt(values.amount),
      memo: values.memo === "" ? null : values.memo,
      categoryId: values.categoryId === "" ? null : values.categoryId,
      tagIds: values.tagIds ?? [],
    });
  };

  const isExpense = form.watch("amount")?.startsWith("-");

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
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>内容</FormLabel>
              <FormControl>
                <Textarea disabled={disabled} {...field} />
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
        {isExpense ? (
          <FormField
            name="categoryId"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>カテゴリー</FormLabel>
                <SearchableSelect {...field} options={expenseCategoryOptions} />
              </FormItem>
            )}
          />
        ) : (
          <FormField
            name="categoryId"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>カテゴリー</FormLabel>
                <SearchableSelect {...field} options={incomeCategoryOptions} />
              </FormItem>
            )}
          />
        )}
        {isExpense ? (
          <FormField
            name="tagIds"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>タグ</FormLabel>
                <MultiSelector
                  {...field}
                  value={field.value?.map((tagId) => ({
                    label: expenseTagOptions.find((t) => t.value === tagId)!
                      .label,
                    value: tagId,
                  }))}
                  options={expenseTagOptions}
                  onChange={(tags) =>
                    field.onChange(tags.map((tag) => tag.value))
                  }
                />
              </FormItem>
            )}
          />
        ) : (
          <FormField
            name="tagIds"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>タグ</FormLabel>
                <MultiSelector
                  {...field}
                  value={field.value?.map((tagId) => ({
                    label: incomeTagOptions.find((t) => t.value === tagId)!
                      .label,
                    value: tagId,
                  }))}
                  options={incomeTagOptions}
                  onChange={(tags) =>
                    field.onChange(tags.map((tag) => tag.value))
                  }
                />
              </FormItem>
            )}
          />
        )}
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
          name="accountId"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>口座</FormLabel>
              <SearchableSelect {...field} options={accountOptions} />
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
          送信
        </Button>
      </form>
    </Form>
  );
};
