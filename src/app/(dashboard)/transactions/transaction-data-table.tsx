"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

import { toQueryString, useTransactionsSearchParams } from "./search-params";

const SELECTED_ALL_ACCOUNTS_ID = "all";

interface TransactionDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalCount: number;
  accountOptions: { label: string; value: string }[];
  onSelectedRowsDelete?: (rows: TData[]) => void;
}

export function TransactionDataTable<TData, TValue>({
  columns,
  data,
  totalCount,
  accountOptions,
  onSelectedRowsDelete,
}: TransactionDataTableProps<TData, TValue>) {
  const router = useRouter();

  const { searchParams, includesIncome, includesExpense } =
    useTransactionsSearchParams();

  const [searchValue, setSearchValue] = useState(searchParams.q ?? "");
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    rowCount: totalCount,
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows;

  const handleSearch = () => {
    const newSearchParams = { ...searchParams, page: 1 };

    if (searchValue === "") {
      delete newSearchParams.q;
    } else {
      newSearchParams.q = searchValue;
    }

    router.push("/transactions?" + toQueryString(newSearchParams));
  };

  const handleSelectedRowsDelete = () => {
    if (onSelectedRowsDelete) {
      const originalRows = selectedRows.map((row) => row.original);
      onSelectedRowsDelete?.(originalRows);
      setRowSelection({});
    }
  };

  const handleAccountChange = (value: string) => {
    const newSearchParams = { ...searchParams, page: 1 };

    if (value === SELECTED_ALL_ACCOUNTS_ID) {
      delete newSearchParams.accountId;
    } else {
      newSearchParams.accountId = value;
    }

    router.push("/transactions?" + toQueryString(newSearchParams));
  };

  const handleIncomeCheckedChange = (value: boolean) => {
    const newTypes: ("income" | "expense")[] = !!value
      ? [...searchParams.types, "income"]
      : searchParams.types.filter((type) => type !== "income");

    router.push(
      "/transactions?" +
        toQueryString({
          ...searchParams,
          page: 1,
          types: newTypes,
        }),
    );
  };

  const handleExpenseCheckedChange = (value: boolean) => {
    const newTypes: ("income" | "expense")[] = !!value
      ? [...searchParams.types, "expense"]
      : searchParams.types.filter((type) => type !== "expense");

    router.push(
      "/transactions?" +
        toQueryString({
          ...searchParams,
          page: 1,
          types: newTypes,
        }),
    );
  };

  useEffect(() => {
    setRowSelection({});
  }, [data]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex w-full items-center gap-2 sm:max-w-sm">
          <Input
            placeholder="検索"
            value={searchValue}
            onChange={(event) => setSearchValue(String(event.target.value))}
            className="w-full"
          />
          <Button onClick={handleSearch}>検索</Button>
        </div>
        <Button
          variant="outline"
          disabled={!selectedRows.length}
          onClick={handleSelectedRowsDelete}
          className="ml-auto"
        >
          選択中の
          <span className="px-1 tabular-nums tracking-tighter">
            {selectedRows.length}
          </span>
          行を削除
        </Button>
      </div>
      <div className="space-y-4 rounded-md border p-4">
        <div>
          <Label>口座</Label>
          <div className="w-64">
            <Select
              defaultValue={searchParams.accountId ?? SELECTED_ALL_ACCOUNTS_ID}
              onValueChange={handleAccountChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={SELECTED_ALL_ACCOUNTS_ID}>すべて</SelectItem>
                {accountOptions.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label>種別</Label>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Checkbox
                id="income"
                checked={includesIncome()}
                onCheckedChange={handleIncomeCheckedChange}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="income"
                  className="line-clamp-1 inline whitespace-nowrap rounded-md bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-600"
                >
                  収入
                </label>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="expense"
                checked={includesExpense()}
                onCheckedChange={handleExpenseCheckedChange}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="expense"
                  className="line-clamp-1 inline whitespace-nowrap rounded-md bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600"
                >
                  支出
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{
                        width: columns[header.index].size,
                        minWidth: columns[header.index].minSize,
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  データがありません
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
