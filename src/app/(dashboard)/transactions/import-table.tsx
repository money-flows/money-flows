import {
  TransactionType,
  TransactionTypeToggle,
} from "@/components/transaction-type-toggle";
import { Checkbox, CheckedState } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { TableHeadSelect } from "./table-head-select";

interface ImportTableProps {
  headers: string[];
  body: string[][];
  selectedColumns: Record<string, string | undefined>;
  onTableHeadSelectChange: (
    columnIndex: number,
    value: string | undefined,
  ) => void;
  selectedRows: CheckedState[];
  setSelectedRows: React.Dispatch<React.SetStateAction<CheckedState[]>>;
  transactionTypes: TransactionType[];
  setTransactionTypes: React.Dispatch<React.SetStateAction<TransactionType[]>>;
}

export function ImportTable({
  headers,
  body,
  selectedColumns,
  onTableHeadSelectChange,
  selectedRows,
  setSelectedRows,
  transactionTypes,
  setTransactionTypes,
}: ImportTableProps) {
  const isAllSelected = selectedRows.every((selected) => selected);
  const isSomeSelected = selectedRows.some((selected) => selected);

  const toggleAllSelectedRows = (value: CheckedState) => {
    if (value === "indeterminate") return;
    setSelectedRows(
      value ? selectedRows.map(() => true) : selectedRows.map(() => false),
    );
  };

  const toggleSelectedRow = (value: CheckedState, index: number) => {
    setSelectedRows((prev) => {
      const newSelectedRows = [...prev];
      newSelectedRows[index] = value;
      return newSelectedRows;
    });
  };

  const isAllIncome = transactionTypes.every((type) => type === "income");
  const isAllExpense = transactionTypes.every((type) => type === "expense");
  const headTransactionType = isAllIncome
    ? "income"
    : isAllExpense
      ? "expense"
      : undefined;

  const toggleAllTransactionTypes = () => {
    if (isAllIncome) {
      setTransactionTypes((prev) => prev.map(() => "expense"));
    } else if (isAllExpense) {
      setTransactionTypes((prev) => prev.map(() => "income"));
    } else {
      setTransactionTypes((prev) => prev.map(() => "income"));
    }
  };

  const toggleTransactionType = (
    value: TransactionType | undefined,
    index: number,
  ) => {
    if (!value) return;

    setTransactionTypes((prev) => {
      const newTransactionTypes = [...prev];
      newTransactionTypes[index] = value;
      return newTransactionTypes;
    });
  };

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead>
              <div className="flex flex-col gap-2">
                <div className="h-4" />
                <div className="flex h-10 items-center">
                  <Checkbox
                    checked={
                      isAllSelected
                        ? true
                        : isSomeSelected
                          ? "indeterminate"
                          : false
                    }
                    onCheckedChange={toggleAllSelectedRows}
                    aria-label="Select all"
                  />
                </div>
              </div>
            </TableHead>
            {headers.map((header, index) => (
              <TableHead key={index}>
                <div className="flex flex-col gap-2">
                  {header}
                  <TableHeadSelect
                    columnIndex={index}
                    selectedColumns={selectedColumns}
                    onChange={onTableHeadSelectChange}
                  />
                </div>
              </TableHead>
            ))}
            <TableHead>
              <div className="flex flex-col gap-2">
                種別
                <div className="flex h-10 items-center justify-center">
                  <TransactionTypeToggle
                    value={headTransactionType}
                    onChange={toggleAllTransactionTypes}
                  />
                </div>
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {body.map((row, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className="flex items-center">
                  <Checkbox
                    checked={selectedRows[index]}
                    onCheckedChange={(value) => toggleSelectedRow(value, index)}
                    aria-label="Select all"
                  />
                </div>
              </TableCell>
              {row.map((cell, index) => (
                <TableCell key={index}>{cell}</TableCell>
              ))}
              <TableCell>
                <TransactionTypeToggle
                  value={transactionTypes[index]}
                  onChange={(value) => toggleTransactionType(value, index)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
