"use client";

import { format } from "date-fns";
import { CalendarIcon, Check } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Separator } from "./separator";

export interface DateRangePickerProps {
  onUpdate?: (range: DateRange) => void;
  from?: Date;
  to?: Date;
  locale?: string;
}

const formatDate = (date: Date) => {
  return format(date, "yyyy/MM/dd");
};

const getDateAdjustedForTimezone = (dateInput: Date | string): Date => {
  if (typeof dateInput === "string") {
    // Split the date string to get year, month, and day parts
    const parts = dateInput.split("-").map((part) => parseInt(part, 10));
    // Create a new Date object using the local timezone
    // Note: Month is 0-indexed, so subtract 1 from the month part
    const date = new Date(parts[0], parts[1] - 1, parts[2]);
    return date;
  } else {
    // If dateInput is already a Date object, return it directly
    return dateInput;
  }
};

export interface DateRange {
  from: Date;
  to: Date | undefined;
}

interface Preset {
  name: string;
  label: string;
}

// Define presets
const PRESETS: Preset[] = [
  { name: "thisWeek", label: "今週" },
  { name: "lastWeek", label: "先週" },
  { name: "thisMonth", label: "今月" },
  { name: "lastMonth", label: "先月" },
  { name: "last14", label: "過去14日間" },
  { name: "last30", label: "過去30日間" },
];

