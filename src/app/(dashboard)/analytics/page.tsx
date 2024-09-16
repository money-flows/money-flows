"use client";

import "gridstack/dist/gridstack.css";

import { GridStack } from "gridstack";
import { useEffect } from "react";

import { useGetCategories } from "@/features/categories/api/use-get-categories";

import { MonthlyIncomeExpenseRemainingChart } from "./monthly-income-expense-remaining-chart";
import { MonthlyLineChart } from "./monthly-line-chart";

const layout = [
  {
    componentName: "MonthlyIncomeExpenseRemainingChart",
    props: {
      title: "収支の推移（年間）",
    },
  },
  {
    componentName: "MonthlyLineChart",
    props: {
      title: "残高の推移（年間）",
      type: "remaining",
    },
  },
  {
    componentName: "MonthlyLineChart",
    props: {
      title: "収入の推移（年間）",
      type: "income",
    },
  },
];

const componentMap = {
  MonthlyIncomeExpenseRemainingChart,
  MonthlyLineChart,
} as const;

export default function AnalyticsPage() {
  useEffect(() => {
    GridStack.init();
  }, []);

  const expenseCategoriesQuery = useGetCategories({
    types: ["expense"],
  });

  const incomeCategoriesQuery = useGetCategories({
    types: ["income"],
  });

  if (expenseCategoriesQuery.isPending || incomeCategoriesQuery.isPending) {
    return <p>Loading...</p>;
  }

  if (expenseCategoriesQuery.isError || incomeCategoriesQuery.isError) {
    return <p>Error</p>;
  }

  return (
    <div className="grid-stack">
      {layout.map(({ componentName, props }, index) => {
        // @ts-expect-error componentName is a key of componentMap
        const Component = componentMap[componentName];

        return (
          <div key={index} className="grid-stack-item">
            <div className="grid-stack-item-content">
              <Component {...props} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
