import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox, CheckedState } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelector, Option } from "@/components/ui/multi-selector";
import { useGetCategories } from "@/features/categories/api/use-get-categories";

import { LayoutItem } from "./types";

interface MonthlyIncomeChartEditorPresenterProps {
  item: LayoutItem;
  categoryOptions: Option[];
  onChange: (item: LayoutItem) => void;
  onClose: () => void;
}

function MonthlyIncomeChartEditorPresenter({
  item,
  categoryOptions,
  onChange,
  onClose,
}: MonthlyIncomeChartEditorPresenterProps) {
  const { component } = item;

  if (component.name !== "MonthlyIncomeChart") {
    return null;
  }

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const title = event.target.value;
    const newItem: LayoutItem = {
      ...item,
      component: {
        name: "MonthlyIncomeChart",
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
        name: "MonthlyIncomeChart",
        props: { ...component.props, cumulative: checked },
      },
    };
    onChange(newItem);
  };

  const handleCategoriesChange = (options?: Option[]) => {
    const newItem: LayoutItem = {
      ...item,
      component: {
        name: "MonthlyIncomeChart",
        props: {
          ...component.props,
          categoryIds: options
            ? options.map((option) => option.value)
            : undefined,
        },
      },
    };
    onChange(newItem);
  };

  return (
    <Card className="w-96">
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
        <div className="space-y-1">
          <Label>カテゴリー</Label>
          <MultiSelector
            value={categoryOptions.filter((option) =>
              component.props.categoryIds?.includes(option.value),
            )}
            options={categoryOptions}
            onChange={handleCategoriesChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}

interface MonthlyIncomeChartEditorProps {
  item: LayoutItem;
  onChange: (item: LayoutItem) => void;
  onClose: () => void;
}

export function MonthlyIncomeChartEditor({
  item,
  onChange,
  onClose,
}: MonthlyIncomeChartEditorProps) {
  const categoriesQuery = useGetCategories({
    types: ["income"],
  });

  if (categoriesQuery.isPending) {
    return <p>読み込み中...</p>;
  }

  if (categoriesQuery.isError) {
    return <p>エラーが発生しました</p>;
  }

  const categoryOptions = categoriesQuery.data.map((category) => ({
    label: category.name,
    value: category.id,
  }));

  return (
    <MonthlyIncomeChartEditorPresenter
      item={item}
      categoryOptions={categoryOptions}
      onChange={onChange}
      onClose={onClose}
    />
  );
}
