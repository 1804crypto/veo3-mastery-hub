import React from 'react';

interface SkeletonProps {
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`bg-gray-700/50 rounded-md animate-shimmer ${className}`}
    />
  );
};

export default React.memo(Skeleton);