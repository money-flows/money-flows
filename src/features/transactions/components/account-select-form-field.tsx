import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { TransactionFormValues } from "./schema";

interface AccountSelectFormFieldProps {
  form: ReturnType<typeof useForm<TransactionFormValues>>;
  options: { label: string; value: string }[];
}

export function AccountSelectFormField({
  form,
  options,
}: AccountSelectFormFieldProps) {
  return (
    <FormField
      name="accountId"
      control={form.control}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>口座</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "justify-between font-normal",
                    !field.value && "text-muted-foreground",
                  )}
                >
                  <span>
                    {field.value &&
                      options.find((option) => option.value === field.value)
                        ?.label}
                  </span>
                  <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Command>
                <CommandInput placeholder="口座を検索" />
                <CommandList>
                  <CommandEmpty>
                    <span className="text-muted-foreground">
                      口座が見つかりません
                    </span>
                  </CommandEmpty>
                  <CommandGroup>
                    {options.map((option) => (
                      <CommandItem
                        value={option.label}
                        key={option.value}
                        onSelect={() => {
                          form.setValue("accountId", option.value);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 size-4",
                            option.value === field.value
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {option.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </FormItem>
      )}
    />
  );
}
