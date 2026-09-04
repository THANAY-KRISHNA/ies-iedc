import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  tag?: string;
  action?: React.ReactNode;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  tag,
  action,
  align = 'left',
  className = ''
}) => {
  return (
    <div
      className={`flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 mb-8 border-b border-[#D8D8D3] ${align === 'center' ? 'text-center md:text-center md:items-center' : ''} ${className}`}
    >
      <div className={align === 'center' ? 'max-w-2xl mx-auto' : 'max-w-2xl'}>
        {tag && (
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#242424] inline-block"></span>
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#777777]">
              {tag}
            </span>
          </div>
        )}
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#242424] tracking-tight">{title}</h2>
        {subtitle && (
          <p className="text-xs md:text-sm text-[#777777] mt-1.5 leading-relaxed">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
