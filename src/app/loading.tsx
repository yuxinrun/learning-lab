import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container py-16">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="mt-6 h-12 w-2/3" />
      <Skeleton className="mt-4 h-5 w-1/2" />
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="rounded-lg border border-border p-5">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="mt-5 h-5 w-3/4" />
            <Skeleton className="mt-3 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
