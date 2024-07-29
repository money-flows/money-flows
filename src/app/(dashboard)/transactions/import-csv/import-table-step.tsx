import { format, parse } from "date-fns";
import Papa from "papaparse";
import { useState } from "react";

import { TransactionType } from "@/components/transaction-type-toggle";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStepper } from "@/components/ui/stepper";

import { ImportTable, TableData } from "./import-table";
import { useImportCsvStore } from "./use-import-csv-store";

const REQUIRED_OPTIONS = ["amount", "date", "counterparty"];

export const DEFAULT_DATE_FORMAT = "yyyy-MM-dd";

function parseCsv(content: string) {
  return Papa.parse<Record<string, string>>(content, {
    header: true,
    skipEmptyLines: true,
  });
}

function parsedCsvToTableData(
  data: Papa.ParseResult<Record<string, string>>,
): TableData {
  const fields = data.meta.fields ?? [];
  const rows = data.data.map((row) => ({
    fields: fields.map((header) => row[header]),
    selected: true,
    transactionType: "income" as TransactionType,
  }));

  return { fields, rows };
}

function parseAmountString(
  amount: string,
  transactionType: TransactionType,
  isAutoDetectAmountBySign: boolean,
) {
  if (isAutoDetectAmountBySign) {
    return parseInt(amount);
  }

  const isIncome = transactionType === "income";
  const parsedAmount = Math.abs(parseInt(amount));
  return parsedAmount * (isIncome ? 1 : -1);
}

export function ImportTableStep() {
  const { nextStep, prevStep } = useStepper();

  const { content, isAutoDetectAmountBySign, setImportedTransactions } =
    useImportCsvStore();

  const [tableData, setTableData] = useState<TableData>(() => {
    if (!content) {
      throw new Error("Content should be empty at the beginning");
    }

    const parsedContent = parseCsv(content);
    return parsedCsvToTableData(parsedContent);
  });

  const [selectedOptions, setSelectedOptions] = useState<
    (string | undefined)[]
  >(Array.from({ length: tableData.fields.length }, () => undefined));

  const [dateFormat, setDateFormat] = useState<string>("yyyy-MM-dd");

  const isNextStepDisabled = REQUIRED_OPTIONS.some(
    (option) => !selectedOptions.includes(option),
  );

  const handleClickNextStep = () => {
    const optionToColumnIndex: Record<string, number> = REQUIRED_OPTIONS.reduce(
      (acc, option) => {
        const columnIndex = selectedOptions.indexOf(option);

        if (columnIndex === -1) {
          return acc;
        }

        return {
          ...acc,
          [option]: columnIndex,
        };
      },
      {},
    );

    const importedTransactions = tableData.rows.map((row) => {
      const parsedAmount = parseAmountString(
        row.fields[optionToColumnIndex.amount],
        row.transactionType,
        !!isAutoDetectAmountBySign,
      );

      const formattedDate = format(
        parse(row.fields[optionToColumnIndex.date], dateFormat, new Date()),
        "yyyy-MM-dd",
      );

      return {
        ...Object.fromEntries(
          Object.entries(optionToColumnIndex).map(([option, columnIndex]) => [
            option,
            row.fields[columnIndex],
          ]),
        ),
        amount: parsedAmount,
        date: formattedDate,
      };
    });

    setImportedTransactions(importedTransactions);

    nextStep();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
          <div className="grid gap-1.5 leading-none">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              日付のフォーマット
            </label>
            <Select
              value={dateFormat}
              defaultValue={DEFAULT_DATE_FORMAT}
              onValueChange={setDateFormat}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yyyy-MM-dd">
                  {`YYYY-MM-DD（例：${format(new Date(), "yyyy-MM-dd")}）`}
                </SelectItem>
                <SelectItem value="yyyy/MM/dd">
                  {`YYYY/MM/DD（例：${format(new Date(), "yyyy/MM/dd")}）`}
                </SelectItem>
                <SelectItem value="yyyyMMdd">
                  {`YYYYMMDD（例：${format(new Date(), "yyyyMMdd")}）`}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <ImportTable
          data={tableData}
          setData={setTableData}
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
        />
      </div>
      <div className="flex items-center justify-end gap-2">
        <Button variant="secondary" onClick={prevStep}>
          戻る
        </Button>
        <Button disabled={isNextStepDisabled} onClick={handleClickNextStep}>
          次へ
        </Button>
      </div>
    </div>
  );
}
