"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "./ui/button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onSelectedRowsDelete?: (rows: TData[]) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onSelectedRowsDelete,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
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

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Button
          size="sm"
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
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{ width: columns[header.index].size }}
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
      <div className="flex items-center">
        <div className="flex-1 text-sm text-muted-foreground">
          全
          <span className="px-1 tabular-nums tracking-tighter">
            {table.getFilteredRowModel().rows.length}
          </span>
          行中
          <span className="px-1 tabular-nums tracking-tighter">
            {table.getFilteredSelectedRowModel().rows.length}
          </span>
          行を選択中
        </div>
      </div>
    </div>
  );
}
