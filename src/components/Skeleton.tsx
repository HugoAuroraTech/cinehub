export function MovieCardSkeleton() {
  return (
    <div className="bg-gray-800/50 dark:bg-gray-800/50 rounded-lg overflow-hidden shadow-lg animate-pulse">
      <div className="w-full h-80 bg-gray-700/50 dark:bg-gray-700/50"></div>
      <div className="p-4">
        <div className="h-6 bg-gray-700/50 dark:bg-gray-700/50 rounded mb-2"></div>
        <div className="h-4 bg-gray-700/50 dark:bg-gray-700/50 rounded w-16"></div>
      </div>
    </div>
  );
}

export function MovieDetailsSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Poster Skeleton */}
        <div className="lg:w-1/3">
          <div className="w-full max-w-md mx-auto lg:mx-0 h-96 bg-gray-700/50 dark:bg-gray-700/50 rounded-lg"></div>
        </div>

        {/* Details Skeleton */}
        <div className="lg:w-2/3 space-y-4">
          <div className="h-12 bg-gray-700/50 dark:bg-gray-700/50 rounded"></div>
          <div className="flex gap-4">
            <div className="h-6 bg-gray-700/50 dark:bg-gray-700/50 rounded w-20"></div>
            <div className="h-6 bg-gray-700/50 dark:bg-gray-700/50 rounded w-24"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-8 bg-gray-700/50 dark:bg-gray-700/50 rounded-full w-20"></div>
            <div className="h-8 bg-gray-700/50 dark:bg-gray-700/50 rounded-full w-24"></div>
            <div className="h-8 bg-gray-700/50 dark:bg-gray-700/50 rounded-full w-16"></div>
          </div>
          <div className="space-y-2">
            <div className="h-6 bg-gray-700/50 dark:bg-gray-700/50 rounded w-32"></div>
            <div className="h-4 bg-gray-700/50 dark:bg-gray-700/50 rounded"></div>
            <div className="h-4 bg-gray-700/50 dark:bg-gray-700/50 rounded"></div>
            <div className="h-4 bg-gray-700/50 dark:bg-gray-700/50 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 20 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <MovieCardSkeleton key={index} />
      ))}
    </div>
  );
} 