"use client";

import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
import {
  ColumnDef,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useSearchTransactionsParams } from "./_hooks/use-query-params";

declare module "@tanstack/react-table" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);

  addMeta({
    itemRank,
  });

  return itemRank.passed;
};

interface TransactionDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalCount: number;
  onSelectedRowsDelete?: (rows: TData[]) => void;
}

export function TransactionDataTable<TData, TValue>({
  columns,
  data,
  totalCount,
  onSelectedRowsDelete,
}: TransactionDataTableProps<TData, TValue>) {
  const router = useRouter();

  const { params, createQueryString, includesIncome, includesExpense } =
    useSearchTransactionsParams();

  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    rowCount: totalCount,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
      rowSelection,
    },
    filterFns: {
      fuzzy: fuzzyFilter,
    },
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows;

  const handleSelectedRowsDelete = () => {
    if (onSelectedRowsDelete) {
      const originalRows = selectedRows.map((row) => row.original);
      onSelectedRowsDelete?.(originalRows);
      setRowSelection({});
    }
  };

  const handleIncomeCheckedChange = (value: boolean) => {
    const newTypes: ("income" | "expense")[] = !!value
      ? [...params.types, "income"]
      : params.types.filter((type) => type !== "income");

    router.push(
      "/transactions?" +
        createQueryString({ ...params, page: 1, types: newTypes }),
    );
  };

  const handleExpenseCheckedChange = (value: boolean) => {
    const newTypes: ("income" | "expense")[] = !!value
      ? [...params.types, "expense"]
      : params.types.filter((type) => type !== "expense");

    router.push(
      "/transactions?" +
        createQueryString({ ...params, page: 1, types: newTypes }),
    );
  };

  useEffect(() => {
    setRowSelection({});
  }, [data]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Input
          placeholder="検索"
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(String(event.target.value))}
          className="w-full sm:max-w-sm"
        />
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
      <div className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
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
