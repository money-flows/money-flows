"use client";

import { useMemo } from "react";
import { SingleValue } from "react-select";
import CreatableSelect from "react-select/creatable";

interface SelectProps {
  onChange: (value?: string) => void;
  onCreate?: (value: string) => void;
  options?: { label: string; value: string }[];
  value?: string | null | undefined;
  disabled?: boolean;
  placeholder?: string;
}

export function Select({
  onChange,
  onCreate,
  options = [],
  value,
  disabled,
  placeholder,
}: SelectProps) {
  const handleSelect = (
    option: SingleValue<{ label: string; value: string }> | null,
  ) => {
    onChange(option?.value);
  };

  const formattedValue = useMemo(() => {
    return options.find((options) => options.value === value);
  }, [options, value]);

  return (
    <CreatableSelect
      placeholder={placeholder}
      className="text-sm"
      styles={{
        control: (base) => ({
          ...base,
          borderColor: "#e2e8f0",
          ":hover": {
            borderColor: "#e2e8f0",
          },
        }),
      }}
      value={formattedValue}
      onChange={handleSelect}
      options={options}
      onCreateOption={onCreate}
      isDisabled={disabled}
    />
  );
}
