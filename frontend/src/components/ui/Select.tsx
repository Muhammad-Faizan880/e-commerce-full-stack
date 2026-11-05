import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, className = '', id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-[11px] font-medium uppercase tracking-wider text-copen-gray"
          >
            {label}
            {props.required && <span className="text-olive-700 ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={`w-full bg-offwhite-surface border text-copen-black text-sm px-3.5 py-2.5 pr-10 appearance-none transition-colors focus:outline-none focus:border-olive-600 focus:ring-1 focus:ring-olive-600 cursor-pointer ${
              error ? 'border-rose-400' : 'border-copen-border'
            } ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-offwhite-surface text-copen-black">
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-copen-gray">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error && <p className="text-[11px] text-rose-600">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

