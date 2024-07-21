import { Info, MinusCircle, PlusCircle } from "lucide-react";

import { cn } from "@/lib/utils";

export type TransactionType = "income" | "expense";

interface TransactionTypeToggleProps {
  value: TransactionType | undefined;
  onChange?: (value: TransactionType | undefined) => void;
}

export function TransactionTypeToggle({
  value,
  onChange,
}: TransactionTypeToggleProps) {
  const isIncome = value === "income";
  const isExpense = value === "expense";

  const handleClick = () => {
    if (!value) {
      onChange?.("income");
    } else {
      onChange?.(value === "income" ? "expense" : "income");
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "bg-slate-400 hover:bg-slate-500 rounded-md p-1.5 flex items-center justify-center transition enabled:cursor-pointer",
        isIncome && "bg-emerald-500 hover:bg-emerald-600",
        isExpense && "bg-rose-500 hover:bg-rose-600",
      )}
    >
      {isIncome && <PlusCircle className="size-4 text-white" />}
      {isExpense && <MinusCircle className="size-4 text-white" />}
      {!isIncome && !isExpense && <Info className="size-4 text-white" />}
    </button>
  );
}
