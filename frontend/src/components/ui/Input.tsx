import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-[11px] font-medium uppercase tracking-wider text-copen-gray"
          >
            {label}
            {props.required && <span className="text-olive-700 ml-0.5">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-copen-muted pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full bg-offwhite-surface border text-copen-black text-sm px-3.5 py-2.5 transition-colors placeholder:text-copen-muted/70 focus:outline-none focus:border-olive-600 focus:ring-1 focus:ring-olive-600 ${
              error ? 'border-rose-400 bg-rose-50/20' : 'border-copen-border'
            } ${leftIcon ? 'pl-9' : ''} ${rightIcon ? 'pr-9' : ''} ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 text-copen-muted pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-[11px] text-rose-600">{error}</p>}
        {helperText && !error && (
          <p className="text-[11px] text-copen-muted">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

