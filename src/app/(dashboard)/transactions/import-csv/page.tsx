"use client";

import { Step, StepItem, Stepper } from "@/components/ui/stepper";

import { Footer } from "./footer";
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
        {STEPS.map(({ label }, index) => {
          if (index === 0) {
            return (
              <Step key={label} label={label}>
                <UploadStep />
              </Step>
            );
          }

          return (
            <Step key={label} label={label}>
              <div className="my-4 flex h-40 items-center justify-center rounded-md border bg-secondary text-primary">
                <h1 className="text-xl">Step {index + 1}</h1>
              </div>
            </Step>
          );
        })}
        <Footer />
      </Stepper>
    </div>
  );
}
