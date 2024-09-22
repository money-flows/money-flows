import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { LayoutItem } from "./types";

interface ChartEditorProps {
  item: LayoutItem;
  onChange: (item: LayoutItem) => void;
}

export function ChartEditor({ item, onChange }: ChartEditorProps) {
  const { component } = item;

  if (component.name === "MonthlyIncomeExpenseRemainingChart") {
    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const title = event.target.value;
      const newItem: LayoutItem = {
        ...item,
        component: {
          name: "MonthlyIncomeExpenseRemainingChart",
          props: { ...component.props, title },
        },
      };
      onChange(newItem);
    };

    return (
      <Card>
        <CardHeader className="font-semibold">チャートの編集</CardHeader>
        <CardContent>
          <div className="space-y-1">
            <Label>タイトル</Label>
            <Input value={component.props.title} onChange={handleTitleChange} />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (component.name === "MonthlyLineChart") {
    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const title = event.target.value;
      const newItem: LayoutItem = {
        ...item,
        component: {
          name: "MonthlyLineChart",
          props: { ...component.props, title },
        },
      };
      onChange(newItem);
    };

    return (
      <Card>
        <CardHeader className="font-semibold">チャートの編集</CardHeader>
        <CardContent>
          <div className="space-y-1">
            <Label>タイトル</Label>
            <Input value={component.props.title} onChange={handleTitleChange} />
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}
