/**
 * Simple CSS-based Skeleton Component
 */
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ 
  className = '', 
  variant = 'text',
  width,
  height
}: SkeletonProps) {
  const baseStyles = "animate-pulse bg-gray-200 dark:bg-gray-700";
  
  const variantStyles = {
    text: "rounded",
    rectangular: "rounded-md",
    circular: "rounded-full"
  };

  const style: React.CSSProperties = {
    width: width ? (typeof width === 'number' ? `${width}px` : width) : '100%',
    height: height ? (typeof height === 'number' ? `${height}px` : height) : '1rem',
  };

  return (
    <div 
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={style}
    />
  );
}
