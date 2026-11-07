import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ message = 'Loading...', size = 'default' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    default: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-slate-500">
      <Loader2 className={`${sizeClasses[size] || sizeClasses.default} animate-spin text-indigo-600 mb-3`} />
      {message && <p className="text-sm font-medium">{message}</p>}
    </div>
  );
};

export const TableSkeleton = ({ rows = 5 }) => {
  return (
    <div className="w-full animate-pulse space-y-4">
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-slate-100">
          <div className="rounded-full bg-slate-200 h-10 w-10"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
            <div className="h-3 bg-slate-100 rounded w-1/3"></div>
          </div>
          <div className="h-4 bg-slate-200 rounded w-1/6"></div>
          <div className="h-4 bg-slate-200 rounded w-1/12"></div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSpinner;
