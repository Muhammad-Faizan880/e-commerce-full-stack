import React from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { PasswordResetSuccess } from './PasswordResetSuccess';

export const AuthModal: React.FC = () => {
  const { authModalOpen, closeAuthModal, authMode, setAuthMode } = useAuth();

  if (!authModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={closeAuthModal}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        className="relative w-full max-w-xl bg-[#faf9f5] border border-copen-border shadow-2xl z-10 my-8 transition-all animate-fade-in"
        style={{ backgroundColor: '#faf9f5' }}
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header / Switcher */}
        <div className="flex items-center justify-between border-b border-copen-border px-6 py-4 bg-[#faf9f5]">
          {/* Tabs for Login / Register */}
          {authMode === 'login' || authMode === 'register' ? (
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`text-xs uppercase tracking-[0.16em] font-medium pb-1 relative transition-colors cursor-pointer ${
                  authMode === 'login'
                    ? 'text-copen-black font-semibold'
                    : 'text-copen-muted hover:text-copen-black'
                }`}
              >
                Sign In
                {authMode === 'login' && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-olive-600" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className={`text-xs uppercase tracking-[0.16em] font-medium pb-1 relative transition-colors cursor-pointer ${
                  authMode === 'register'
                    ? 'text-copen-black font-semibold'
                    : 'text-copen-muted hover:text-copen-black'
                }`}
              >
                Create Account
                {authMode === 'register' && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-olive-600" />
                )}
              </button>
            </div>
          ) : (
            <div className="text-xs uppercase tracking-[0.16em] font-medium text-copen-black">
              Account Recovery
            </div>
          )}

          {/* Close button */}
          <button
            type="button"
            onClick={closeAuthModal}
            className="p-1.5 text-copen-muted hover:text-copen-black transition-colors rounded-xs hover:bg-offwhite-hover cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 bg-[#faf9f5]">
          {authMode === 'login' && <LoginForm onSuccess={closeAuthModal} />}
          {authMode === 'register' && <RegisterForm onSuccess={() => setAuthMode('login')} />}
          {authMode === 'forgot-password' && (
            <ForgotPasswordForm onSwitchToLogin={() => setAuthMode('login')} />
          )}
          {authMode === 'reset-sent' && (
            <PasswordResetSuccess onSwitchToLogin={() => setAuthMode('login')} />
          )}
        </div>
      </div>
    </div>
  );
};

