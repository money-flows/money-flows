import { MultiSelector, Option } from "@/components/ui/multi-selector";

interface MultiYearSelectorProps {
  value?: number[];
  options: number[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  onChange?: (options: number[]) => void;
}

export function MultiYearSelector({
  value,
  options,
  placeholder,
  disabled,
  className,
  onChange,
}: MultiYearSelectorProps) {
  const handleChange = (options: Option[]) => {
    onChange?.(options.map((option) => parseInt(option.value)));
  };

  return (
    <MultiSelector
      value={value?.map((year) => ({
        value: year.toString(),
        label: year.toString(),
      }))}
      options={options.map((option) => ({
        value: option.toString(),
        label: option.toString(),
      }))}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
      onChange={handleChange}
    />
  );
}
