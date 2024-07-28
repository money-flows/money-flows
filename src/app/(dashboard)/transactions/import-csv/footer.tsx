import { Button } from "@/components/ui/button";
import { useStepper } from "@/components/ui/stepper";

import { useImportConfig } from "./use-import-config";

export function Footer() {
  const {
    nextStep,
    prevStep,
    resetSteps,
    activeStep,
    isDisabledStep,
    hasCompletedAllSteps,
    isLastStep,
    isOptionalStep,
  } = useStepper();

  const { content } = useImportConfig();

  const isNextStepDisabled = activeStep === 0 && !content;

  return (
    <>
      {hasCompletedAllSteps && (
        <div className="my-4 flex h-40 items-center justify-center rounded-md border bg-secondary text-primary">
          <h1 className="text-xl">Woohoo! All steps completed! 🎉</h1>
        </div>
      )}
      <div className="flex w-full justify-end gap-2">
        {hasCompletedAllSteps ? (
          <Button size="sm" onClick={resetSteps}>
            リセット
          </Button>
        ) : (
          <>
            {activeStep > 0 && (
              <Button
                variant="secondary"
                disabled={isDisabledStep}
                onClick={prevStep}
              >
                戻る
              </Button>
            )}
            <Button disabled={isNextStepDisabled} onClick={nextStep}>
              {isLastStep ? "完了" : isOptionalStep ? "スキップ" : "次へ"}
            </Button>
          </>
        )}
      </div>
    </>
  );
}
