export default function LoadingSkeleton() {
  return (
    <div className="max-w-lg bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 space-y-3 transition-colors">
      <div className="skeleton-bar h-4 w-24 rounded-full" />
      <div className="skeleton-bar h-4 w-full rounded" />
      <div className="skeleton-bar h-4 w-5/6 rounded" />
      <div className="skeleton-bar h-4 w-3/4 rounded" />
      <div className="flex gap-2 pt-1">
        <div className="skeleton-bar h-6 w-20 rounded-full" />
        <div className="skeleton-bar h-6 w-24 rounded-full" />
      </div>
    </div>
  );
}
