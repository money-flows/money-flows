"use client";

import { Command as CommandPrimitive, useCommandState } from "cmdk";
import { X } from "lucide-react";
import * as React from "react";
import { forwardRef } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

export interface Option {
  value: string;
  label: string;
}

interface MultipleSelectorProps {
  value?: Option[];
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  onChange?: (options: Option[]) => void;
}

export interface MultipleSelectorRef {
  selectedValue: Option[];
  input: HTMLInputElement;
  focus: () => void;
  reset: () => void;
}

const CommandEmpty = forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof CommandPrimitive.Empty>
>(({ className, ...props }, forwardedRef) => {
  const render = useCommandState((state) => state.filtered.count === 0);

  if (!render) return null;

  return (
    <div
      ref={forwardedRef}
      className={cn("py-6 text-center text-sm", className)}
      cmdk-empty=""
      role="presentation"
      {...props}
    />
  );
});

CommandEmpty.displayName = "CommandEmpty";

const MultiSelector = React.forwardRef<
  MultipleSelectorRef,
  MultipleSelectorProps
>(
  (
    {
      value,
      options,
      placeholder,
      disabled,
      className,
      onChange,
    }: MultipleSelectorProps,
    ref: React.Ref<MultipleSelectorRef>,
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [open, setOpen] = React.useState(false);

    const [selected, setSelected] = React.useState<Option[]>(value ?? []);
    const selectedRef = React.useRef<Option[]>(value ?? []);
    const [inputValue, setInputValue] = React.useState("");

    const updateSelected = (option?: Option) => {
      if (!option) return;
      const newOptions = [...selectedRef.current, option];
      selectedRef.current = newOptions;
      setSelected(newOptions);
    };

    React.useImperativeHandle(
      ref,
      () => ({
        selectedValue: [...selected],
        input: inputRef.current!,
        focus: () => inputRef?.current?.focus(),
        reset: () => setSelected([]),
      }),
      [selected],
    );

    const handleUnselect = React.useCallback(
      (option: Option) => {
        const newOptions = selected.filter((s) => s.value !== option.value);
        selectedRef.current = newOptions;
        setSelected(newOptions);
        onChange?.(newOptions);
      },
      [onChange, selected],
    );

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        const input = inputRef.current;
        if (input) {
          if (e.key === "Delete" || e.key === "Backspace") {
            if (input.value === "" && selected.length > 0) {
              handleUnselect(selected[selected.length - 1]);
            }
          }
        }
      },
      [handleUnselect, selected],
    );

    const selectables = React.useMemo<Option[]>(
      () =>
        options.filter(
          (option) => !selected.some((s) => s.value === option.value),
        ),
      [options, selected],
    );

    return (
      <Command className="h-auto overflow-visible bg-transparent">
        <div
          onKeyDown={handleKeyDown}
          className={cn(
            "min-h-10 rounded-md border border-input text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
            {
              "px-2 py-2": selected.length !== 0,
              "cursor-text": !disabled && selected.length !== 0,
            },
            className,
          )}
        >
          <div className="relative flex h-full flex-wrap items-center gap-1">
            {/* <div className="relative flex flex-wrap gap-1"> */}
            {selected.map((option) => {
              return (
                <Badge
                  key={option.value}
                  variant="outline"
                  className={cn(
                    "data-[disabled]:bg-muted-foreground data-[disabled]:text-muted data-[disabled]:hover:bg-muted-foreground",
                    "data-[fixed]:bg-muted-foreground data-[fixed]:text-muted data-[fixed]:hover:bg-muted-foreground",
                  )}
                  data-disabled={disabled ?? undefined}
                >
                  {option.label}
                  <button
                    className={cn(
                      "ml-1 -mr-0.5 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    )}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        handleUnselect(option);
                      }
                    }}
                    onMouseDown={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                    }}
                    onClick={() => handleUnselect(option)}
                  >
                    <X className="size-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              );
            })}
            <CommandPrimitive.Input
              ref={inputRef}
              value={inputValue}
              disabled={disabled}
              onValueChange={(value) => {
                setInputValue(value);
              }}
              onBlur={() => {
                setOpen(false);
              }}
              onFocus={() => {
                setOpen(true);
              }}
              placeholder={placeholder}
              className={cn(
                "flex-1 bg-transparent outline-none placeholder:text-muted-foreground",
                {
                  "px-3 py-2": selected.length === 0,
                  // "ml-1": selected.length !== 0,
                },
              )}
            />
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
                {selectables.map((option) => (
                  <CommandItem
                    key={option.value}
                    // value={option.value}
                    onMouseDown={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                    }}
                    onSelect={() => {
                      const newOptions = [...selected, option];

                      setInputValue("");
                      updateSelected(option);
                      onChange?.(newOptions);
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
MultiSelector.displayName = "MultipleSelector";

export { MultiSelector };
