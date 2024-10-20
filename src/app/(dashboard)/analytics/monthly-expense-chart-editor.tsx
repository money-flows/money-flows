import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox, CheckedState } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelector, Option } from "@/components/ui/multi-selector";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useGetTags } from "@/features/tags/api/use-get-tags";

import { LayoutItem } from "./types";

interface MonthlyExpenseChartEditorPresenterProps {
  item: LayoutItem;
  categoryOptions: Option[];
  tagOptions: Option[];
  onChange: (item: LayoutItem) => void;
  onClose: () => void;
}

function MonthlyExpenseChartEditorPresenter({
  item,
  categoryOptions,
  tagOptions,
  onChange,
  onClose,
}: MonthlyExpenseChartEditorPresenterProps) {
  const { component } = item;

  if (component.name !== "MonthlyExpenseChart") {
    return null;
  }

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const title = event.target.value;
    const newItem: LayoutItem = {
      ...item,
      component: {
        name: "MonthlyExpenseChart",
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
        name: "MonthlyExpenseChart",
        props: { ...component.props, cumulative: checked },
      },
    };
    onChange(newItem);
  };

  const handleCategoriesChange = (options?: Option[]) => {
    const newItem: LayoutItem = {
      ...item,
      component: {
        name: "MonthlyExpenseChart",
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

  const handleTagsChange = (options?: Option[]) => {
    const newItem: LayoutItem = {
      ...item,
      component: {
        name: "MonthlyExpenseChart",
        props: {
          ...component.props,
          tagIds: options ? options.map((option) => option.value) : undefined,
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
        <div className="space-y-1">
          <Label>タグ</Label>
          <MultiSelector
            value={tagOptions.filter((option) =>
              component.props.tagIds?.includes(option.value),
            )}
            options={tagOptions}
            onChange={handleTagsChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}

interface MonthlyExpenseChartEditorProps {
  item: LayoutItem;
  onChange: (item: LayoutItem) => void;
  onClose: () => void;
}

export function MonthlyExpenseChartEditor({
  item,
  onChange,
  onClose,
}: MonthlyExpenseChartEditorProps) {
  const categoriesQuery = useGetCategories({
    types: ["expense"],
  });

  const tagsQuery = useGetTags({
    types: ["expense"],
  });

  if (categoriesQuery.isPending || tagsQuery.isPending) {
    return <p>読み込み中...</p>;
  }

  if (categoriesQuery.isError || tagsQuery.isError) {
    return <p>エラーが発生しました</p>;
  }

  const categoryOptions = categoriesQuery.data.map((category) => ({
    label: category.name,
    value: category.id,
  }));

  const tagOptions = tagsQuery.data.map((tag) => ({
    label: tag.name,
    value: tag.id,
  }));

  return (
    <MonthlyExpenseChartEditorPresenter
      item={item}
      categoryOptions={categoryOptions}
      tagOptions={tagOptions}
      onChange={onChange}
      onClose={onClose}
    />
  );
}
