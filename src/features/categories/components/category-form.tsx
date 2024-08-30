import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { insertCategorySchema } from "@/app/api/[[...route]]/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = insertCategorySchema;

export type CategoryFormValues = z.input<typeof formSchema>;

interface CategoryFormProps {
  defaultValues?: CategoryFormValues;
  onSubmit: (values: CategoryFormValues) => void;
  disabled?: boolean;
}

export const CategoryForm = ({
  defaultValues,
  onSubmit,
  disabled,
}: CategoryFormProps) => {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
    },
  });

  const handleSubmit = (values: CategoryFormValues) => {
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
              <FormLabel>カテゴリー名</FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder="例：食費、交通費、給料"
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
