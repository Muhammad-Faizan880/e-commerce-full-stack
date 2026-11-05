import React, { useState } from 'react';
import { MailCheck, ArrowLeft, RotateCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

interface PasswordResetSuccessProps {
  onSwitchToLogin?: () => void;
}

export const PasswordResetSuccess: React.FC<PasswordResetSuccessProps> = ({
  onSwitchToLogin,
}) => {
  const { resetSentEmail, requestPasswordReset, setAuthMode } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [resendNotice, setResendNotice] = useState(false);

  const handleResend = async () => {
    if (!resetSentEmail) return;
    setIsResending(true);
    await requestPasswordReset(resetSentEmail);
    setIsResending(false);
    setResendNotice(true);
    setTimeout(() => setResendNotice(false), 4000);
  };

  const handleBackToLogin = () => {
    if (onSwitchToLogin) {
      onSwitchToLogin();
    } else {
      setAuthMode('login');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6 text-center animate-fade-in">
      {/* Icon Badge */}
      <div className="mx-auto w-16 h-16 rounded-full bg-olive-50 border border-olive-200 text-olive-700 flex items-center justify-center">
        <MailCheck className="w-8 h-8 text-olive-600" />
      </div>

      {/* Editorial Title */}
      <div className="space-y-2">
        <span className="text-[10px] uppercase tracking-[0.25em] text-olive-700 font-semibold">
          Dispatch Confirmed
        </span>
        <h2 className="font-serif text-3xl font-normal text-copen-black tracking-tight">
          Check your email
        </h2>
        <p className="text-xs text-copen-gray leading-relaxed max-w-sm mx-auto">
          We have forwarded instructions and a secure one-time reset link to:
        </p>
        <div className="inline-block px-3.5 py-1.5 bg-offwhite-card border border-copen-border rounded-xs text-xs font-semibold text-copen-black">
          {resetSentEmail || 'your email address'}
        </div>
      </div>

      {resendNotice && (
        <div className="p-2.5 bg-olive-50 border border-olive-200 text-olive-800 text-xs rounded-xs animate-fade-in">
          A fresh recovery email has been sent.
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3 pt-3">
        <Button
          type="button"
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleBackToLogin}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Return to Sign In
        </Button>

        <button
          type="button"
          onClick={handleResend}
          disabled={isResending}
          className="inline-flex items-center gap-2 text-xs font-medium text-copen-gray hover:text-copen-black transition-colors uppercase tracking-wider py-2 cursor-pointer disabled:opacity-50"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin text-olive-600' : ''}`} />
          <span>{isResending ? 'Transmitting...' : 'Did not receive? Resend email'}</span>
        </button>
      </div>
    </div>
  );
};

