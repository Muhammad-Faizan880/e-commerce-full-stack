import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  ChevronDown,
  User as UserIcon,
  LogOut,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  onSearchClick?: () => void;
  activeCategory?: string;
  onSelectCategory?: (category: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSearchClick,
  onSelectCategory,
}) => {
  const navigate = useNavigate();
  const { itemCount, setIsCartOpen, currentView, setCurrentView } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { label: 'DEMOS', category: 'all' },
    { label: 'FEATURES', category: 'seating' },
    { label: 'SHOP ALL', category: 'all' },
    { label: 'LIGHTING', category: 'lighting' },
    { label: 'BEDROOM', category: 'bedroom' },
    { label: 'JOURNAL', category: 'decor' },
  ];

  const handleNavClick = (cat: string) => {
    if (onSelectCategory) {
      onSelectCategory(cat);
    }
    if (currentView !== 'shop') {
      setCurrentView('shop');
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-offwhite/95 backdrop-blur-md border-b border-copen-border transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Left: Mobile hamburger & Logo */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-copen-black hover:text-olive-700 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Logo matching screenshot: = copenhagen */}
            <div
              onClick={() => {
                setCurrentView('shop');
                if (onSelectCategory) onSelectCategory('all');
              }}
              className="flex items-center gap-2 cursor-pointer group select-none"
            >
              <div className="flex flex-col gap-0.5 justify-center py-1">
                <span className="w-3.5 h-[1.5px] bg-copen-black group-hover:bg-olive-600 transition-colors"></span>
                <span className="w-3.5 h-[1.5px] bg-copen-black group-hover:bg-olive-600 transition-colors"></span>
              </div>
              <span className="font-sans text-xl tracking-[0.2em] font-medium text-copen-black lowercase group-hover:text-olive-700 transition-colors">
                copenhagen
              </span>
            </div>
          </div>

          {/* Center: Desktop Navigation links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.category)}
                className="text-[11px] tracking-[0.16em] uppercase font-medium text-copen-gray hover:text-copen-black transition-colors py-2 relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-olive-600 transition-all duration-200 group-hover:w-full"></span>
              </button>
            ))}
          </nav>

          {/* Right: Search, Auth, Cart Bag */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Search Trigger */}
            {onSearchClick && (
              <button
                type="button"
                onClick={onSearchClick}
                className="p-2 text-copen-gray hover:text-copen-black transition-colors"
                aria-label="Search collection"
                title="Search collection"
              >
                <Search className="w-4 h-4" />
              </button>
            )}

            {/* Authentication / Account Button */}
            <div className="relative" ref={userDropdownRef}>
              {isAuthenticated && user ? (
                <button
                  type="button"
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 bg-offwhite-card hover:bg-offwhite-hover border border-copen-border rounded-xs transition-all cursor-pointer group"
                  aria-label="Open member account menu"
                >
                  <div className="w-6 h-6 rounded-full bg-olive-700 text-offwhite-50 text-[10px] font-semibold flex items-center justify-center uppercase">
                    {user.firstName.charAt(0)}
                  </div>
                  <span className="hidden sm:inline text-[11px] font-medium uppercase tracking-wider text-copen-black group-hover:text-olive-800">
                    {user.firstName}
                  </span>
                  <ChevronDown className="w-3 h-3 text-copen-muted hidden sm:inline" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setCurrentView('auth')}
                  className="flex items-center gap-1.5 p-2 text-copen-gray hover:text-copen-black transition-colors cursor-pointer group"
                  aria-label="Sign In to Copenhagen"
                  title="Sign In / Register"
                >
                  <UserIcon className="w-4 h-4 text-copen-black group-hover:text-olive-700 transition-colors" />
                  <span className="hidden md:inline text-[10px] uppercase tracking-widest font-medium">
                    Sign In
                  </span>
                </button>
              )}

              {/* User Account Dropdown */}
              {userDropdown && isAuthenticated && user && (
                <div className="absolute right-0 mt-2 w-56 bg-offwhite-surface border border-copen-border shadow-xl py-2 z-50 animate-fade-in text-xs">
                  <div className="px-4 py-2 border-b border-copen-border">
                    <p className="font-semibold text-copen-black truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-[10px] text-copen-muted truncate mt-0.5">
                      {user.email}
                    </p>
                    <div className="mt-1 flex items-center gap-1 text-[9px] uppercase tracking-widest text-olive-800 font-semibold">
                      <Sparkles className="w-2.5 h-2.5 text-olive-600" />
                      <span>{user.memberTier || 'Member'}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setCurrentView('account');
                      setUserDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-offwhite-hover text-copen-black text-[11px] uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-olive-600" />
                    <span>My Account & Orders</span>
                  </button>

                  {/* Admin Control Panel shortcut if user.role === 'admin' */}
                  {user?.role === 'admin' && (
                    <button
                      type="button"
                      onClick={() => {
                        navigate('/admin');
                        setUserDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2.5 bg-olive-50/70 hover:bg-olive-100/70 text-olive-900 text-[11px] uppercase tracking-wider font-semibold transition-colors flex items-center gap-2 border-t border-olive-200/60 cursor-pointer"
                    >
                      <ShieldAlert className="w-3.5 h-3.5 text-olive-700" />
                      <span>Admin Control Panel</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setUserDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-rose-50 text-rose-700 text-[11px] uppercase tracking-wider transition-colors flex items-center gap-2 border-t border-copen-border/60 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-600" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Shopping Bag Button (Olive accent with count badge) */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 bg-offwhite-card hover:bg-offwhite-hover border border-copen-border transition-all rounded-xs group flex items-center justify-center cursor-pointer"
              aria-label={`Open shopping cart with ${itemCount} items`}
            >
              <ShoppingBag className="w-4 h-4 text-copen-black group-hover:text-olive-700 transition-colors" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-olive-600 text-offwhite-50 text-[10px] font-semibold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-offwhite-surface border-b border-copen-border px-6 py-6 space-y-4 animate-fade-in">
          {/* Mobile Auth Bar */}
          <div className="pb-3 border-b border-copen-border">
            {isAuthenticated && user ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-copen-black">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-[10px] text-copen-muted">{user.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentView('account');
                      setMobileMenuOpen(false);
                    }}
                    className="text-[11px] uppercase tracking-wider text-olive-700 font-semibold hover:underline"
                  >
                    Account
                  </button>
                  {user?.role === 'admin' && (
                    <>
                      <span className="text-copen-muted">•</span>
                      <button
                        type="button"
                        onClick={() => {
                          navigate('/admin');
                          setMobileMenuOpen(false);
                        }}
                        className="text-[11px] uppercase tracking-wider text-olive-900 font-bold hover:underline"
                      >
                        Admin
                      </button>
                    </>
                  )}
                  <span className="text-copen-muted">•</span>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-[11px] uppercase tracking-wider text-rose-600 hover:underline"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setCurrentView('auth');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 bg-olive-600 hover:bg-olive-700 text-offwhite-50 text-xs uppercase tracking-widest font-medium text-center rounded-xs flex items-center justify-center gap-2"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Sign In / Create Account</span>
              </button>
            )}
          </div>

          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.category)}
                className="text-left text-xs tracking-widest uppercase font-medium text-copen-black py-2 border-b border-copen-border/40 hover:text-olive-700"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

