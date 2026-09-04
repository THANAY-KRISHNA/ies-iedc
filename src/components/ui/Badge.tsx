import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'dark' | 'success' | 'warning' | 'outline' | 'review';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = ''
}) => {
  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-[10px] font-bold' : 'px-3 py-1 text-xs font-bold';

  const variantClasses = {
    neutral: 'bg-[#EBEBE8] text-[#4A4A4A] border border-[#D8D8D3]',
    dark: 'bg-[#242424] text-[#FFFFFF] border border-[#161616]',
    success: 'bg-[#EFEFEA] text-[#1E3A1E] border border-[#C5D5C5]',
    warning: 'bg-[#F2ECE4] text-[#4A3B22] border border-[#DCD3C7]',
    outline: 'bg-transparent text-[#4A4A4A] border border-[#D8D8D3]',
    review: 'bg-[#FFF3E0] text-[#8C4A00] border border-[#F3C287] font-bold'
  }[variant];

  return (
    <span
      className={`inline-flex items-center rounded-full tracking-wide whitespace-nowrap select-none ${sizeClasses} ${variantClasses} ${className}`}
    >
      {children}
    </span>
  );
};
