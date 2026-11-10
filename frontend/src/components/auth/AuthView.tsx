import React from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { PasswordResetSuccess } from './PasswordResetSuccess';

export const AuthView: React.FC = () => {
  const { authMode, setAuthMode } = useAuth();
  const { setCurrentView } = useCart();

  const benefits = [
    {
      title: 'Bespoke Order Tracking',
      desc: 'Real-time production and transit updates directly from Scandinavian workshops.',
    },
    {
      title: 'Private Archive & Previews',
      desc: 'First access to limited-edition furniture releases and rare wood finishes.',
    },
    {
      title: 'Curated Architectural Consult',
      desc: 'Connect with interior consultants for room planning and material samples.',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-140px)] bg-offwhite py-8 sm:py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setCurrentView('shop')}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-copen-gray hover:text-copen-black transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Return to Collection</span>
          </button>

          <span className="text-[11px] uppercase tracking-widest text-copen-muted font-mono">
            COPENHAGEN ID • SECURE ACCESS
          </span>
        </div>

        {/* Dual Column Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-12 bg-offwhite-surface border border-copen-border shadow-sm overflow-hidden">
          {/* Left Column: Editorial Atmosphere & Heritage */}
          <div className="sm:block hidden lg:col-span-5 bg-olive-900 text-offwhite-50 p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
            {/* Background Texture & Ambient Light */}
            <div className="absolute inset-0 opacity-15 pointer-events-none mix-blend-overlay">
              <img
                src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1200&q=80"
                alt="Scandinavian architecture"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-olive-600/20 rounded-full blur-3xl pointer-events-none" />

            {/* Top Branding */}
            <div className="relative z-10 space-y-4 ">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-olive-400 rounded-full inline-block" />
                <span className="text-xs uppercase tracking-[0.25em] text-olive-200 font-medium">
                  Copenhagen Atelier
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-normal leading-tight tracking-tight text-offwhite-50">
                Form follows feeling. Design made for calm, enduring living.
              </h1>
            </div>

            {/* Middle: Member Privileges */}
            <div className="relative z-10 my-10 space-y-6">
              <p className="text-xs uppercase tracking-[0.2em] text-olive-300 font-semibold border-b border-olive-800 pb-2">
                Exclusive Member Privileges
              </p>
              <div className="space-y-4.5">
                {benefits.map((b) => (
                  <div key={b.title} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-olive-800 border border-olive-700 text-olive-300 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-olive-300" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-offwhite-100">
                        {b.title}
                      </h4>
                      <p className="text-[11px] text-olive-200/80 leading-relaxed mt-0.5">
                        {b.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Quote & Heritage */}
            <div className="relative z-10 pt-6 border-t border-olive-800/80 flex items-center justify-between text-[11px] text-olive-300">
              <span className="italic font-serif">Nordic Aesthetics • Est. Copenhagen</span>
              <span className="uppercase tracking-widest text-[9px] px-2 py-0.5 bg-olive-800/60 border border-olive-700/50 rounded-xs">
                Verified Portal
              </span>
            </div>
          </div>

          {/* Right Column: Interactive Form Screens */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-14 flex flex-col justify-center bg-offwhite-surface">
            {/* Tab Navigation if in login or register mode */}
            {(authMode === 'login' || authMode === 'register') && (
              <div className="max-w-md mx-auto w-full mb-8 flex items-center border-b border-copen-border">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 py-3 text-xs uppercase tracking-[0.18em] font-medium transition-all text-center relative cursor-pointer ${
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
                  className={`flex-1 py-3 text-xs uppercase tracking-[0.18em] font-medium transition-all text-center relative cursor-pointer ${
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
            )}

            {/* Screen Content */}
            <div className="w-full">
              {authMode === 'login' && (
                <LoginForm
                  onSuccess={() => setCurrentView('shop')}
                  onSwitchToRegister={() => setAuthMode('register')}
                  onSwitchToForgot={() => setAuthMode('forgot-password')}
                />
              )}

              {authMode === 'register' && (
                <RegisterForm
                  onSuccess={() => setAuthMode('login')}
                  onSwitchToLogin={() => setAuthMode('login')}
                />
              )}

              {authMode === 'forgot-password' && (
                <ForgotPasswordForm onSwitchToLogin={() => setAuthMode('login')} />
              )}

              {authMode === 'reset-sent' && (
                <PasswordResetSuccess onSwitchToLogin={() => setAuthMode('login')} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
