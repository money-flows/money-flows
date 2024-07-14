import { Info, MinusCircle, PlusCircle } from "lucide-react";
import CurrencyInput from "react-currency-input-field";

import { cn } from "@/lib/utils";

interface AmountInputProps {
  value: string;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function AmountInput({
  value,
  onChange,
  placeholder,
  disabled,
}: AmountInputProps) {
  const parsedValue = parseInt(value);
  const isIncome = parsedValue > 0;
  const isExpense = parsedValue < 0;

  const handleReverseValue = () => {
    if (!value) return;

    const newValue = parseInt(value) * -1;
    onChange(newValue.toString());
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleReverseValue}
        className={cn(
          "absolute top-1.5 left-1.5 bg-slate-400 hover:bg-slate-500 rounded-md p-1.5 flex items-center justify-center transition",
          isIncome && "bg-emerald-500 hover:bg-emerald-600",
          isExpense && "bg-rose-500 hover:bg-rose-600",
        )}
      >
        {!parsedValue && <Info className="size-4 text-white" />}
        {isIncome && <PlusCircle className="size-4 text-white" />}
        {isExpense && <MinusCircle className="size-4 text-white" />}
      </button>
      <CurrencyInput
        prefix="¥"
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className="flex h-10 w-full rounded-md border border-input bg-background py-2 pl-10 pr-3 text-sm tabular-nums tracking-tighter ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      />
      {(isIncome || isExpense) && (
        <p className="mt-2 text-xs text-muted-foreground">
          この金額は
          {isIncome && <span className="text-emerald-500">収入</span>}
          {isExpense && <span className="text-rose-500">支出</span>}
          として扱われます。
        </p>
      )}
    </div>
  );
}