/** The DateRangePicker component allows a user to select a range of dates */
export const DateRangePicker = ({
  from = new Date(new Date().setHours(0, 0, 0, 0)),
  to,
  onUpdate,
}: DateRangePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const [range, setRange] = useState<DateRange>({
    from: getDateAdjustedForTimezone(from),
    to: to ? getDateAdjustedForTimezone(to) : getDateAdjustedForTimezone(from),
  });
  const openedRangeRef = useRef<DateRange | undefined>();

  const [selectedPreset, setSelectedPreset] = useState<string | undefined>(
    undefined,
  );

  const [isSmallScreen, setIsSmallScreen] = useState(
    typeof window !== "undefined" ? window.innerWidth < 960 : false,
  );

  useEffect(() => {
    const handleResize = (): void => {
      setIsSmallScreen(window.innerWidth < 960);
    };

    window.addEventListener("resize", handleResize);

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const getPresetRange = (presetName: string): DateRange => {
    const preset = PRESETS.find(({ name }) => name === presetName);
    if (!preset) throw new Error(`Unknown date range preset: ${presetName}`);
    const from = new Date();
    const to = new Date();
    const first = from.getDate() - from.getDay();

    switch (preset.name) {
      case "thisWeek":
        from.setDate(first);
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
        break;
      case "lastWeek":
        from.setDate(from.getDate() - 7 - from.getDay());
        to.setDate(to.getDate() - to.getDay() - 1);
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
        break;
      case "thisMonth":
        from.setDate(1);
        from.setHours(0, 0, 0, 0);
        to.setMonth(to.getMonth() + 1);
        to.setDate(0);
        to.setHours(23, 59, 59, 999);
        break;
      case "lastMonth":
        from.setMonth(from.getMonth() - 1);
        from.setDate(1);
        from.setHours(0, 0, 0, 0);
        to.setDate(0);
        to.setHours(23, 59, 59, 999);
        break;
      case "last14":
        from.setDate(from.getDate() - 13);
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
        break;
      case "last30":
        from.setDate(from.getDate() - 29);
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
        break;
    }

    return { from, to };
  };

  const setPreset = (preset: string): void => {
    const range = getPresetRange(preset);
    setRange(range);
  };

  const checkPreset = (): void => {
    for (const preset of PRESETS) {
      const presetRange = getPresetRange(preset.name);

      const normalizedRangeFrom = new Date(range.from);
      normalizedRangeFrom.setHours(0, 0, 0, 0);
      const normalizedPresetFrom = new Date(
        presetRange.from.setHours(0, 0, 0, 0),
      );

      const normalizedRangeTo = new Date(range.to ?? 0);
      normalizedRangeTo.setHours(0, 0, 0, 0);
      const normalizedPresetTo = new Date(
        presetRange.to?.setHours(0, 0, 0, 0) ?? 0,
      );

      if (
        normalizedRangeFrom.getTime() === normalizedPresetFrom.getTime() &&
        normalizedRangeTo.getTime() === normalizedPresetTo.getTime()
      ) {
        setSelectedPreset(preset.name);
        return;
      }
    }

    setSelectedPreset(undefined);
  };

  const resetValues = (): void => {
    setRange({
      from: typeof from === "string" ? getDateAdjustedForTimezone(from) : from,
      to: to
        ? typeof to === "string"
          ? getDateAdjustedForTimezone(to)
          : to
        : typeof from === "string"
          ? getDateAdjustedForTimezone(from)
          : from,
    });
  };

  useEffect(() => {
    checkPreset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

  const PresetButton = ({
    preset,
    label,
    isSelected,
  }: {
    preset: string;
    label: string;
    isSelected: boolean;
  }): JSX.Element => (
    <Button
      size="sm"
      variant="ghost"
      onClick={() => {
        setPreset(preset);
      }}
      className={cn(
        "w-full font-normal justify-start pl-1 pr-8",
        isSelected && "pointer-events-none",
      )}
    >
      <>
        <span className={cn("pr-2 opacity-0", isSelected && "opacity-70")}>
          <Check className="size-4" />
        </span>
        {label}
      </>
    </Button>
  );

  // Helper function to check if two date ranges are equal
  const areRangesEqual = (a?: DateRange, b?: DateRange): boolean => {
    if (!a || !b) return a === b; // If either is undefined, return true if both are undefined
    return (
      a.from.getTime() === b.from.getTime() &&
      (!a.to || !b.to || a.to.getTime() === b.to.getTime())
    );
  };

  useEffect(() => {
    if (isOpen) {
      openedRangeRef.current = range;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Popover
      modal={true}
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) {
          resetValues();
        }
        setIsOpen(open);
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full border-0 bg-white/10 font-normal text-white outline-none transition hover:bg-white/20 hover:text-white focus:bg-white/30 focus:ring-transparent focus:ring-offset-0 lg:w-auto"
        >
          <CalendarIcon className="mr-2 size-4" />
          <span className="tabular-nums tracking-tighter">{`${formatDate(from)}${
            to != null ? " - " + formatDate(to) : ""
          }`}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="flex py-2">
          <div className="flex">
            <div className="flex flex-col">
              {isSmallScreen && (
                <Select
                  defaultValue={selectedPreset}
                  onValueChange={(value) => {
                    setPreset(value);
                  }}
                >
                  <div className="px-4 py-2">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </div>
                  <SelectContent>
                    {PRESETS.map((preset) => (
                      <SelectItem key={preset.name} value={preset.name}>
                        {preset.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <div>
                <Calendar
                  mode="range"
                  onSelect={(value: { from?: Date; to?: Date } | undefined) => {
                    if (value?.from != null) {
                      setRange({ from: value.from, to: value?.to });
                    }
                  }}
                  selected={range}
                  numberOfMonths={isSmallScreen ? 1 : 2}
                  defaultMonth={
                    new Date(
                      new Date().setMonth(
                        new Date().getMonth() - (isSmallScreen ? 0 : 1),
                      ),
                    )
                  }
                />
              </div>
            </div>
          </div>
          {!isSmallScreen && (
            <>
              <Separator orientation="vertical" className="h-auto" />
              <div className="flex w-full flex-col items-end gap-1 p-2">
                <div className="flex w-full flex-col items-end gap-1">
                  {PRESETS.map((preset) => (
                    <PresetButton
                      key={preset.name}
                      preset={preset.name}
                      label={preset.label}
                      isSelected={selectedPreset === preset.name}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        <div className="flex justify-end gap-2 p-3 pt-0 lg:pt-1">
          <Button
            onClick={() => {
              setIsOpen(false);
              resetValues();
            }}
            variant="ghost"
          >
            やめる
          </Button>
          <Button
            onClick={() => {
              setIsOpen(false);
              if (!areRangesEqual(range, openedRangeRef.current)) {
                onUpdate?.(range);
              }
            }}
          >
            更新
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
DateRangePicker.displayName = "DateRangePicker";
