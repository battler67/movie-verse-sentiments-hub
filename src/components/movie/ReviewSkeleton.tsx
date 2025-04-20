
const ReviewSkeleton = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border border-white/5 rounded-lg bg-movie-dark p-6 animate-pulse">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-white/10"></div>
            <div className="flex-1">
              <div className="h-4 bg-white/10 rounded w-24 mb-2"></div>
              <div className="h-3 bg-white/10 rounded w-16"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-white/10 rounded w-full"></div>
            <div className="h-3 bg-white/10 rounded w-full"></div>
            <div className="h-3 bg-white/10 rounded w-3/4"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewSkeleton;
