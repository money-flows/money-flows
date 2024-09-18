export type LayoutComponent =
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

export interface LayoutItem {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  component: LayoutComponent;
}
