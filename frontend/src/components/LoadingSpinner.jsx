const LoadingSpinner = ({ size = 'md', message = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
    xl: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4 animate-fadeIn">
      <div className={`${sizeClasses[size]} border-primary-500 border-t-transparent rounded-full animate-spin`}></div>
      {message && <p className="text-text-secondary text-sm font-medium animate-pulse">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;

// ============================================================================
// Enhanced Loading Component - Jan 1, 2026
// ============================================================================

// Loading overlay for full page
export const LoadingOverlay = ({ message = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-700">{message}</p>
      </div>
    </div>
  );
};

// Inline loading for buttons
export const ButtonLoading = () => {
  return (
    <div className="inline-flex items-center">
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
      <span>Processing...</span>
    </div>
  );
};

// Skeleton loader for content
export const SkeletonLoader = ({ lines = 3 }) => {
  return (
    <div className="animate-pulse space-y-3">
      {[...Array(lines)].map((_, i) => (
        <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
      ))}
    </div>
  );
};