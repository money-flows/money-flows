"use client";

import { Step, StepItem, Stepper } from "@/components/ui/stepper";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";

import { ImportTableStep } from "./import-table-step";
import { UploadStep } from "./upload-step";

const STEPS = [
  { label: "CSVのアップロード" },
  { label: "取り込み設定" },
] satisfies StepItem[];

export default function ImportCsvPage() {
  const accountsQuery = useGetAccounts();

  if (accountsQuery.isLoading) {
    return null;
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <Stepper initialStep={0} steps={STEPS}>
        <Step label={STEPS[0].label}>
          <UploadStep />
        </Step>
        <Step label={STEPS[1].label}>
          <ImportTableStep accounts={accountsQuery.data!} />
        </Step>
      </Stepper>
    </div>
  );
}
