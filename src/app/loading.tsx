import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="pt-20">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="space-y-6">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-96" />
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border border-border/50 bg-card overflow-hidden">
              <Skeleton className="aspect-square bg-muted/30" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-4 bg-muted/40 rounded w-3/4" />
                <Skeleton className="h-3 bg-muted/30 rounded w-1/2" />
                <div className="flex items-center justify-between pt-2">
                  <Skeleton className="h-5 bg-muted/40 rounded w-20" />
                  <Skeleton className="h-4 bg-muted/30 rounded w-12" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}