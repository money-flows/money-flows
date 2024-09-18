"use client";

import "gridstack/dist/gridstack.css";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { H1 } from "@/components/ui/h1";

import { EditChartLayout } from "./edit-chart-layout";
import { LayoutItem } from "./types";
import { ViewChartLayout } from "./view-chart-layout";

const defaultLayout: LayoutItem[] = [
  {
    id: "item-1",
    x: 0,
    y: 0,
    w: 12,
    h: 4,
    component: {
      name: "MonthlyIncomeExpenseRemainingChart",
      props: {
        title: "収支の推移（年間）",
      },
    },
  },
  {
    id: "item-2",
    x: 0,
    y: 4,
    w: 6,
    h: 4,
    component: {
      name: "MonthlyLineChart",
      props: {
        title: "収入の推移（年間）",
        type: "income",
      },
    },
  },
  {
    id: "item-3",
    x: 6,
    y: 4,
    w: 6,
    h: 4,
    component: {
      name: "MonthlyLineChart",
      props: {
        title: "支出の推移（年間）",
        type: "expense",
      },
    },
  },
];

export default function Page() {
  const [layout] = useState(defaultLayout);
  const [isEditing, setIsEditing] = useState(false);

  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <H1>分析</H1>
        <div className="flex items-center gap-2">
          <Button className="w-full sm:w-auto" onClick={toggleEditing}>
            {isEditing ? "編集を完了" : "レイアウトを編集"}
          </Button>
        </div>
      </div>
      {isEditing ? (
        <EditChartLayout layout={layout} />
      ) : (
        <ViewChartLayout layout={layout} />
      )}
    </div>
  );
}
