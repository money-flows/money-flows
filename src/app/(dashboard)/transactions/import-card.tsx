import { format } from "date-fns";
import { useState } from "react";

import { TransactionType } from "@/components/transaction-type-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckedState } from "@/components/ui/checkbox";

import { ImportTable } from "./import-table";

const requiredOptions = ["amount", "date", "counterparty"];

type SelectedColumnsState = Record<string, string | undefined>;

interface ImportCardProps {
  data: string[][];
  onCancel: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (data: any) => void;
}

export function ImportCard({ data, onCancel, onSubmit }: ImportCardProps) {
  const [selectedColumns, setSelectedColumns] = useState<SelectedColumnsState>(
    {},
  );

  const headers = data[0];
  const body = data.slice(1);

  const [selectedRows, setSelectedRows] = useState<CheckedState[]>(
    Array.from({ length: body.length }, () => true),
  );

  const [transactionTypes, setTransactionTypes] = useState<TransactionType[]>(
    Array.from({ length: body.length }, () => "income"),
  );

  const handleTableHeadSelectChange = (
    columnIndex: number,
    value: string | undefined,
  ) => {
    setSelectedColumns((prev) => {
      const newSelectedColumns = { ...prev };

      for (const key in newSelectedColumns) {
        if (newSelectedColumns[key] === value) {
          newSelectedColumns[key] = undefined;
        }
      }

      if (value === "none") {
        value = undefined;
      }

      newSelectedColumns[`column_${columnIndex}`] = value;
      return newSelectedColumns;
    });
  };

  const progress = Object.values(selectedColumns).filter(Boolean).length;

  const handleContinue = () => {
    const getColumnIndex = (column: string) => {
      return column.split("_")[1];
    };

    const mappedData = {
      headers: headers.map((_, index) => {
        const columnIndex = getColumnIndex(`column_${index}`);
        return selectedColumns[`column_${columnIndex}`] ?? null;
      }),
      body: body
        .filter((_, index) => selectedRows[index])
        .map((row) => {
          const transformedRow = row.map((cell, index) => {
            const columnIndex = getColumnIndex(`column_${index}`);
            return selectedColumns[`column_${columnIndex}`] ? cell : null;
          });

          return transformedRow.every((item) => item === null)
            ? []
            : transformedRow;
        })
        .filter((row) => row.length > 0),
    };

    const arrayOfData = mappedData.body.map((row) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return row.reduce((acc: any, cell, index) => {
        const header = mappedData.headers[index];
        if (header !== null) {
          acc[header] = cell;
        }

        return acc;
      }, {});
    });

    const formattedData = arrayOfData.map((row, index) => {
      const isIncome = transactionTypes[index] === "income";
      const parsedAmount = parseInt(row.amount);

      return {
        ...row,
        amount: parsedAmount * (isIncome ? 1 : -1),
        date: format(new Date(row.date), "yyyy-MM-dd"),
      };
    });

    onSubmit(formattedData);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="line-clamp-1 text-xl">CSV取り込み</CardTitle>
          <div className="flex flex-col items-center gap-2 lg:flex-row">
            <Button
              size="sm"
              variant="outline"
              onClick={onCancel}
              className="w-full lg:w-auto"
            >
              やめる
            </Button>
            <Button
              size="sm"
              disabled={progress < requiredOptions.length}
              onClick={handleContinue}
              className="w-full lg:w-auto"
            >
              口座の選択に進む ({progress} / {requiredOptions.length})
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ImportTable
          headers={headers}
          body={body}
          selectedColumns={selectedColumns}
          onTableHeadSelectChange={handleTableHeadSelectChange}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          transactionTypes={transactionTypes}
          setTransactionTypes={setTransactionTypes}
        />
      </CardContent>
    </Card>
  );
}
