import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { insertTagSchema } from "@/app/api/[[...route]]/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const formSchema = insertTagSchema;

export type TagFormValues = z.input<typeof formSchema>;

interface TagFormProps {
  defaultValues?: TagFormValues;
  onSubmit: (values: TagFormValues) => void;
  disabled?: boolean;
}

export const TagForm = ({
  defaultValues,
  onSubmit,
  disabled,
}: TagFormProps) => {
  const form = useForm<TagFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      type: defaultValues?.type ?? "expense",
    },
  });

  const handleSubmit = (values: TagFormValues) => {
    // TODO: Add validation to ensure the required fields are filled
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 pt-4"
      >
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>タグ名</FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder="例：固定費、サブスクリプション"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>種別</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="expense" />
                    </FormControl>
                    <FormLabel className="font-normal">支出</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="income" />
                    </FormControl>
                    <FormLabel className="font-normal">収入</FormLabel>
                  </FormItem>
                </RadioGroup>
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
