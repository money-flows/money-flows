"use client";

import "gridstack/dist/gridstack.css";

import { GridStack } from "gridstack";
import { createRef, useEffect, useRef, useState } from "react";

import { MonthlyIncomeExpenseRemainingChart } from "./monthly-income-expense-remaining-chart";
import { MonthlyLineChart } from "./monthly-line-chart";

type LayoutComponent =
  | {
      name: "MonthlyIncomeExpenseRemainingChart";
      props: {
        title: string;
      };
    }
  | {
      name: "MonthlyLineChart";
      props: {
        title: string;
        type: "remaining" | "income" | "expense";
      };
    };

interface LayoutItem {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  component: LayoutComponent;
}

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
        title: "残高の推移（年間）",
        type: "remaining",
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
        title: "収入の推移（年間）",
        type: "income",
      },
    },
  },
];

function ChartComponent({ component }: { component: LayoutComponent }) {
  switch (component.name) {
    case "MonthlyIncomeExpenseRemainingChart":
      return <MonthlyIncomeExpenseRemainingChart {...component.props} />;
    case "MonthlyLineChart":
      return <MonthlyLineChart {...component.props} />;
    default:
      return null;
  }
}

export default function Page() {
  const [layout] = useState(defaultLayout);

  const refs = useRef<{ [key in string]: React.RefObject<HTMLDivElement> }>({});
  const gridRef = useRef<GridStack>();

  if (Object.keys(refs.current).length !== layout.length) {
    layout.forEach(({ id }) => {
      refs.current[id] = refs.current[id] || createRef<HTMLDivElement>();
    });
  }

  useEffect(() => {
    gridRef.current = gridRef.current ?? GridStack.init();
    const grid = gridRef.current;
    grid.batchUpdate();
    grid.removeAll(false);
    layout.forEach(({ id }) => {
      if (refs.current[id].current) {
        grid.makeWidget(refs.current[id].current);
      }
    });
    grid.batchUpdate(false);
  }, [layout]);

  return (
    <div className="grid-stack [&_.grid-stack-placeholder>.placeholder-content]:rounded-lg">
      {layout.map((item) => {
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
            <div className="grid-stack-item-content rounded-lg">
              <ChartComponent component={item.component} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
