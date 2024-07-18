import { cva, VariantProps } from "class-variance-authority";

import { formatCurrency } from "@/lib/amount";
import { formatPercentage } from "@/lib/number";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
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

const indicatorVariant = cva(undefined, {
  variants: {
    variant: {
      default: "bg-blue-500",
      success: "bg-emerald-500",
      danger: "bg-rose-500",
      warning: "bg-yellow-500",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type BoxVariants = VariantProps<typeof boxVariant>;
type IconVariants = VariantProps<typeof iconVariant>;
type IndicatorVariants = VariantProps<typeof indicatorVariant>;

interface TopCategoriesCardProps
  extends BoxVariants,
    IconVariants,
    IndicatorVariants {
  title: string;
  categories?: { name: string; value: number; percentage: number }[];
}

export function TopCategoriesCard({
  title,
  categories = [],
  variant,
}: TopCategoriesCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="line-clamp-1 text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {categories.map((category, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between text-base">
              <span>{category.name}</span>
              <div className="space-x-2">
                <span className="ml-auto">
                  {formatCurrency(category.value)}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({formatPercentage(category.percentage)})
                </span>
              </div>
            </div>
            <Progress
              value={category.percentage}
              classNames={{
                indicator: indicatorVariant({ variant }),
              }}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function TopCategoriesCardLoading() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-7 w-40" />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between text-base">
              <Skeleton key={index} className="h-6 w-16" />
              <Skeleton key={index} className="h-6 w-28" />
            </div>
            <Skeleton key={index} className="h-3 w-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
