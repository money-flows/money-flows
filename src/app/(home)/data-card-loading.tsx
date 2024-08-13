import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DataCardLoading() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-12" />
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
