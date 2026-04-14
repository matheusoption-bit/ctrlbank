import { cn } from "@/lib/utils";

/* ========================================
   Skeleton — C6 Bank Loading States
   ======================================== */

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "card" | "circle" | "chart";
}

export function Skeleton({ className, variant = "text", ...props }: SkeletonProps) {
  const variantClasses = {
    text: "h-4 w-full rounded-lg",
    card: "h-40 w-full rounded-3xl",
    circle: "h-12 w-12 rounded-full",
    chart: "h-[280px] w-full rounded-3xl",
  };

  return (
    <div
      className={cn("skeleton", variantClasses[variant], className)}
      {...props}
    />
  );
}

/* Dashboard Skeleton */
export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Balance skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-12 w-64" />
      </div>
      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Skeleton variant="card" className="h-28" />
        <Skeleton variant="card" className="h-28" />
        <Skeleton variant="card" className="h-28 hidden md:block" />
      </div>
      {/* Account scroll */}
      <div className="flex gap-4 overflow-hidden">
        <Skeleton className="h-[170px] w-[280px] min-w-[280px] rounded-3xl" />
        <Skeleton className="h-[170px] w-[280px] min-w-[280px] rounded-3xl" />
      </div>
      {/* Transactions */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-40" />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton variant="circle" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-5 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* Transaction List Skeleton */
export function TransactionListSkeleton() {
  return (
    <div className="space-y-3 animate-fade-in">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="card-premium-sm flex items-center gap-4">
          <Skeleton variant="circle" className="h-10 w-10" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-3 w-2/5" />
          </div>
          <Skeleton className="h-5 w-24" />
        </div>
      ))}
    </div>
  );
}

/* Account Cards Skeleton */
export function AccountCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} variant="card" className="h-[200px]" />
      ))}
    </div>
  );
}
