export interface User {
  id: string;
  firstName: string;
  lastName: string;
  name?: string;
  email: string;
  role?: string;
  phone?: string;
  address?: string;
  apartment?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  avatarUrl?: string;
  memberTier?: 'Member' | 'Private Collector' | 'Architect Club';
  memberSince?: string;
  ordersCount?: number;
}

export type AuthMode = 'login' | 'register' | 'forgot-password' | 'reset-sent';

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
  subscribeNewsletter: boolean;
}

export interface ResetPasswordFormData {
  email: string;
}

