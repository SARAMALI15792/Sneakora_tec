import { Skeleton } from "@/components/ui/skeleton";

export default function ShopLoading() {
  return (
    <div className="pt-20">
      {/* Header band */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <Skeleton className="h-3 w-20" />
          <div className="mt-3 flex items-end justify-between">
            <Skeleton className="h-10 w-36 sm:h-12 sm:w-48" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-12 lg:grid-cols-[200px_1fr]">
          {/* Sidebar skeleton */}
          <aside className="hidden space-y-6 lg:block">
            <div className="space-y-3">
              <Skeleton className="h-3 w-16" />
              <div className="space-y-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-3 w-full" />
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <Skeleton className="h-3 w-12" />
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-7 w-full" />
                ))}
              </div>
            </div>
          </aside>

          {/* Grid skeleton */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[4/5]" />
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
