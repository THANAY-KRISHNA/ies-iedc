import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-4 py-1.5 text-xs',
    md: 'px-6 py-2 text-xs',
    lg: 'px-8 py-2.5 text-sm'
  }[size];

  const variantClasses = {
    primary: 'neu-button',
    secondary: 'neu-button-secondary',
    outline: 'bg-transparent text-[#242424] border border-[#D8D8D3] hover:bg-[#EBEBE8] active:bg-[#E0E0DB]',
    danger: 'bg-[#5A1E1E] text-white border border-[#421414] hover:bg-[#421414] active:bg-[#300E0E]',
    ghost: 'bg-transparent text-[#4A4A4A] hover:text-[#161616] hover:bg-[#EBEBE8]'
  }[variant];

  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 font-bold rounded-full transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
    </button>
  );
};
