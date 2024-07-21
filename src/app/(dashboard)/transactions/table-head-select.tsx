import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface TableHeadSelectProps {
  columnIndex: number;
  selectedColumns: Record<string, string | undefined>;
  onChange: (columnIndex: number, value: string | undefined) => void;
}

const options = [
  {
    value: "amount",
    label: "金額",
  },
  {
    value: "counterparty",
    label: "取引先",
  },
  {
    value: "date",
    label: "日付",
  },
  {
    value: "memo",
    label: "メモ",
  },
];

export function TableHeadSelect({
  columnIndex,
  selectedColumns,
  onChange,
}: TableHeadSelectProps) {
  const currentSelection = selectedColumns[`column_${columnIndex}`];
  console.log("currentSelection:", currentSelection);

  return (
    <Select
      value={currentSelection ?? undefined}
      onValueChange={(value) => onChange(columnIndex, value)}
    >
      <SelectTrigger
        className={cn(
          "text-sm font-medium",
          currentSelection &&
            currentSelection !== "none" &&
            "text-blue-500 font-bold",
        )}
      >
        <SelectValue placeholder="未選択" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">未選択</SelectItem>
        {options.map((option) => {
          const disabled =
            Object.values(selectedColumns).includes(option.value) &&
            selectedColumns[`column_${columnIndex}`] !== option.value;

          return (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={disabled}
            >
              {option.label}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
