"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

import { Separator } from "./separator";

export default function ImportCsvPage() {
  return (
    <div className="flex w-full flex-col gap-6">
      <Button asChild>
        <Link href="/transactions/import-csv/manual">
          手動で設定して取り込む
        </Link>
      </Button>
      <Separator>カンタン取り込み</Separator>
      <div className="flex flex-col gap-4">
        <Button asChild variant="outline">
          <Link href="/transactions/import-csv/zaim">ZaimのCSVを取り込む</Link>
        </Button>
      </div>
    </div>
  );
}
