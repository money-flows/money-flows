"use client";

import { Step, StepItem, Stepper } from "@/components/ui/stepper";

import { ImportTableStep } from "./import-table-step";
import { SelectAccountStep } from "./select-account-step";
import { UploadStep } from "./upload-step";

const STEPS = [
  { label: "CSVのアップロード" },
  { label: "取り込み設定" },
  { label: "口座の選択" },
] satisfies StepItem[];

export default function ImportCsvPage() {
  return (
    <div className="flex w-full flex-col gap-6">
      <Stepper initialStep={0} steps={STEPS}>
        <Step label="CSVのアップロード">
          <UploadStep />
        </Step>
        <Step label="取り込み設定">
          <ImportTableStep />
        </Step>
        <Step label="口座の選択">
          <SelectAccountStep />
        </Step>
      </Stepper>
    </div>
  );
}
