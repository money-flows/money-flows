"use client";

import Papa from "papaparse";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/ui/file-uploader";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

export default function Page() {
  const [data, setData] = useState<Data[]>();
  const [content, setContent] = useState<string>();

  const [uploadedFile, setUploadedFile] = useState<File>();
  const [characterEncoding, setCharacterEncoding] = useState<CharacterEncoding>(
    DEFAULT_CHARACTER_ENCODING,
  );

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
      setContent(undefined);
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
        <div>
          <Label htmlFor="preview">プレビュー</Label>
          {data && <PreviewTable data={data} columns={columns} />}
        </div>
      </div>
      <div className="flex items-center justify-end">
        <Button disabled={!content}>取り込む</Button>
      </div>
    </div>
  );
}
