"use client";

interface ProgressBarProps {
  progress: number;
  height?: string;
  showPercentage?: boolean;
  className?: string;
}

export function ProgressBar({ 
  progress, 
  height = "h-2", 
  showPercentage = false,
  className = ""
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  
  const getProgressColor = (progress: number) => {
    if (progress >= 100) return "bg-green-500";
    if (progress >= 75) return "bg-blue-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-orange-500";
  };

  return (
    <div className={`w-full ${className}`}>
      <div className={`w-full ${height} bg-slate-200 rounded-full overflow-hidden`}>
        <div
          className={`${height} ${getProgressColor(clampedProgress)} transition-all duration-300 ease-out rounded-full`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      {showPercentage && (
        <div className="mt-1 text-right">
          <span className="text-xs text-slate-600">{clampedProgress}%</span>
        </div>
      )}
    </div>
  );
}