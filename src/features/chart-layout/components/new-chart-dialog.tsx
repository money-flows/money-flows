import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useNewChart } from "../hooks/use-new-chart";

export function NewChartDialog() {
  const { isOpen, onClose } = useNewChart();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>チャートの追加</DialogTitle>
          <DialogDescription>
            追加したいチャートを選択してください。
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
