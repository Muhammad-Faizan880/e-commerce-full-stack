import React, { useState, useMemo } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  onSwitchToLogin,
}) => {
  const { register, setAuthMode } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: '', color: 'bg-copen-border' };
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    switch (score) {
      case 1:
        return { score: 25, label: 'Weak', color: 'bg-rose-400' };
      case 2:
        return { score: 50, label: 'Fair', color: 'bg-amber-400' };
      case 3:
        return { score: 75, label: 'Good', color: 'bg-olive-500' };
      case 4:
        return { score: 100, label: 'Strong', color: 'bg-olive-700' };
      default:
        return { score: 10, label: 'Too short', color: 'bg-rose-400' };
    }
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!agreeTerms) {
      setErrorMessage('Please accept the Terms & Conditions to create an account.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setIsLoading(true);
    const result = await register({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      agreeTerms,
      subscribeNewsletter,
    });
    setIsLoading(false);

    if (result.success) {
      if (onSuccess) onSuccess();
    } else {
      setErrorMessage(result.error || 'Failed to create account.');
    }
  };

  const handleLoginClick = () => {
    if (onSwitchToLogin) {
      onSwitchToLogin();
    } else {
      setAuthMode('login');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Editorial Header */}
      <div className="space-y-1.5 text-center sm:text-left">
        <span className="text-[10px] uppercase tracking-[0.25em] text-olive-700 font-semibold">
          New Membership
        </span>
        <h2 className="font-serif text-3xl font-normal text-copen-black tracking-tight">
          Create Account
        </h2>
        <p className="text-xs text-copen-gray leading-relaxed">
          Join the Copenhagen community for bespoke curation, prioritized order processing, and exclusive previews.
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
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Fields: 2 Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="First Name"
            placeholder="Faizan"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            leftIcon={<User className="w-4 h-4 text-copen-muted" />}
            autoComplete="given-name"
            required
          />
          <Input
            label="Last Name"
            placeholder="Ahmed"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            autoComplete="family-name"
            required
          />
        </div>

        {/* Email Address */}
        <Input
          label="Email Address"
          type="email"
          placeholder="faizan@designstudio.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail className="w-4 h-4 text-copen-muted" />}
          autoComplete="email"
          required
        />

        {/* Password */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-medium uppercase tracking-wider text-copen-gray">
            Password <span className="text-olive-700">*</span>
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3 text-copen-muted pointer-events-none">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
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

          {/* Password Strength Indicator */}
          {password && (
            <div className="pt-1 space-y-1">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-copen-muted">
                <span>Password Strength</span>
                <span className="font-semibold">{passwordStrength.label}</span>
              </div>
              <div className="h-1 w-full bg-copen-border/60 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                  style={{ width: `${passwordStrength.score}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-medium uppercase tracking-wider text-copen-gray">
            Confirm Password <span className="text-olive-700">*</span>
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3 text-copen-muted pointer-events-none">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
              className="w-full bg-offwhite-surface border border-copen-border text-copen-black text-sm px-3.5 py-2.5 pl-9 pr-10 transition-colors placeholder:text-copen-muted/70 focus:outline-none focus:border-olive-600 focus:ring-1 focus:ring-olive-600"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 text-copen-muted hover:text-copen-black transition-colors cursor-pointer"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Terms & Newsletter agreements */}
        <div className="space-y-2.5 pt-2">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              required
              className="mt-0.5 w-4 h-4 rounded-xs border-copen-border text-olive-600 focus:ring-olive-600/30 accent-olive-600 cursor-pointer"
            />
            <span className="text-xs text-copen-gray leading-tight">
              I agree to the Copenhagen{' '}
              <span className="text-copen-black underline underline-offset-2">Terms of Service</span> and{' '}
              <span className="text-copen-black underline underline-offset-2">Privacy Policy</span>.
            </span>
          </label>

          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={subscribeNewsletter}
              onChange={(e) => setSubscribeNewsletter(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded-xs border-copen-border text-olive-600 focus:ring-olive-600/30 accent-olive-600 cursor-pointer"
            />
            <span className="text-xs text-copen-gray leading-tight">
              Subscribe to the Copenhagen Journal for architecture stories & member-only drops.
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="mt-2"
        >
          Create Copenhagen Account
        </Button>
      </form>

      {/* Switch to Sign In */}
      <div className="pt-2 text-center text-xs text-copen-gray border-t border-copen-border">
        <span>Already have an account? </span>
        <button
          type="button"
          onClick={handleLoginClick}
          className="text-olive-700 font-semibold hover:text-olive-900 transition-colors uppercase tracking-wider underline underline-offset-4 cursor-pointer ml-1"
        >
          Sign In
        </button>
      </div>

      {/* Security note */}
      <div className="flex items-center justify-center gap-1.5 text-[10px] text-copen-muted uppercase tracking-widest pt-1">
        <ShieldCheck className="w-3.5 h-3.5 text-olive-600" />
        <span>Your personal data is protected with 256-bit encryption</span>
      </div>
    </div>
  );
};
