import React from 'react';

interface LoadingStateProps {
  message?: string;
  rows?: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading verified institutional records...',
  rows = 3
}) => {
  return (
    <div className="w-full py-12 flex flex-col items-center justify-center space-y-4">
      <div className="w-8 h-8 rounded-full border-2 border-[#D8D8D3] border-t-[#242424] animate-spin" />
      <p className="text-xs tracking-wider uppercase text-[#777777] font-medium">{message}</p>
      <div className="w-full max-w-xl space-y-2.5 mt-4 opacity-40">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-6 bg-[#EBEBE8] rounded-md animate-pulse" />
        ))}
      </div>
    </div>
  );
};
