import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { insertAccountSchema } from "@/app/api/[[...route]]/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = insertAccountSchema;

export type AccountFormValues = z.input<typeof formSchema>;

interface AccountFormProps {
  defaultValues?: AccountFormValues;
  onSubmit: (values: AccountFormValues) => void;
  disabled?: boolean;
}

export const AccountForm = ({
  defaultValues,
  onSubmit,
  disabled,
}: AccountFormProps) => {
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
    },
  });

  const handleSubmit = (values: AccountFormValues) => {
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
              <FormLabel>口座名</FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder="例：クレジットカード、銀行、現金"
                  {...field}
                />
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
