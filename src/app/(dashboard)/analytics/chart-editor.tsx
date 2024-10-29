import { MonthlyExpenseChartEditor } from "./monthly-expense-chart-editor";
import { MonthlyIncomeChartEditor } from "./monthly-income-chart-editor";
import { MonthlyIncomeExpenseRemainingChartEditor } from "./monthly-income-expense-remaining-chart-editor";
import { LayoutItem } from "./types";

interface ChartEditorProps {
  item: LayoutItem;
  onChange: (item: LayoutItem) => void;
  onClose: () => void;
}

export function ChartEditor({ item, onChange, onClose }: ChartEditorProps) {
  const { component } = item;

  if (component.name === "MonthlyIncomeExpenseRemainingChart") {
    return (
      <MonthlyIncomeExpenseRemainingChartEditor
        item={item}
        onChange={onChange}
        onClose={onClose}
      />
    );
  }

  if (component.name === "MonthlyExpenseChart") {
    return (
      <MonthlyExpenseChartEditor
        item={item}
        onChange={onChange}
        onClose={onClose}
      />
    );
  }

  if (component.name === "MonthlyIncomeChart") {
    return (
      <MonthlyIncomeChartEditor
        item={item}
        onChange={onChange}
        onClose={onClose}
      />
    );
  }

  return null;
}
