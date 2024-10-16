export type LayoutComponent =
  | {
      name: "MonthlyIncomeExpenseRemainingChart";
      props: {
        title: string;
      };
    }
  | {
      name: "MonthlyExpenseChart";
      props: {
        title: string;
        cumulative?: boolean;
        categoryIds?: string[];
      };
    }
  | {
      name: "MonthlyIncomeChart";
      props: {
        title: string;
        cumulative?: boolean;
        categoryIds?: string[];
      };
    };

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type LayoutItem = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  component: LayoutComponent;
};
