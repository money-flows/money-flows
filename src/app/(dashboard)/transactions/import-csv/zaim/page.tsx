"use client";

import { InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/ui/file-uploader";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useBulkCreateTransactions } from "@/features/transactions/api/use-bulk-create-transactions";
import { client } from "@/lib/hono";

import { columns } from "./columns";
import { PreviewTable } from "./preview-table";

type CharacterEncoding = "utf-8" | "shift_jis";

const CHARACTER_ENCODINGS: { value: CharacterEncoding; label: string }[] = [
  { value: "utf-8", label: "UTF-8" },
  { value: "shift_jis", label: "Shift_JIS" },
] as const;

const DEFAULT_CHARACTER_ENCODING: CharacterEncoding = "utf-8";

interface Data {
  date: string;
  description: string;
  amount: number;
  category: string | null;
  tags: string[];
  memo: string | null;
}

function parseCsv(content: string) {
  return Papa.parse<Record<string, string>>(content, {
    header: true,
    skipEmptyLines: true,
  });
}

function parsedCsvToTableData(
  data: Papa.ParseResult<Record<string, string>>,
): Data[] {
  return data.data
    .filter((row) => row["集計の設定"] !== "集計に含めない")
    .filter((row) => ["income", "payment"].includes(row["方法"]))
    .map((row) => {
      return {
        date: row["日付"],
        description: row["お店"],
        amount:
          row["方法"] === "income"
            ? parseInt(row["収入"])
            : parseInt(row["支出"]) * -1,
        category: row["カテゴリ"] !== "-" ? row["カテゴリ"] : null,
        tags: [row["カテゴリの内訳"]].filter((tag) => tag !== "-"),
        memo: row["メモ"] !== "-" ? row["メモ"] : null,
      };
    });
}

interface PagePresenterProps {
  accounts: InferResponseType<typeof client.api.accounts.$get, 200>["data"];
}

function PagePresenter({ accounts }: PagePresenterProps) {
  const router = useRouter();

  const [data, setData] = useState<Data[]>();

  const [selectedAccountId, setSelectedAccountId] = useState<string>(
    accounts[0].id,
  );

  const [uploadedFile, setUploadedFile] = useState<File>();
  const [characterEncoding, setCharacterEncoding] = useState<CharacterEncoding>(
    DEFAULT_CHARACTER_ENCODING,
  );

  const createTransactionsMutation = useBulkCreateTransactions();

  const readUploadedFile = (
    file: File,
    characterEncoding: CharacterEncoding,
  ) => {
    const reader = new FileReader();

    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const decoder = new TextDecoder(characterEncoding);
      const text = decoder.decode(arrayBuffer);
      const csv = parseCsv(text);
      const data = parsedCsvToTableData(csv);
      setData(data);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleUpload = (files: File[]) => {
    if (files.length === 0) {
      setUploadedFile(undefined);
      setData(undefined);
      return;
    }

    setUploadedFile(files[0]);
    readUploadedFile(files[0], characterEncoding);
  };

  const handleCharacterEncodingChange = (value: CharacterEncoding) => {
    setCharacterEncoding(value);

    if (uploadedFile) {
      readUploadedFile(uploadedFile, value);
    }
  };

  const submit = () => {
    if (data === undefined) {
      return;
    }

    const importedTransactions = data.map((row) => {
      return {
        ...row,
        category: row.category
          ? {
              name: row.category,
            }
          : undefined,
        tags: row.tags.map((tag) => ({
          name: tag,
        })),
        accountId: selectedAccountId,
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
        <FileUploader
          accept={{ "text/csv": [".csv"] }}
          onValueChange={handleUpload}
        />
        <div className="w-48">
          <Label htmlFor="characterEncoding">文字コード</Label>
          <Select
            defaultValue={DEFAULT_CHARACTER_ENCODING}
            onValueChange={handleCharacterEncodingChange}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CHARACTER_ENCODINGS.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="preview">プレビュー</Label>
          <ScrollArea className="h-[32rem] rounded-md border">
            <PreviewTable data={data ?? []} columns={columns} />
          </ScrollArea>
        </div>
      </div>
      <div className="flex items-center justify-end">
        <Button disabled={!data} onClick={submit}>
          取り込む
        </Button>
      </div>
    </div>
  );
}

export default function Page() {
  const { data: accounts, isPending, isError } = useGetAccounts();

  if (isPending || isError) {
    return null;
  }

  return <PagePresenter accounts={accounts} />;
}
