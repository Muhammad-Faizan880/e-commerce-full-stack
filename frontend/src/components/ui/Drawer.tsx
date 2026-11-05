import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Darkened Dim Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10 z-50 pointer-events-none">
        {/* Solid Opaque Drawer Panel */}
        <div
          className={`pointer-events-auto w-screen ${widthClasses[width]} bg-[#faf9f5] border-l border-copen-border shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out`}
          style={{ backgroundColor: '#faf9f5' }}
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className="p-6 border-b border-copen-border/80 bg-[#faf9f5] flex items-start justify-between shrink-0">
            <div>
              {title && (
                <div className="font-serif font-bold text-3xl italic text-copen-black">
                  {title}
                </div>
              )}
              {subtitle && (
                <div className="text-xs text-copen-gray mt-1 font-normal">
                  {subtitle}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-copen-muted hover:text-copen-black transition-colors rounded-sm hover:bg-offwhite-hover cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>

          {/* Drawer Body - 100% Solid background */}
          <div className="flex-1 overflow-y-auto px-6 py-4 bg-[#faf9f5]">
            {children}
          </div>

          {/* Footer - 100% Solid background */}
          {footer && (
            <div className="border-t border-copen-border bg-[#f3f0e8] p-6 shrink-0">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
