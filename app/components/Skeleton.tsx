import React from 'react';

interface SkeletonProps {
  /**
   * Additional Tailwind classes to apply (e.g. width/height overrides).
   */
  className?: string;
  /**
   * Inline styling for width/height if you want to pass values directly.
   */
  style?: React.CSSProperties;
}

const Skeleton: React.FC<SkeletonProps> = ({ className = '', style = {} }) => {
  return (
    <div
      className={`bg-gray-300 rounded animate-pulse ${className}`}
      style={style}
    />
  );
};

export default Skeleton;
