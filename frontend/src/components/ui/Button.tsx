import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'olive-outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium tracking-wider uppercase transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-olive-600/40 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none';

  const sizeStyles = {
    sm: 'text-[11px] px-3 py-1.5 gap-1.5',
    md: 'text-xs px-5 py-3 gap-2',
    lg: 'text-xs md:text-sm px-7 py-3.5 gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-olive-600 text-offwhite-50 hover:bg-olive-700 active:bg-olive-800 shadow-sm border border-olive-700',
    secondary:
      'bg-copen-black text-offwhite-50 hover:bg-black active:bg-neutral-900 border border-copen-black',
    outline:
      'border border-copen-charcoal/40 text-copen-black hover:border-copen-black hover:bg-offwhite-hover active:bg-offwhite-300',
    'olive-outline':
      'border border-olive-600 text-olive-700 hover:bg-olive-50 active:bg-olive-100',
    ghost:
      'text-copen-black hover:bg-offwhite-hover/70 active:bg-offwhite-300 border border-transparent',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Processing...
        </span>
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

