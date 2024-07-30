import * as React from "react";

import { cn } from "@/lib/utils";

const H1 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  return (
    <h1 className={cn("text-3xl font-bold", className)} ref={ref} {...props} />
  );
});
H1.displayName = "H1";

export { H1 };
