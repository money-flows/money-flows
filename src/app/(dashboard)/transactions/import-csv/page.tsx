"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { H1 } from "@/components/ui/h1";

import { Separator } from "./separator";

export default function ImportCsvPage() {
  return (
    <div className="space-y-4">
      <H1>CSV取り込み</H1>
      <div className="flex w-full flex-col gap-6">
        <Button asChild>
          <Link href="/transactions/import-csv/manual">
            手動で設定して取り込む
          </Link>
        </Button>
        <Separator>カンタン取り込み</Separator>
        <div className="flex flex-col gap-4">
          <Button asChild variant="outline">
            <Link href="/transactions/import-csv/zaim">
              ZaimのCSVを取り込む
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
