import React, { useState } from 'react';
import {
  User,
  Package,
  MapPin,
  LogOut,
  ArrowLeft,
  CheckCircle2,
  Edit2,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const AccountView: React.FC = () => {
  const { user, logout, updateProfile, isAuthenticated } = useAuth();
  const { setCurrentView, lastOrder } = useCart();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses'>('profile');
  const [isEditing, setIsEditing] = useState(false);

  // Edit form state
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [city, setCity] = useState(user?.city || '');
  const [country, setCountry] = useState(user?.country || 'Canada');

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-offwhite">
        <div className="w-16 h-16 rounded-full bg-olive-50 border border-olive-200 text-olive-700 flex items-center justify-center mb-4">
          <User className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-3xl text-copen-black mb-2">Member Portal</h2>
        <p className="text-xs text-copen-gray max-w-sm mb-6">
          Please sign in to access your Copenhagen account details and orders.
        </p>
        <Button
          variant="primary"
          onClick={() => setCurrentView('auth')}
          size="lg"
        >
          Sign In to Your Account
        </Button>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      firstName,
      lastName,
      phone,
      address,
      city,
      country,
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    setCurrentView('shop');
  };

  return (
    <div className="min-h-[calc(100vh-140px)] bg-offwhite py-8 sm:py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setCurrentView('shop')}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-copen-gray hover:text-copen-black transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Continue Shopping</span>
          </button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            leftIcon={<LogOut className="w-3.5 h-3.5" />}
            className="text-rose-700 hover:text-rose-900"
          >
            Sign Out
          </Button>
        </div>

        {/* Member Banner Card */}
        <div className="bg-offwhite-surface border border-copen-border p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-olive-700 text-offwhite-50 flex items-center justify-center font-serif text-2xl font-light tracking-wide shadow-sm">
              {user.firstName.charAt(0)}
              {user.lastName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl sm:text-3xl text-copen-black">
                  {user.firstName} {user.lastName}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-olive-100 text-olive-800 border border-olive-300 text-[10px] uppercase tracking-widest font-semibold rounded-xs">
                  <Sparkles className="w-3 h-3 text-olive-600" />
                  {user.memberTier || 'Member'}
                </span>
              </div>
              <p className="text-xs text-copen-gray mt-1">
                {user.email} • Member since {user.memberSince || '2024'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              leftIcon={<Edit2 className="w-3.5 h-3.5" />}
            >
              {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setCurrentView('shop')}
              leftIcon={<ShoppingBag className="w-3.5 h-3.5" />}
            >
              Browse Shop
            </Button>
          </div>
        </div>

        {/* Horizontal Navigation Tabs */}
        <div className="border-b border-copen-border flex gap-8">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`pb-3 text-xs uppercase tracking-widest font-medium transition-colors relative cursor-pointer ${
              activeTab === 'profile'
                ? 'text-copen-black font-semibold'
                : 'text-copen-gray hover:text-copen-black'
            }`}
          >
            Profile Information
            {activeTab === 'profile' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-olive-600" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`pb-3 text-xs uppercase tracking-widest font-medium transition-colors relative cursor-pointer ${
              activeTab === 'orders'
                ? 'text-copen-black font-semibold'
                : 'text-copen-gray hover:text-copen-black'
            }`}
          >
            Order History
            {activeTab === 'orders' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-olive-600" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('addresses')}
            className={`pb-3 text-xs uppercase tracking-widest font-medium transition-colors relative cursor-pointer ${
              activeTab === 'addresses'
                ? 'text-copen-black font-semibold'
                : 'text-copen-gray hover:text-copen-black'
            }`}
          >
            Saved Addresses
            {activeTab === 'addresses' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-olive-600" />
            )}
          </button>
        </div>

        {/* Tab 1: Profile View / Edit */}
        {activeTab === 'profile' && (
          <div className="bg-offwhite-surface border border-copen-border p-6 sm:p-8">
            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-6 max-w-xl">
                <h3 className="font-serif text-xl text-copen-black">Update Account Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                  <Input
                    label="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
                <Input
                  label="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                />
                <Input
                  label="Street Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street and house/unit number"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                  <Input
                    label="Country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="submit" variant="primary" size="md">
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xs uppercase tracking-widest font-semibold text-copen-gray border-b border-copen-border pb-2">
                      Personal Information
                    </h3>
                    <div className="space-y-3 text-xs">
                      <div>
                        <span className="text-copen-muted uppercase tracking-wider block text-[10px]">
                          Full Name
                        </span>
                        <p className="text-sm font-medium text-copen-black mt-0.5">
                          {user.firstName} {user.lastName}
                        </p>
                      </div>
                      <div>
                        <span className="text-copen-muted uppercase tracking-wider block text-[10px]">
                          Email Address
                        </span>
                        <p className="text-sm font-medium text-copen-black mt-0.5">
                          {user.email}
                        </p>
                      </div>
                      <div>
                        <span className="text-copen-muted uppercase tracking-wider block text-[10px]">
                          Contact Phone
                        </span>
                        <p className="text-sm font-medium text-copen-black mt-0.5">
                          {user.phone || 'Not specified'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs uppercase tracking-widest font-semibold text-copen-gray border-b border-copen-border pb-2">
                      Default Delivery Destination
                    </h3>
                    <div className="space-y-3 text-xs">
                      <div>
                        <span className="text-copen-muted uppercase tracking-wider block text-[10px]">
                          Street Address
                        </span>
                        <p className="text-sm font-medium text-copen-black mt-0.5">
                          {user.address || 'Not specified yet'}
                        </p>
                      </div>
                      <div>
                        <span className="text-copen-muted uppercase tracking-wider block text-[10px]">
                          City / State / Postal
                        </span>
                        <p className="text-sm font-medium text-copen-black mt-0.5">
                          {user.city ? `${user.city}${user.state ? `, ${user.state}` : ''}${user.postalCode ? ` ${user.postalCode}` : ''}` : 'Not specified yet'}
                        </p>
                      </div>
                      <div>
                        <span className="text-copen-muted uppercase tracking-wider block text-[10px]">
                          Country
                        </span>
                        <p className="text-sm font-medium text-copen-black mt-0.5">
                          {user.country || 'Not specified yet'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

             
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {lastOrder ? (
              <div className="bg-offwhite-surface border border-copen-border p-6 rounded-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-copen-border gap-2">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-olive-700 font-semibold">
                      Latest Order
                    </span>
                    <h3 className="font-serif text-xl text-copen-black">
                      Order #{lastOrder.orderId}
                    </h3>
                    <p className="text-[11px] text-copen-gray">
                      Placed on {lastOrder.orderDate}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-olive-100 text-olive-800 text-[10px] uppercase tracking-widest font-semibold rounded-xs">
                      <CheckCircle2 className="w-3 h-3 text-olive-600" />
                      Confirmed
                    </span>
                    <span className="text-sm font-semibold text-copen-black">
                      ${lastOrder.total.toFixed(2)} CAD
                    </span>
                  </div>
                </div>

                {/* Items in this order */}
                <div className="space-y-3">
                  {lastOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-2 border-b border-copen-border/40 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded-xs border border-copen-border"
                        />
                        <div>
                          <p className="font-medium text-copen-black">{item.product.name}</p>
                          <p className="text-[11px] text-copen-muted">
                            Qty: {item.quantity} • {item.selectedColor || 'Default'}
                          </p>
                        </div>
                      </div>
                      <span className="font-medium text-copen-black">
                        ${(item.product.price * item.quantity).toFixed(2)} CAD
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-offwhite-surface border border-copen-border p-12 text-center space-y-4">
                <Package className="w-10 h-10 text-copen-muted mx-auto" />
                <h3 className="font-serif text-2xl text-copen-black">No Recent Orders</h3>
                <p className="text-xs text-copen-gray max-w-sm mx-auto">
                  Your Copenhagen order archive is currently empty. Explore our latest Nordic furniture and decor collections.
                </p>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setCurrentView('shop')}
                  leftIcon={<ShoppingBag className="w-4 h-4" />}
                >
                  Explore Collection
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Saved Addresses */}
        {activeTab === 'addresses' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-offwhite-surface border-2 border-olive-600/60 p-6 rounded-xs space-y-3 relative">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 bg-olive-100 text-olive-800 rounded-xs">
                  Default Address
                </span>
                <MapPin className="w-4 h-4 text-olive-600" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-copen-black">
                  {user.firstName} {user.lastName}
                </h4>
                {user.address ? (
                  <p className="text-xs text-copen-gray mt-1 leading-relaxed">
                    {user.address}<br />
                    {user.apartment && <>{user.apartment}<br /></>}
                    {user.city && <>{user.city}, </>}{user.state} {user.postalCode}<br />
                    {user.country}
                  </p>
                ) : (
                  <p className="text-xs text-copen-muted mt-1 italic">
                    No delivery address saved yet.
                  </p>
                )}
              </div>
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('profile');
                    setIsEditing(true);
                  }}
                  className="text-[11px] text-olive-700 font-medium uppercase tracking-wider hover:underline cursor-pointer"
                >
                  Edit Address
                </button>
              </div>
            </div>

            <div className="border border-dashed border-copen-border p-6 rounded-xs flex flex-col items-center justify-center text-center space-y-3 min-h-[160px] bg-offwhite/50">
              <MapPin className="w-6 h-6 text-copen-muted" />
              <p className="text-xs font-medium text-copen-black uppercase tracking-wider">
                Add Secondary Address
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setActiveTab('profile');
                  setIsEditing(true);
                }}
              >
                + Add Address
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
