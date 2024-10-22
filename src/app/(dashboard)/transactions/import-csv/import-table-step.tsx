import { format, parse } from "date-fns";
import { InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import { useState } from "react";
import { toast } from "sonner";

import { TransactionType } from "@/components/transaction-type-toggle";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStepper } from "@/components/ui/stepper";
import { useBulkCreateTransactions } from "@/features/transactions/api/use-bulk-create-transactions";
import { client } from "@/lib/hono";

import { ImportTable, TableData } from "./import-table";
import { useImportCsvStore } from "./use-import-csv-store";

const REQUIRED_OPTIONS = ["amount", "date"];
const OPTIONS = [...REQUIRED_OPTIONS, "description", "category", "memo"];

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

interface ImportTableStepProps {
  accounts: InferResponseType<typeof client.api.accounts.$get, 200>["data"];
}

export function ImportTableStep({ accounts }: ImportTableStepProps) {
  const router = useRouter();

  const { prevStep } = useStepper();

  const { content, isAutoDetectAmountBySign } = useImportCsvStore();

  const createTransactionsMutation = useBulkCreateTransactions();

  const [selectedAccountId, setSelectedAccountId] = useState<string>(
    accounts[0].id,
  );

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
    const optionToColumnIndex: Record<string, number> = OPTIONS.reduce(
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

      const categoryName = row.fields[optionToColumnIndex.category];

      return {
        ...Object.fromEntries(
          Object.entries(optionToColumnIndex).map(([option, columnIndex]) => [
            option,
            row.fields[columnIndex],
          ]),
        ),
        amount: parsedAmount,
        date: formattedDate,
        accountId: selectedAccountId,
        category: {
          name: categoryName,
        },
      };
    });

    createTransactionsMutation.mutate(importedTransactions, {
      onSuccess: () => {
        router.push("/transactions");
      },
      onError: () => {
        toast.error("取り込みに失敗しました");
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col gap-4 rounded-md border p-4">
          <div className="w-80">
            <Label>取り込み先の口座</Label>
            <Select
              value={selectedAccountId}
              defaultValue={accounts[0].id}
              onValueChange={setSelectedAccountId}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name}
                  </SelectItem>
                ))}
                <SelectItem value="new">新しい口座を作成</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-80">
            <Label>日付のフォーマット</Label>
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
          取り込む
        </Button>
      </div>
    </div>
  );
}
