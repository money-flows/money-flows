import { cva, VariantProps } from "class-variance-authority";
import { IconType } from "react-icons";

import { formatCurrency } from "@/lib/amount";
import { formatPercentage } from "@/lib/number";
import { cn } from "@/lib/utils";

import { CountUp } from "./count-up";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Skeleton } from "./ui/skeleton";

const boxVariant = cva("shrink-0 rounded-md p-3", {
  variants: {
    variant: {
      default: "bg-blue-500/20",
      success: "bg-emerald-500/20",
      danger: "bg-rose-500/20",
      warning: "bg-yellow-500/20",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const iconVariant = cva("size-6", {
  variants: {
    variant: {
      default: "fill-blue-500",
      success: "fill-emerald-500",
      danger: "fill-rose-500",
      warning: "fill-yellow-500",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type BoxVariants = VariantProps<typeof boxVariant>;
type IconVariants = VariantProps<typeof iconVariant>;

interface DataCardProps extends BoxVariants, IconVariants {
  icon: IconType;
  title: string;
  value?: number;
  dateRange: string;
  percentageChange?: number;
}

export function DataCard({
  icon: Icon,
  title,
  value = 0,
  dateRange,
  percentageChange = 0,
  variant,
}: DataCardProps) {
  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-2">
          <CardTitle className="line-clamp-1 text-2xl">{title}</CardTitle>
          <CardDescription className="line-clamp-1 tabular-nums tracking-tighter">
            {dateRange}
          </CardDescription>
        </div>
        <div className={boxVariant({ variant })}>
          <Icon className={iconVariant({ variant })} />
        </div>
      </CardHeader>
      <CardContent>
        <h1 className="mb-2 line-clamp-1 break-all text-2xl font-bold">
          <CountUp
            preserveValue
            start={0}
            end={value}
            formattingFn={formatCurrency}
          />
        </h1>
        <p className="line-clamp-1 text-sm text-muted-foreground">
          {percentageChange === 0 ? (
            "前の期間からの変化はありません。"
          ) : (
            <>
              前の期間から
              <span
                className={cn(
                  "tabular-nums tracking-tighter font-medium px-1",
                  percentageChange > 0 && "text-emerald-500",
                  percentageChange < 0 && "text-rose-500",
                )}
              >
                {formatPercentage(percentageChange, { addPrefix: true })}
              </span>
              変化しました。
            </>
          )}
        </p>
      </CardContent>
    </Card>
  );
}

export function DataCardLoading() {
  return (
    <Card className="h-48 border-none drop-shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-12" />
          <Skeleton className="h-5 w-40" />
        </div>
        <Skeleton className="size-12" />
      </CardHeader>
      <CardContent>
        <Skeleton className="mb-2 h-8 w-28 shrink-0" />
        <Skeleton className="h-5 w-52 shrink-0" />
      </CardContent>
    </Card>
  );
}
