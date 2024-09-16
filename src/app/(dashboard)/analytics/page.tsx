// @ts-nocheck
// TODO: Remove this line after fixing the issue

"use client";

import "gridstack/dist/gridstack.css";

import { GridStack } from "gridstack";
import { createRef, useEffect, useLayoutEffect, useRef, useState } from "react";

import { useGetCategories } from "@/features/categories/api/use-get-categories";

import { MonthlyIncomeExpenseRemainingChart } from "./monthly-income-expense-remaining-chart";
import { MonthlyLineChart } from "./monthly-line-chart";

const defaultLayout = [
  {
    id: "item-1",
    x: 0,
    y: 0,
    w: 12,
    h: 4,
    componentName: "MonthlyIncomeExpenseRemainingChart",
    props: {
      title: "収支の推移（年間）",
    },
  },
  {
    id: "item-2",
    x: 0,
    y: 4,
    w: 6,
    h: 4,
    componentName: "MonthlyLineChart",
    props: {
      title: "残高の推移（年間）",
      type: "remaining",
    },
  },
  {
    id: "item-3",
    x: 6,
    y: 4,
    w: 6,
    h: 4,
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

export default function Page() {
  const [layout] = useState(defaultLayout);

  const refs = useRef({});
  const gridRef = useRef();

  if (Object.keys(refs.current).length !== layout.length) {
    layout.forEach(({ id }) => {
      refs.current[id] = refs.current[id] || createRef();
    });
  }

  useEffect(() => {
    gridRef.current = gridRef.current || GridStack.init({ float: true });
    const grid = gridRef.current;
    grid.batchUpdate();
    grid.removeAll(false);
    layout.forEach(({ id }) => grid.makeWidget(refs.current[id].current));
    grid.batchUpdate(false);
  }, [layout]);

  return (
    <div className="grid-stack">
      {layout.map((item) => {
        const Component = componentMap[item.componentName];

        return (
          <div
            ref={refs.current[item.id]}
            key={item.id}
            className="grid-stack-item"
            gs-x={item.x}
            gs-y={item.y}
            gs-w={item.w}
            gs-h={item.h}
          >
            <div className="grid-stack-item-content">
              <Component {...item.props} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
