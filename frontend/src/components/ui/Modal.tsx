import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'lg',
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

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Dim Darkened Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Solid Opaque Modal Dialog */}
      <div
        className={`relative w-full ${maxWidthClasses[maxWidth]} bg-[#faf9f5] border border-copen-border shadow-2xl z-10 my-8 transition-all animate-fade-in`}
        style={{ backgroundColor: '#faf9f5' }}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b border-copen-border px-6 py-4 bg-[#faf9f5]">
          <div>
            {title && (
              <h3 className="font-serif text-2xl font-bold text-copen-black">{title}</h3>
            )}
            {subtitle && (
              <p className="text-xs text-copen-gray mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-copen-muted hover:text-copen-black transition-colors rounded-sm hover:bg-offwhite-hover cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 bg-[#faf9f5]">{children}</div>
      </div>
    </div>
  );
};
