import Skeleton from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div role="status" className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
      <span className="sr-only">Loading</span>
      <Skeleton className="mb-3 h-5 w-28" />
      <Skeleton className="mb-8 h-10 w-64 max-w-full" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    </div>
  );
}