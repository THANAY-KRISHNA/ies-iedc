import React from 'react';
import { FolderSearch } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  className = ''
}) => {
  return (
    <div
      className={`neu-raised-soft rounded-xl p-8 md:p-12 text-center flex flex-col items-center justify-center border border-[#D8D8D3] ${className}`}
    >
      <div className="w-12 h-12 rounded-full neu-inset flex items-center justify-center text-[#777777] mb-4">
        {icon || <FolderSearch className="w-6 h-6" />}
      </div>
      <h3 className="text-base font-semibold text-[#161616] tracking-tight mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-[#777777] max-w-md mx-auto leading-relaxed mb-6">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
};
