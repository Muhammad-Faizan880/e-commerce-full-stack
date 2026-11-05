import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Award } from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../../context/ToastContext';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email', 'error');
      return;
    }
    showToast('Thank you for subscribing to Copenhagen Journal', 'success');
    setEmail('');
  };

  return (
    <footer className="bg-offwhite-surface border-t border-copen-border mt-24">
      {/* Brand value pillars */}
      <div className="border-b border-copen-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <Truck className="w-5 h-5 text-olive-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-copen-black">
                Nordic Shipping
              </h4>
              <p className="text-xs text-copen-muted mt-0.5">Carbon-neutral transit worldwide</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <RefreshCw className="w-5 h-5 text-olive-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-copen-black">
                30-Day In-Home Trial
              </h4>
              <p className="text-xs text-copen-muted mt-0.5">Hassle-free return collection</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-olive-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-copen-black">
                10-Year Guarantee
              </h4>
              <p className="text-xs text-copen-muted mt-0.5">Master joinery & premium timber</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Award className="w-5 h-5 text-olive-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-copen-black">
                FSC Certified
              </h4>
              <p className="text-xs text-copen-muted mt-0.5">100% sustainable European forests</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand info */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex flex-col gap-0.5 justify-center py-1">
                <span className="w-3.5 h-[1.5px] bg-copen-black"></span>
                <span className="w-3.5 h-[1.5px] bg-copen-black"></span>
              </div>
              <span className="font-sans text-xl tracking-[0.2em] font-medium text-copen-black lowercase">
                copenhagen
              </span>
            </div>
            <p className="text-xs text-copen-gray leading-relaxed max-w-sm">
              Consciously crafted Scandinavian furniture, architectural lighting, and tactile homewares designed to age gracefully alongside your memories.
            </p>
            <div className="pt-2 text-[11px] text-copen-muted">
              Studio: Strøget 42, 1160 København K, Denmark
            </div>
          </div>

          {/* Quick links */}
          <div className="md:col-span-2 space-y-3">
            <h5 className="text-[11px] font-semibold uppercase tracking-widest text-copen-black">
              Collections
            </h5>
            <ul className="space-y-2 text-xs text-copen-gray">
              <li><span className="hover:text-olive-700 cursor-pointer">Lounge Seating</span></li>
              <li><span className="hover:text-olive-700 cursor-pointer">Ambient Lighting</span></li>
              <li><span className="hover:text-olive-700 cursor-pointer">Bedroom & Storage</span></li>
              <li><span className="hover:text-olive-700 cursor-pointer">Dining & Coffee Tables</span></li>
              <li><span className="hover:text-olive-700 cursor-pointer">Tactile Decor</span></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="md:col-span-2 space-y-3">
            <h5 className="text-[11px] font-semibold uppercase tracking-widest text-copen-black">
              Client Service
            </h5>
            <ul className="space-y-2 text-xs text-copen-gray">
              <li><span className="hover:text-olive-700 cursor-pointer">Care Guides</span></li>
              <li><span className="hover:text-olive-700 cursor-pointer">Shipping & White Glove</span></li>
              <li><span className="hover:text-olive-700 cursor-pointer">Trade & Architects</span></li>
              <li><span className="hover:text-olive-700 cursor-pointer">Returns & Exchanges</span></li>
              <li><span className="hover:text-olive-700 cursor-pointer">Contact Our Team</span></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-4 space-y-3">
            <h5 className="text-[11px] font-semibold uppercase tracking-widest text-copen-black">
              Join Copenhagen Journal
            </h5>
            <p className="text-xs text-copen-gray">
              Receive curated interior studies, private showroom preview invitations, and 10% off your initial acquisition.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="w-full bg-offwhite border border-copen-border text-xs px-3.5 py-2.5 text-copen-black placeholder:text-copen-muted focus:outline-none focus:border-olive-600 focus:ring-1 focus:ring-olive-600"
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="px-4 shrink-0"
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              <span className="text-[10px] text-copen-muted block">
                By subscribing you agree to our Nordic Privacy Policy. Unsubscribe anytime.
              </span>
            </form>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-copen-border/80 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-copen-muted gap-4">
          <p>© {new Date().getFullYear()} Copenhagen Design Group. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-copen-black cursor-pointer">Privacy Policy</span>
            <span className="hover:text-copen-black cursor-pointer">Terms of Service</span>
            <span className="hover:text-copen-black cursor-pointer">Cookie Settings</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

