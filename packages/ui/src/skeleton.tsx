// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { cn } from "@allyson/ui/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-primary/10", className)}
      {...props}
    />
  )
}

export { Skeleton }
