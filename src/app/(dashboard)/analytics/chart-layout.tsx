import { GridStack } from "gridstack";
import { createRef, useEffect, useRef } from "react";

import { MonthlyIncomeExpenseRemainingChart } from "./monthly-income-expense-remaining-chart";
import { MonthlyLineChart } from "./monthly-line-chart";
import { LayoutComponent, LayoutItem } from "./types";

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

interface ChartLayoutProps {
  layout: LayoutItem[];
  editable?: boolean;
}

export function ChartLayout({ layout, editable }: ChartLayoutProps) {
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
  }, [layout, editable]);

  return (
    <div className="grid-stack -m-2.5 [&_.grid-stack-placeholder>.placeholder-content]:rounded-lg">
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
            gs-no-resize={editable ? undefined : "true"}
            gs-no-move={editable ? undefined : "true"}
            gs-locked={editable ? undefined : "true"}
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
