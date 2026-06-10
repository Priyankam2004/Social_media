const Loader = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} rounded-full border-gray-200 border-t-primary animate-spin`}
        style={{ animation: 'spin 0.8s linear infinite' }}
      />
    </div>
  );
};

// Skeleton loader for post cards
export const PostSkeleton = () => {
  return (
    <div className="bg-white rounded-[24px] shadow-[0_12px_40px_-12px_rgba(0,0,0,0.03)] border border-slate-100 p-5 mb-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full skeleton" />
        <div className="flex-1">
          <div className="w-28 h-4 skeleton mb-2" />
          <div className="w-20 h-3 skeleton" />
        </div>
      </div>
      {/* Image */}
      <div className="w-full h-80 skeleton mb-4 rounded-2xl" />
      {/* Actions */}
      <div className="flex gap-4 mb-3">
        <div className="w-16 h-5 skeleton rounded-xl" />
        <div className="w-16 h-5 skeleton rounded-xl" />
      </div>
      <div className="w-full h-4 skeleton mb-2 rounded" />
      <div className="w-2/3 h-4 skeleton rounded" />
    </div>
  );
};

export default Loader;
