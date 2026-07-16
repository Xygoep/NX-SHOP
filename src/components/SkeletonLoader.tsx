/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export default function SkeletonLoader() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-6 w-full">
      {[1, 2, 3, 4].map((index) => (
        <div
          key={index}
          className="glass-panel rounded-[20px] overflow-hidden border border-white/5 p-2 sm:p-3 flex flex-col h-full animate-pulse"
        >
          {/* Card Image Skeleton */}
          <div className="aspect-[4/3] w-full bg-white/5 rounded-[15px] mb-3 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
          </div>

          {/* Title Skeleton */}
          <div className="h-4 sm:h-5 bg-white/10 rounded-md w-3/4 mb-2 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
          </div>

          {/* Description Skeleton */}
          <div className="h-3 bg-white/5 rounded-md w-full mb-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
          </div>

          {/* Price and Action Skeleton */}
          <div className="mt-auto pt-2 border-t border-white/5 flex items-center justify-between">
            <div className="h-4 bg-white/10 rounded-md w-1/3 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
            </div>
            <div className="h-7 w-12 bg-white/10 rounded-full relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
