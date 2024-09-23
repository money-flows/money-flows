import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useNewChart } from "../hooks/use-new-chart";
import { ChartComponentName } from "../types";

const charts = [
  {
    component: "MonthlyIncomeExpenseRemainingChart",
    title: "収支チャート",
  },
  {
    component: "MonthlyLineChart",
    title: "年間比較チャート",
  },
] as const satisfies { component: ChartComponentName; title: string }[];

interface NewChartDialogProps {
  onChartSelect: (componentName: ChartComponentName) => void;
}

export function NewChartDialog({ onChartSelect }: NewChartDialogProps) {
  const { isOpen, onClose } = useNewChart();

  const handleChartSelect = (componentName: ChartComponentName) => {
    onChartSelect(componentName);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>チャートの追加</DialogTitle>
          <DialogDescription>
            追加したいチャートを選択してください。
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          {charts.map((chart) => (
            <Button
              key={chart.component}
              onClick={() => handleChartSelect(chart.component)}
            >
              {chart.title}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
