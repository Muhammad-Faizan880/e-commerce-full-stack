import React from 'react';
import { Minus, Plus } from 'lucide-react';

export interface QuantitySelectorProps {
  quantity: number;
  min?: number;
  max?: number;
  onChange: (newQuantity: number) => void;
  size?: 'sm' | 'md';
  className?: string;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  min = 1,
  max = 99,
  onChange,
  size = 'md',
  className = '',
}) => {
  const handleDecrement = () => {
    if (quantity > min) {
      onChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < max) {
      onChange(quantity + 1);
    }
  };

  const sizeClasses = {
    sm: 'h-7 text-xs',
    md: 'h-8 text-xs',
  };

  const buttonClasses =
    'flex items-center justify-center px-2 text-copen-gray hover:text-copen-black hover:bg-offwhite-hover transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer';

  return (
    <div
      className={`inline-flex items-center border border-copen-border bg-offwhite-surface ${sizeClasses[size]} ${className}`}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={quantity <= min}
        className={buttonClasses}
        aria-label="Decrease quantity"
      >
        <Minus className="w-3 h-3" />
      </button>
      <span className="w-8 text-center font-medium tabular-nums select-none text-copen-black">
        {quantity}
      </span>
      <button
        type="button"
        onClick={handleIncrement}
        disabled={quantity >= max}
        className={buttonClasses}
        aria-label="Increase quantity"
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  );
};

