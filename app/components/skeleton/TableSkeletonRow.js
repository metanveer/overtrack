import Skeleton from "./Skeleton";

export default function TableSkeletonRow() {
  return (
    <div className="animate-pulse flex w-full">
      <div className="px-4 py-3 flex-1">
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="px-4 py-3 flex-1">
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="px-4 py-3 flex-1">
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="px-4 py-3 flex-1">
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="px-4 py-3 flex-1">
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
}
