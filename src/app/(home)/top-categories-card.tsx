import { cva, VariantProps } from "class-variance-authority";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/amount";
import { formatPercentage } from "@/lib/number";

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
  categories: { name: string; value: number; percentage: number }[];
}

export function TopCategoriesCard({
  title,
  categories,
  variant,
}: TopCategoriesCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {categories.length > 0 ? (
          <>
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
          </>
        ) : (
          <p className="flex h-24 items-center justify-center pb-4 text-sm text-muted-foreground">
            カテゴリーがありません。カテゴリーを追加してみましょう。
          </p>
        )}
      </CardContent>
    </Card>
  );
}
