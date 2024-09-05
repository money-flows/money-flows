"use client";

import { Command as CommandPrimitive } from "cmdk";
import { ChevronsUpDown, X } from "lucide-react";
import * as React from "react";

import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

import { Button } from "./button";

export interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  value?: string;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  onChange?: (value?: string) => void;
}

export interface SearchableSelectRef {
  selectedValue?: Option;
  input: HTMLInputElement;
}

const SearchableSelect = React.forwardRef<
  SearchableSelectRef,
  SearchableSelectProps
>(
  (
    {
      value,
      options,
      placeholder,
      disabled,
      className,
      onChange,
    }: SearchableSelectProps,
    ref: React.Ref<SearchableSelectRef>,
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [open, setOpen] = React.useState(false);

    const [selected, setSelected] = React.useState<Option>();
    const selectedRef = React.useRef<Option>();
    const [inputValue, setInputValue] = React.useState(value ?? "");

    const updateSelected = (option?: Option) => {
      selectedRef.current = option;
      setSelected(option);
    };

    React.useImperativeHandle(
      ref,
      () => ({
        selectedValue: selected,
        input: inputRef.current!,
        focus: () => inputRef.current?.focus(),
      }),
      [selected],
    );

    return (
      <Command className="h-auto overflow-visible bg-transparent">
        <div
          className={cn(
            "rounded-md h-10 border border-input text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
            className,
          )}
        >
          <div className="relative flex h-full flex-wrap items-center gap-1 px-3 py-2">
            <CommandPrimitive.Input
              ref={inputRef}
              value={inputValue}
              disabled={disabled}
              onValueChange={(value) => {
                setInputValue(value);
                if (value === "") {
                  updateSelected(undefined);
                  onChange?.(undefined);
                }
              }}
              onBlur={() => {
                setInputValue(selectedRef.current?.label ?? "");
                setOpen(false);
              }}
              onFocus={() => {
                setOpen(true);
              }}
              placeholder={placeholder}
              className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
            />
            <span
              className={cn(
                "inline-flex absolute right-1.5 size-7 p-1.5 items-center justify-center text-muted-foreground opacity-50",
                selected && "hidden",
              )}
            >
              <ChevronsUpDown />
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onMouseDown={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
              onClick={() => {
                setInputValue("");
                updateSelected(undefined);
                onChange?.(undefined);
                inputRef.current?.blur();
              }}
              className={cn(
                "absolute right-1.5 size-7 p-1.5 text-muted-foreground",
                (disabled ?? !selected) && "hidden",
              )}
            >
              <X />
            </Button>
          </div>
        </div>
        <div className="relative mt-2">
          <CommandList
            onMouseUp={() => {
              inputRef.current?.focus();
            }}
            className={cn(
              "absolute top-1 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in",
              !open && "hidden",
            )}
          >
            {open && (
              <CommandGroup className="h-full overflow-auto">
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    // value={option.value}
                    onMouseDown={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                    }}
                    onSelect={() => {
                      setInputValue(option.label);
                      updateSelected(option);
                      onChange?.(option.value);
                      inputRef.current?.blur();
                    }}
                    className="cursor-pointer"
                  >
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </div>
      </Command>
    );
  },
);
SearchableSelect.displayName = "SearchableSelect";

export { SearchableSelect };
