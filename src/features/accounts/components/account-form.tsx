import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
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
  id?: string;
  defaultValues?: AccountFormValues;
  onSubmit: (values: AccountFormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
}

export const AccountForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
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
