import { format } from "date-fns";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

import { CustomTooltip } from "./custom-tooltip";

interface BarVariantProps {
  data: {
    date: string;
    income: number;
    expenses: number;
  }[];
  height: number;
}

export function BarVariant({ data, height }: BarVariantProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          axisLine={false}
          tickLine={false}
          dataKey="date"
          tickFormatter={(date: string) => format(date, "dd")}
          style={{ fontSize: "12px" }}
          tickMargin={16}
        />
        <Tooltip content={CustomTooltip} />
        <Bar dataKey="income" fill="#3d82f6" className="drop-shadow-sm" />
        <Bar dataKey="expenses" fill="#f43f5e" className="drop-shadow-sm" />
      </BarChart>
    </ResponsiveContainer>
  );
}
