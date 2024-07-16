import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
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
  id?: string;
  defaultValues?: CategoryFormValues;
  onSubmit: (values: CategoryFormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
}

export const CategoryForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
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
