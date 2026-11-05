import React, { useState } from 'react';
import { Mail, ArrowLeft, ArrowRight, KeyRound, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface ForgotPasswordFormProps {
  onSwitchToLogin?: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSwitchToLogin,
}) => {
  const { requestPasswordReset, setAuthMode } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    const result = await requestPasswordReset(email);
    setIsLoading(false);

    if (!result.success) {
      setErrorMessage(result.error || 'Failed to send reset link.');
    }
  };

  const handleBackToLogin = () => {
    if (onSwitchToLogin) {
      onSwitchToLogin();
    } else {
      setAuthMode('login');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-1.5 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-olive-50 border border-olive-200 text-olive-800 text-[10px] uppercase tracking-widest font-semibold rounded-xs mb-1">
          <KeyRound className="w-3 h-3 text-olive-600" />
          <span>Security & Recovery</span>
        </div>
        <h2 className="font-serif text-3xl font-normal text-copen-black tracking-tight">
          Reset Password
        </h2>
        <p className="text-xs text-copen-gray leading-relaxed">
          Enter your registered Copenhagen email. We will dispatch a single-use verification link directly to your inbox.
        </p>
      </div>

      {/* Error Notice */}
      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xs animate-fade-in flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Registered Email"
          type="email"
          placeholder="faizan@designstudio.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail className="w-4 h-4 text-copen-muted" />}
          autoComplete="email"
          required
        />

        <div className="space-y-3 pt-1">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Send Recovery Instructions
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="md"
            fullWidth
            onClick={handleBackToLogin}
            leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
          >
            Back to Sign In
          </Button>
        </div>
      </form>

      {/* Help footnote */}
      <div className="p-3.5 bg-offwhite-card border border-copen-border text-center rounded-xs">
        <p className="text-[11px] text-copen-gray">
          Need immediate support? Contact our Copenhagen Concierge team at{' '}
          <a
            href="mailto:concierge@copenhagen.design"
            className="text-olive-700 underline font-medium"
          >
            concierge@copenhagen.design
          </a>
        </p>
      </div>
    </div>
  );
};

