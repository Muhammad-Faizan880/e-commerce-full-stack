import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft, KeyRound } from 'lucide-react';
import { resetPasswordApi } from '../../api/authApi';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const ResetPasswordView: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    !token ? 'Reset token is missing from the URL. Please click the link sent to your email.' : null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!token) {
      setErrorMessage('Reset token is missing or malformed.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    try {
      setIsLoading(true);
      await resetPasswordApi(token, password);
      setIsSuccess(true);
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { message?: string } }; message?: string };
      setErrorMessage(
        apiErr.response?.data?.message ||
        apiErr.message ||
        'This reset link is invalid or has expired. Please request a new one.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] bg-offwhite py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center animate-fade-in">
      <div className="w-full max-w-md bg-offwhite-surface border border-copen-border p-6 sm:p-10 shadow-sm space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-full bg-olive-50 border border-olive-200 text-olive-700 flex items-center justify-center mb-3">
            <KeyRound className="w-6 h-6 text-olive-700" />
          </div>
          <h1 className="font-serif text-3xl text-copen-black">
            {isSuccess ? 'Password Updated' : 'Choose New Password'}
          </h1>
          <p className="text-xs text-copen-gray leading-relaxed">
            {isSuccess
              ? 'Your Copenhagen account credentials have been securely updated.'
              : 'Please enter and confirm your new secure password below.'}
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xs flex items-start gap-2.5 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p>{errorMessage}</p>
              <Link to="/auth" className="text-rose-900 font-semibold underline block mt-1">
                Return to Login & Request Again
              </Link>
            </div>
          </div>
        )}

        {/* Success View */}
        {isSuccess ? (
          <div className="space-y-6 text-center animate-fade-in">
            <div className="p-4 bg-olive-50 border border-olive-200 text-olive-900 text-xs rounded-xs flex items-center gap-2 justify-center">
              <CheckCircle2 className="w-4 h-4 text-olive-700 shrink-0" />
              <span>Your new password is now active.</span>
            </div>
            <Button
              type="button"
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => navigate('/auth')}
              className="bg-olive-600 hover:bg-olive-700 text-offwhite-50 text-xs tracking-widest uppercase font-semibold"
            >
              Sign In to Your Account
            </Button>
          </div>
        ) : (
          /* Form View */
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-copen-muted hover:text-copen-black transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              required
            />

            <Input
              label="Confirm New Password"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              className="bg-olive-600 hover:bg-olive-700 text-offwhite-50 text-xs tracking-widest uppercase font-semibold"
            >
              Update Password
            </Button>

            <div className="pt-2 text-center">
              <Link
                to="/auth"
                className="inline-flex items-center gap-1.5 text-xs text-copen-muted hover:text-copen-black transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordView;
