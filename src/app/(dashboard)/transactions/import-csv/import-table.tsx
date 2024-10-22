import { useMemo } from "react";

import {
  TransactionType,
  TransactionTypeToggle,
} from "@/components/transaction-type-toggle";
import { Checkbox, CheckedState } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useImportCsvStore } from "./use-import-csv-store";

interface TableRowData {
  fields: string[];
  selected: boolean;
  transactionType: TransactionType;
}

export interface TableData {
  fields: string[];
  rows: TableRowData[];
}

interface ImportTableProps {
  data: TableData;
  setData: React.Dispatch<React.SetStateAction<TableData>>;
  selectedOptions: (string | undefined)[];
  setSelectedOptions: React.Dispatch<
    React.SetStateAction<(string | undefined)[]>
  >;
}

const OPTIONS = [
  {
    label: "内容",
    value: "description",
  },
  {
    label: "金額",
    value: "amount",
  },
  {
    label: "日付",
    value: "date",
  },
  {
    label: "カテゴリー",
    value: "category",
  },
  {
    label: "メモ",
    value: "memo",
  },
] as const;

export function ImportTable({
  data,
  setData,
  selectedOptions,
  setSelectedOptions,
}: ImportTableProps) {
  const { isAutoDetectAmountBySign, setIsAutoDetectAmountBySign } =
    useImportCsvStore();

  const headerSelected = useMemo(() => {
    const isAllSelected = data.rows.every((row) => row.selected);
    if (isAllSelected) return true;

    const isSomeSelected = data.rows.some((row) => row.selected);
    if (isSomeSelected) return "indeterminate";

    return false;
  }, [data]);

  const headerTransactionType = useMemo(() => {
    const isAllIncome = data.rows.every(
      (row) => row.transactionType === "income",
    );
    if (isAllIncome) return "income";

    const isAllExpense = data.rows.every(
      (row) => row.transactionType === "expense",
    );
    if (isAllExpense) return "expense";

    return undefined;
  }, [data]);

  const handleIsAutoDetectAmountBySignChange = (checked: CheckedState) => {
    setIsAutoDetectAmountBySign(checked);
  };

  const updateAllRowsSelected = (value: CheckedState) => {
    if (value === "indeterminate") return;

    setData((prev) => {
      const { rows } = prev;
      const newRows = rows.map((row) => ({
        ...row,
        selected: value,
      }));
      return {
        ...prev,
        rows: newRows,
      };
    });
  };

  const updateRowSelected = (value: CheckedState, index: number) => {
    setData((prev) => {
      const { rows } = prev;
      const newRows = [...rows];
      newRows[index].selected = !!value;
      return {
        ...prev,
        rows: newRows,
      };
    });
  };

  const updateAllRowsTransactionType = (value: TransactionType | undefined) => {
    if (!value) return;

    setData((prev) => {
      const { rows } = prev;
      const newRows = rows.map((row) => ({
        ...row,
        transactionType: value,
      }));
      return {
        ...prev,
        rows: newRows,
      };
    });
  };

  const updateRowTransactionType = (
    value: TransactionType | undefined,
    index: number,
  ) => {
    if (!value) return;

    setData((prev) => {
      const { rows } = prev;
      const newRows = [...rows];
      newRows[index].transactionType = value;
      return {
        ...prev,
        rows: newRows,
      };
    });
  };

  const updateSelectedOption = (option: string, index: number) => {
    setSelectedOptions((prev) => {
      const newSelectedOptions = [...prev];
      newSelectedOptions[index] = option;
      return newSelectedOptions;
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
        <Checkbox
          id="auto-detect-amount-by-sign"
          checked={isAutoDetectAmountBySign}
          onCheckedChange={handleIsAutoDetectAmountBySignChange}
        />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="auto-detect-amount-by-sign"
            className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            金額を符号で自動判別する
          </label>
          <p className="text-sm text-muted-foreground">
            このオプションを有効にすると、種別の値は無視され、金額の符号によって自動的に収支が判別されます（正の場合は収入、負の場合は支出）。それに対して、このオプションを無効にすると、種別の値に基づいて収支が判別されます。
          </p>
        </div>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <ImportTableHeader
            fields={data.fields}
            selected={headerSelected}
            transactionType={headerTransactionType}
            selectedOptions={selectedOptions}
            onSelectedChange={updateAllRowsSelected}
            onTransactionTypeChange={updateAllRowsTransactionType}
            onSelectedOptionChange={updateSelectedOption}
          />
          <TableBody>
            {data.rows.map((row, index) => (
              <ImportTableRow
                key={index}
                row={row}
                onSelectedChange={(value) => updateRowSelected(value, index)}
                onTransactionTypeChange={(value) =>
                  updateRowTransactionType(value, index)
                }
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

interface ImportTableHeaderProps {
  fields: TableData["fields"];
  selected: CheckedState;
  transactionType: TransactionType | undefined;
  selectedOptions: (string | undefined)[];
  onSelectedChange: (value: CheckedState) => void;
  onTransactionTypeChange: (value: TransactionType | undefined) => void;
  onSelectedOptionChange: (option: string, index: number) => void;
}

function ImportTableHeader({
  fields,
  selected,
  transactionType,
  selectedOptions,
  onSelectedChange,
  onTransactionTypeChange,
  onSelectedOptionChange,
}: ImportTableHeaderProps) {
  const { isAutoDetectAmountBySign } = useImportCsvStore();

  return (
    <TableHeader className="bg-muted">
      <TableRow>
        <TableHead>
          <div className="flex flex-col gap-2">
            <div className="h-4" />
            <div className="flex h-10 items-center">
              <Checkbox
                checked={selected}
                onCheckedChange={onSelectedChange}
                aria-label="Select all"
              />
            </div>
          </div>
        </TableHead>
        {fields.map((field, index) => (
          <TableHead key={index}>
            <div className="flex flex-col gap-2">
              {field}
              <Select
                value={selectedOptions[index]}
                defaultValue="none"
                onValueChange={(value) => onSelectedOptionChange(value, index)}
              >
                <SelectTrigger className="w-32 text-sm font-medium">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">未選択</SelectItem>
                  {OPTIONS.map((option) => {
                    const disabled = Object.values(selectedOptions).includes(
                      option.value,
                    );

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
            </div>
          </TableHead>
        ))}
        <TableHead>
          <div className="flex flex-col gap-2">
            種別
            <div className="flex h-10 items-center justify-center">
              <TransactionTypeToggle
                value={transactionType}
                disabled={!!isAutoDetectAmountBySign}
                onChange={onTransactionTypeChange}
              />
            </div>
          </div>
        </TableHead>
      </TableRow>
    </TableHeader>
  );
}

interface ImportTableRowProps {
  row: TableRowData;
  onSelectedChange: (value: CheckedState) => void;
  onTransactionTypeChange: (value: TransactionType | undefined) => void;
}

function ImportTableRow({
  row,
  onSelectedChange,
  onTransactionTypeChange,
}: ImportTableRowProps) {
  const { isAutoDetectAmountBySign } = useImportCsvStore();

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center">
          <Checkbox
            checked={row.selected}
            onCheckedChange={(value) => onSelectedChange(value)}
          />
        </div>
      </TableCell>
      {row.fields.map((field, index) => (
        <TableCell key={index}>{field}</TableCell>
      ))}
      <TableCell>
        <TransactionTypeToggle
          value={row.transactionType}
          disabled={!!isAutoDetectAmountBySign}
          onChange={(value) => onTransactionTypeChange(value)}
        />
      </TableCell>
    </TableRow>
  );
}
