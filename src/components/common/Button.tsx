import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const variants = {
  primary: 'bg-accent text-on-accent hover:bg-accent-hover shadow-soft hover:shadow-elevated',
  secondary: 'bg-surface text-primary border border-app hover:bg-surface-hover shadow-soft',
  ghost: 'text-secondary hover:text-primary hover:bg-surface-hover',
  danger: 'bg-[var(--color-danger)] text-white hover:opacity-90 shadow-soft',
};

const sizes = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
};

export function Button({
  variant = 'secondary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active-press ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
