import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox, CheckedState } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { LayoutItem } from "./types";

interface ChartEditorProps {
  item: LayoutItem;
  onChange: (item: LayoutItem) => void;
  onClose: () => void;
}

export function ChartEditor({ item, onChange, onClose }: ChartEditorProps) {
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
        <CardHeader className="flex flex-row items-center justify-between font-semibold">
          チャートの編集
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="size-6 p-1 text-muted-foreground"
          >
            <X />
          </Button>
        </CardHeader>
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

    const handleCumulativeChange = (checked: CheckedState) => {
      if (checked === "indeterminate") {
        return;
      }

      const newItem: LayoutItem = {
        ...item,
        component: {
          name: "MonthlyLineChart",
          props: { ...component.props, cumulative: checked },
        },
      };
      onChange(newItem);
    };

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between font-semibold">
          チャートの編集
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="size-6 p-1 text-muted-foreground"
          >
            <X />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>タイトル</Label>
            <Input value={component.props.title} onChange={handleTitleChange} />
          </div>
          <div className="flex items-center gap-1.5">
            <Checkbox
              id="cumulative"
              checked={component.props.cumulative}
              onCheckedChange={handleCumulativeChange}
            />
            <Label htmlFor="cumulative">累計表示</Label>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}
