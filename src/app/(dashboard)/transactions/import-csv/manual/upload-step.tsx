"use client";

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
import { useStepper } from "@/components/ui/stepper";

import { useImportCsvStore } from "./use-import-csv-store";

type CharacterEncoding = "utf-8" | "shift_jis";

const CHARACTER_ENCODINGS: { value: CharacterEncoding; label: string }[] = [
  { value: "utf-8", label: "UTF-8" },
  { value: "shift_jis", label: "Shift_JIS" },
] as const;

const DEFAULT_CHARACTER_ENCODING: CharacterEncoding = "utf-8";

export function UploadStep() {
  const { nextStep } = useStepper();

  const { content, setContent } = useImportCsvStore();

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
      setContent(text);
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
          <pre
            id="preview"
            className="h-56 w-full overflow-scroll rounded-md border border-input bg-muted/50 px-3 py-2 text-sm text-slate-800"
          >
            <code>{content}</code>
          </pre>
        </div>
      </div>
      <div className="flex items-center justify-end">
        <Button disabled={!content} onClick={nextStep}>
          次へ
        </Button>
      </div>
    </div>
  );
}
