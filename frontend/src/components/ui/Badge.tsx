import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'almond' | 'sale' | 'olive' | 'neutral' | 'dark';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'almond',
  className = '',
}) => {
  const base =
    'inline-flex items-center px-2 py-0.5 text-[10px] tracking-widest font-semibold uppercase transition-colors';

  const variants = {
    almond: 'bg-offwhite-card text-copen-charcoal border border-copen-border',
    sale: 'bg-rose-100 text-rose-800 border border-rose-200',
    olive: 'bg-olive-100 text-olive-800 border border-olive-200',
    neutral: 'bg-offwhite-surface text-copen-gray border border-copen-border',
    dark: 'bg-copen-black text-offwhite-50 border border-copen-black',
  };

  return (
    <span className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

