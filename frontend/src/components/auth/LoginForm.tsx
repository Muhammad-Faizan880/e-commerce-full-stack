import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
  onSwitchToForgot?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onSwitchToRegister,
  onSwitchToForgot,
}) => {
  const { login, setAuthMode } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);
    const result = await login({ email, password, rememberMe });
    setIsLoading(false);

    if (result.success) {
      if (onSuccess) onSuccess();
    } else {
      setErrorMessage(result.error || 'Failed to sign in. Please verify your credentials.');
    }
  };

  const handleRegisterClick = () => {
    if (onSwitchToRegister) {
      onSwitchToRegister();
    } else {
      setAuthMode('register');
    }
  };

  const handleForgotClick = () => {
    if (onSwitchToForgot) {
      onSwitchToForgot();
    } else {
      setAuthMode('forgot-password');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Editorial Header */}
      <div className="space-y-1.5 text-center sm:text-left">
        <span className="text-[10px] uppercase tracking-[0.25em] text-olive-700 font-semibold">
          Member Access
        </span>
        <h2 className="font-serif text-3xl font-normal text-copen-black tracking-tight">
          Welcome back
        </h2>
        <p className="text-xs text-copen-gray leading-relaxed">
          Sign in to your Copenhagen account to manage bespoke orders, design curation, and member privileges.
        </p>
      </div>

      {/* Error Notice */}
      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xs animate-fade-in flex items-start gap-2">
          <span className="font-bold">•</span>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-4.5">
        <Input
          label="Email Address"
          type="email"
          placeholder="name@designstudio.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail className="w-4 h-4 text-copen-muted" />}
          autoComplete="email"
          required
        />

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-[11px] font-medium uppercase tracking-wider text-copen-gray">
              Password <span className="text-olive-700">*</span>
            </label>
            <button
              type="button"
              onClick={handleForgotClick}
              className="text-[11px] font-medium text-olive-700 hover:text-olive-900 transition-colors underline underline-offset-4 cursor-pointer"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative flex items-center">
            <div className="absolute left-3 text-copen-muted pointer-events-none">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="w-full bg-offwhite-surface border border-copen-border text-copen-black text-sm px-3.5 py-2.5 pl-9 pr-10 transition-colors placeholder:text-copen-muted/70 focus:outline-none focus:border-olive-600 focus:ring-1 focus:ring-olive-600"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-copen-muted hover:text-copen-black transition-colors cursor-pointer"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded-xs border-copen-border text-olive-600 focus:ring-olive-600/30 accent-olive-600 cursor-pointer"
            />
            <span className="text-xs text-copen-gray">Remember me on this browser</span>
          </label>
        </div>

        {/* Sign In Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Sign In to Copenhagen
        </Button>
      </form>

      {/* Scandinavian Divider */}
      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-copen-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[#faf9f5] px-4 text-[10px] tracking-widest text-copen-muted">
            Or continue with
          </span>
        </div>
      </div>

      {/* Social Login Options */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => {
            setEmail('google.user@example.com');
            setPassword('securePass123');
          }}
          className="flex items-center justify-center gap-2.5 py-2.5 px-4 bg-offwhite-card hover:bg-offwhite-hover border border-copen-border text-xs font-medium text-copen-black transition-all cursor-pointer rounded-xs"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Google</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setEmail('apple.id@icloud.com');
            setPassword('securePass123');
          }}
          className="flex items-center justify-center gap-2.5 py-2.5 px-4 bg-offwhite-card hover:bg-offwhite-hover border border-copen-border text-xs font-medium text-copen-black transition-all cursor-pointer rounded-xs"
        >
          <svg className="w-3.5 h-3.5 fill-current text-copen-black" viewBox="0 0 170 170">
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.31-7.85-12.04-13.62-25.79-17.3-41.25-3.69-15.46-4.04-29.35-1.05-41.67 3.38-14.07 9.87-25.07 19.46-32.99 9.6-7.92 20.35-11.97 32.27-12.16 4.7 0 9.89 1.15 15.58 3.44 5.69 2.29 9.65 3.48 11.88 3.58 1.83-.2 5.86-1.42 12.09-3.68 6.23-2.25 11.58-3.23 16.05-2.93 11.9.82 21.6 5.09 29.11 12.82-10.42 6.32-15.53 14.93-15.34 25.82.2 10.38 4.28 18.9 12.24 25.56 3.69 3.04 7.79 5.3 12.3 6.78-2.67 7.77-5.93 15.63-9.78 23.58zM119.22 33.15c0-6.73 2.4-13.06 7.21-18.98 4.81-5.92 10.9-10.15 18.27-12.7 1.25 5.51 1.16 11.23-.27 17.15-1.43 5.92-4.22 11.39-8.38 16.4-4.26 5.14-9.08 8.87-14.47 11.19-.59-4.22-1.36-8.58-2.36-13.06z" />
          </svg>
          <span>Apple</span>
        </button>
      </div>

      {/* Switch to Register */}
      <div className="pt-2 text-center text-xs text-copen-gray border-t border-copen-border">
        <span>Don't have a Copenhagen account? </span>
        <button
          type="button"
          onClick={handleRegisterClick}
          className="text-olive-700 font-semibold hover:text-olive-900 transition-colors uppercase tracking-wider underline underline-offset-4 cursor-pointer ml-1"
        >
          Create account
        </button>
      </div>

      {/* Security note */}
      <div className="flex items-center justify-center gap-1.5 text-[10px] text-copen-muted uppercase tracking-widest pt-1">
        <ShieldCheck className="w-3.5 h-3.5 text-olive-600" />
        <span>End-to-end encrypted Nordic commerce</span>
      </div>
    </div>
  );
};

