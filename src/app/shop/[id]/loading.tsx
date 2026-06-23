import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <div className="pt-20">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Back link skeleton */}
        <Skeleton className="mb-8 h-3 w-32" />

        {/* Product detail layout */}
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Gallery skeleton */}
          <div className="space-y-4">
            <Skeleton className="aspect-[4/5]" />
            <div className="flex gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square w-20" />
              ))}
            </div>
          </div>

          {/* Info skeleton */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="h-10 w-28" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <div className="flex gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="size-8" />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-12" />
              <div className="flex gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-10" />
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-11 flex-1" />
              <Skeleton className="size-11" />
            </div>
            <div className="space-y-1.5 pt-6">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
